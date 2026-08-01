from django.conf import settings
from django.core import signing
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.common.utils import api_response
from apps.jobs.permissions import IsHRAdmin
from apps.jobs.services import JobService

from .models import GmailAccount
from .serializers import GmailAccountStatusSerializer
from .services import GmailOAuthService, ResumeIngestionService

STATE_SALT = "mailbox.gmail-oauth"


class GmailConnectView(APIView):
    """GET /api/mailbox/connect/ — HR Admin kicks off the Google consent flow."""

    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        state = signing.dumps({"company_id": request.user.company_id}, salt=STATE_SALT)
        auth_url = GmailOAuthService.get_authorization_url(state)
        return api_response(True, "Authorization URL generated.", {"authorization_url": auth_url}, status.HTTP_200_OK)


class GmailOAuthCallbackView(APIView):
    """
    GET /api/mailbox/oauth2callback/ — Google redirects the browser here
    with ?code=...&state=.... Not authenticated via JWT (it's a browser
    redirect from Google), so the company is recovered from the signed
    state param instead.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        from apps.authentication.models.company_model import Company

        code = request.query_params.get("code")
        state = request.query_params.get("state")
        error = request.query_params.get("error")

        frontend_base = settings.FRONTEND_URL.rstrip("/")

        if error:
            return redirect(f"{frontend_base}/dashboard/settings/mailbox?status=error&reason={error}")
        if not code or not state:
            return redirect(f"{frontend_base}/dashboard/settings/mailbox?status=error&reason=missing_params")

        try:
            payload = signing.loads(state, salt=STATE_SALT, max_age=600)
            company = Company.objects.get(id=payload["company_id"])
        except (signing.BadSignature, Company.DoesNotExist):
            return redirect(f"{frontend_base}/dashboard/settings/mailbox?status=error&reason=invalid_state")

        try:
            GmailOAuthService.exchange_code(code, company)
        except Exception:  # noqa: BLE001
            return redirect(f"{frontend_base}/dashboard/settings/mailbox?status=error&reason=exchange_failed")

        return redirect(f"{frontend_base}/dashboard/settings/mailbox?status=connected")


class GmailAccountStatusView(APIView):
    """GET /api/mailbox/status/ — is a mailbox connected for my company?"""

    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        account = GmailAccount.objects.filter(company=request.user.company).first()
        if not account:
            return api_response(True, "No mailbox connected.", {"connected": False}, status.HTTP_200_OK)
        serializer = GmailAccountStatusSerializer(account)
        return api_response(True, "Mailbox status fetched.", {"connected": True, **serializer.data}, status.HTTP_200_OK)


class PullResumesView(APIView):
    """
    POST /api/mailbox/jobs/<pk>/pull-resumes/ — manual re-trigger.
    Job creation already runs this synchronously; this exists so HR can
    re-run it later (e.g. after connecting Gmail, or to pick up new mail).
    """

    permission_classes = [IsAuthenticated, IsHRAdmin]

    def post(self, request, pk: int):
        job = JobService.get_job(int(pk), request.user)
        summary = ResumeIngestionService.pull_resumes_for_job(job, request.user)
        return api_response(True, "Resume pull finished.", summary, status.HTTP_200_OK)
