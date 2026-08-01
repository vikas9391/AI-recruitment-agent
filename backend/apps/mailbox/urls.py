from django.urls import path

from .views import (
    GmailAccountStatusView,
    GmailConnectView,
    GmailOAuthCallbackView,
    PullResumesView,
)

urlpatterns = [
    path("connect/", GmailConnectView.as_view(), name="mailbox-connect"),
    path("oauth2callback/", GmailOAuthCallbackView.as_view(), name="mailbox-oauth2callback"),
    path("status/", GmailAccountStatusView.as_view(), name="mailbox-status"),
    path("jobs/<int:pk>/pull-resumes/", PullResumesView.as_view(), name="mailbox-pull-resumes"),
]
