from django.db import models

from apps.authentication.models.company_model import Company


class GmailAccount(models.Model):
    """
    Stores the OAuth2 refresh token for the company mailbox that is
    monitored for inbound resume emails. One mailbox per company.

    The refresh token is the only long-lived secret we keep — access
    tokens are minted on demand and never persisted.
    """

    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        related_name="gmail_account",
    )
    gmail_address = models.EmailField()
    refresh_token = models.TextField()
    is_active = models.BooleanField(default=True)

    # Gmail's historyId lets us do incremental sync later; for now we
    # just track the id of the last message we successfully ingested
    # per job so re-running ingestion doesn't duplicate applications.
    last_synced_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gmail_accounts"
        verbose_name = "Gmail Account"
        verbose_name_plural = "Gmail Accounts"

    def __str__(self) -> str:
        return f"{self.gmail_address} ({self.company.company_name})"


class ProcessedResumeEmail(models.Model):
    """
    Idempotency guard. Records every Gmail message id we've already
    turned into an Application for a given job, so re-triggering
    ingestion (e.g. re-opening a job) never creates duplicates.
    """

    job = models.ForeignKey(
        "jobs.Job",
        on_delete=models.CASCADE,
        related_name="processed_resume_emails",
    )
    gmail_message_id = models.CharField(max_length=100)
    sender_email = models.EmailField(blank=True)
    application = models.ForeignKey(
        "recruitment.Application",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="source_email",
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("INGESTED", "Ingested"),
            ("SKIPPED", "Skipped"),
            ("FAILED", "Failed"),
        ],
        default="INGESTED",
    )
    detail = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "processed_resume_emails"
        constraints = [
            models.UniqueConstraint(
                fields=["job", "gmail_message_id"], name="unique_job_gmail_message"
            )
        ]
        indexes = [models.Index(fields=["job", "gmail_message_id"])]

    def __str__(self) -> str:
        return f"{self.gmail_message_id} -> job {self.job_id} [{self.status}]"
