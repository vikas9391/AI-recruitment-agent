from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmailLogViewSet, EmailTemplateViewSet, InterviewScheduleViewSet, SendManualEmailView

router = DefaultRouter()
router.register(r"email-templates", EmailTemplateViewSet, basename="email-templates")
router.register(r"email-logs", EmailLogViewSet, basename="email-logs")
router.register(r"interviews", InterviewScheduleViewSet, basename="interviews")

urlpatterns = [
    path("emails/send/", SendManualEmailView.as_view(), name="send-manual-email"),
    path("", include(router.urls)),
]