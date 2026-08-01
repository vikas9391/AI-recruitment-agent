import base64
import logging
import re
from email.utils import parseaddr
from typing import Any, Dict, List, Optional

from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from .models import GmailAccount, ProcessedResumeEmail

logger = logging.getLogger(__name__)

GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]
ALLOWED_RESUME_EXTENSIONS = ("pdf", "docx")
MAX_MESSAGES_PER_RUN = 25
PROCESSED_LABEL_NAME = "AI-Recruiter/Processed"


# --------------------------------------------------------------------------- #
# OAuth connect flow — one-time, per company, done by an HR Admin.
# --------------------------------------------------------------------------- #
class GmailOAuthService:

    @staticmethod
    def _client_config() -> Dict[str, Any]:
        return {
            "web": {
                "client_id": settings.GMAIL_CLIENT_ID,
                "client_secret": settings.GMAIL_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GMAIL_REDIRECT_URI],
            }
        }

    @staticmethod
    def get_authorization_url(state: str) -> str:
        # autogenerate_code_verifier=False: we're a confidential client
        # (client_secret) using a stateless callback across two separate
        # HTTP requests, so PKCE's code_verifier can't be carried over
        # from this Flow instance to the one exchange_code() builds later.
        flow = Flow.from_client_config(
            GmailOAuthService._client_config(),
            scopes=GMAIL_SCOPES,
            redirect_uri=settings.GMAIL_REDIRECT_URI,
            autogenerate_code_verifier=False,
        )
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",  # forces a refresh_token even on re-consent
            state=state,
        )
        return auth_url

    @staticmethod
    def exchange_code(code: str, company) -> GmailAccount:
        flow = Flow.from_client_config(
            GmailOAuthService._client_config(),
            scopes=GMAIL_SCOPES,
            redirect_uri=settings.GMAIL_REDIRECT_URI,
            autogenerate_code_verifier=False,
        )
        flow.fetch_token(code=code)
        credentials = flow.credentials

        if not credentials.refresh_token:
            raise ValidationError(
                "Google did not return a refresh token. Revoke this app's access at "
                "https://myaccount.google.com/permissions and try connecting again."
            )

        service = build("gmail", "v1", credentials=credentials, cache_discovery=False)
        profile = service.users().getProfile(userId="me").execute()
        gmail_address = profile["emailAddress"]

        account, _ = GmailAccount.objects.update_or_create(
            company=company,
            defaults={
                "gmail_address": gmail_address,
                "refresh_token": credentials.refresh_token,
                "is_active": True,
            },
        )
        return account


