from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ApplicationViewSet, ApplyForJobView, ReprocessApplicationView, CandidateApplicationHistoryView,CandidateApplicationStatusView,CandidateApplicationTimelineView,CandidateDashboardView,CandidateDocumentView,CandidateResumeHistoryView

router = DefaultRouter()
router.register(r"applications", ApplicationViewSet, basename="applications")

urlpatterns = [
    path("apply/", ApplyForJobView.as_view(), name="apply-for-job"),
    path("applications/<int:pk>/reprocess/", ReprocessApplicationView.as_view(), name="application-reprocess"),
    path("", include(router.urls)),
    path("candidates/dashboard/", CandidateDashboardView.as_view(), name="candidate-dashboard"),
    path("candidates/applications/", CandidateApplicationHistoryView.as_view(), name="candidate-application-history"),
    path("candidates/applications/<int:pk>/status/", CandidateApplicationStatusView.as_view(), name="candidate-application-status"),
    path("candidates/applications/<int:pk>/timeline/", CandidateApplicationTimelineView.as_view(), name="candidate-application-timeline"),
    path("candidates/resumes/", CandidateResumeHistoryView.as_view(), name="candidate-resume-history"),
    path("candidates/documents/", CandidateDocumentView.as_view(), name="candidate-documents"),
]