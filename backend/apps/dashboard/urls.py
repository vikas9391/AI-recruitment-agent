from django.urls import path

from .views import (
    ApplicationStatusBreakdownView,
    ApplicationsTimelineView,
    CandidateAnalyticsView,
    DashboardOverviewView,
    DepartmentDistributionView,
    JobAnalyticsView,
    RecentApplicationsView,
    ScreeningAnalyticsView,
    TopJobsView,
    UpcomingInterviewsView,
)

urlpatterns = [
    path("overview/", DashboardOverviewView.as_view(), name="dashboard-overview"),
    path("applications/status-breakdown/", ApplicationStatusBreakdownView.as_view(), name="dashboard-status-breakdown"),
    path("applications/timeline/", ApplicationsTimelineView.as_view(), name="dashboard-applications-timeline"),
    path("applications/recent/", RecentApplicationsView.as_view(), name="dashboard-recent-applications"),
    path("interviews/upcoming/", UpcomingInterviewsView.as_view(), name="dashboard-upcoming-interviews"),
    path("jobs/analytics/", JobAnalyticsView.as_view(), name="dashboard-job-analytics"),
    path("jobs/department-distribution/", DepartmentDistributionView.as_view(), name="dashboard-department-distribution"),
    path("jobs/top/", TopJobsView.as_view(), name="dashboard-top-jobs"),
    path("candidates/analytics/", CandidateAnalyticsView.as_view(), name="dashboard-candidate-analytics"),
    path("screening/analytics/", ScreeningAnalyticsView.as_view(), name="dashboard-screening-analytics"),
]