# --------------------------------------------------------------------------- #
# Authenticated Gmail API client for a company's mailbox.
# --------------------------------------------------------------------------- #
class GmailClient:

    def __init__(self, gmail_account: GmailAccount):
        self.account = gmail_account
        credentials = Credentials(
            token=None,
            refresh_token=gmail_account.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GMAIL_CLIENT_ID,
            client_secret=settings.GMAIL_CLIENT_SECRET,
            scopes=GMAIL_SCOPES,
        )
        self.service = build("gmail", "v1", credentials=credentials, cache_discovery=False)

    def ensure_processed_label(self) -> str:
        labels = self.service.users().labels().list(userId="me").execute().get("labels", [])
        existing = next((l for l in labels if l["name"] == PROCESSED_LABEL_NAME), None)
        if existing:
            return existing["id"]
        created = (
            self.service.users()
            .labels()
            .create(
                userId="me",
                body={
                    "name": PROCESSED_LABEL_NAME,
                    "labelListVisibility": "labelShow",
                    "messageListVisibility": "show",
                },
            )
            .execute()
        )
        return created["id"]

    def search_messages(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        results = (
            self.service.users()
            .messages()
            .list(userId="me", q=query, maxResults=max_results)
            .execute()
        )
        return results.get("messages", [])

    def get_message(self, message_id: str) -> Dict[str, Any]:
        return (
            self.service.users()
            .messages()
            .get(userId="me", id=message_id, format="full")
            .execute()
        )

    def get_attachment(self, message_id: str, attachment_id: str) -> bytes:
        attachment = (
            self.service.users()
            .messages()
            .attachments()
            .get(userId="me", messageId=message_id, id=attachment_id)
            .execute()
        )
        return base64.urlsafe_b64decode(attachment["data"])

    def mark_processed(self, message_id: str, label_id: str) -> None:
        self.service.users().messages().modify(
            userId="me",
            id=message_id,
            body={"removeLabelIds": ["UNREAD"], "addLabelIds": [label_id]},
        ).execute()


# --------------------------------------------------------------------------- #
# Resume ingestion — the synchronous, job-creation-triggered pipeline.
# --------------------------------------------------------------------------- #
class ResumeIngestionService:

    @staticmethod
    def _build_query(job) -> str:
        """
        Matches unread mail with an attachment, sent after the job was
        created, whose subject references the role. Candidates are asked
        to put the job title (or "Job ID <id>") in the subject line — the
        same convention referenced on the careers page / job posting.
        """
        after_ts = int(job.created_at.timestamp())
        title_terms = " OR ".join(
            f'subject:"{term}"' for term in ResumeIngestionService._subject_terms(job)
        )
        return f'is:unread has:attachment after:{after_ts} ({title_terms})'

    @staticmethod
    def _subject_terms(job) -> List[str]:
        terms = [job.title, f"Job ID {job.id}", f"#{job.id}"]
        return [t for t in terms if t]

    @staticmethod
    def _extract_sender(headers: List[Dict[str, str]]) -> tuple:
        raw_from = next((h["value"] for h in headers if h["name"].lower() == "from"), "")
        display_name, email_address = parseaddr(raw_from)
        if not display_name:
            display_name = email_address.split("@")[0] if email_address else "Candidate"
        parts = display_name.strip().split(" ", 1)
        first_name = parts[0] if parts else "Candidate"
        last_name = parts[1] if len(parts) > 1 else ""
        return first_name, last_name, email_address

    @staticmethod
    def _extract_resume_attachment(gmail: "GmailClient", message: Dict[str, Any]) -> Optional[ContentFile]:
        def walk(parts):
            for part in parts:
                filename = part.get("filename") or ""
                if filename:
                    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
                    if ext in ALLOWED_RESUME_EXTENSIONS:
                        body = part.get("body", {})
                        attachment_id = body.get("attachmentId")
                        if attachment_id:
                            data = gmail.get_attachment(message["id"], attachment_id)
                            return ContentFile(data, name=filename)
                if part.get("parts"):
                    found = walk(part["parts"])
                    if found:
                        return found
            return None

        payload = message.get("payload", {})
        return walk(payload.get("parts", []) or [])

    @staticmethod
    def pull_resumes_for_job(job, user=None) -> Dict[str, Any]:
        """
        Synchronous entrypoint. Called right after a job is created (or
        reopened). Looks at the company's connected Gmail mailbox, finds
        unread resume emails matching this job, and turns each one into
        a screened Application — reusing the exact same pipeline the
        public "Apply" form uses.

        Never raises: ingestion problems are logged and summarized in the
        returned dict so a broken mailbox connection can never block job
        creation itself.
        """
        summary = {"attempted": False, "found": 0, "created": 0, "skipped": 0, "failed": 0, "errors": []}

        gmail_account = GmailAccount.objects.filter(company=job.company, is_active=True).first()
        if not gmail_account:
            summary["errors"].append("No active Gmail account connected for this company.")
            return summary

        summary["attempted"] = True

        try:
            gmail = GmailClient(gmail_account)
            label_id = gmail.ensure_processed_label()
            query = ResumeIngestionService._build_query(job)
            messages = gmail.search_messages(query, MAX_MESSAGES_PER_RUN)
            summary["found"] = len(messages)
        except HttpError as exc:
            logger.exception("Gmail API error while searching mailbox for job %s", job.id)
            summary["errors"].append(f"Gmail API error: {exc}")
            return summary
        except Exception as exc:  # noqa: BLE001 — never let mailbox issues break job creation
            logger.exception("Unexpected error connecting to Gmail for job %s", job.id)
            summary["errors"].append(str(exc))
            return summary

        from apps.recruitment.services import ApplicationService

        for message_stub in messages:
            message_id = message_stub["id"]

            if ProcessedResumeEmail.objects.filter(job=job, gmail_message_id=message_id).exists():
                summary["skipped"] += 1
                continue

            try:
                message = gmail.get_message(message_id)
                headers = message.get("payload", {}).get("headers", [])
                first_name, last_name, sender_email = ResumeIngestionService._extract_sender(headers)

                if not sender_email:
                    ProcessedResumeEmail.objects.create(
                        job=job, gmail_message_id=message_id, status="SKIPPED",
                        detail="Could not parse sender email.",
                    )
                    summary["skipped"] += 1
                    continue

                resume_file = ResumeIngestionService._extract_resume_attachment(gmail, message)
                if not resume_file:
                    ProcessedResumeEmail.objects.create(
                        job=job, gmail_message_id=message_id, sender_email=sender_email,
                        status="SKIPPED", detail="No PDF/DOCX attachment found.",
                    )
                    summary["skipped"] += 1
                    gmail.mark_processed(message_id, label_id)
                    continue

                application = ApplicationService.apply_for_job({
                    "job_id": job.id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": sender_email,
                    "phone": "",
                    "cover_note": "Auto-submitted via inbox monitoring.",
                    "resume_file": resume_file,
                }, skip_status_check=True)
                ApplicationService.process_application(application.id)

                ProcessedResumeEmail.objects.create(
                    job=job, gmail_message_id=message_id, sender_email=sender_email,
                    application=application, status="INGESTED",
                )
                gmail.mark_processed(message_id, label_id)
                summary["created"] += 1

            except ValidationError as exc:
                # e.g. duplicate application for this candidate+job — expected, not a failure.
                ProcessedResumeEmail.objects.create(
                    job=job, gmail_message_id=message_id, status="SKIPPED", detail=str(exc)[:255],
                )
                summary["skipped"] += 1
            except Exception as exc:  # noqa: BLE001
                logger.exception("Failed to ingest Gmail message %s for job %s", message_id, job.id)
                ProcessedResumeEmail.objects.create(
                    job=job, gmail_message_id=message_id, status="FAILED", detail=str(exc)[:255],
                )
                summary["failed"] += 1
                summary["errors"].append(f"{message_id}: {exc}")

        gmail_account.last_synced_at = timezone.now()
        gmail_account.save(update_fields=["last_synced_at"])

        return summary