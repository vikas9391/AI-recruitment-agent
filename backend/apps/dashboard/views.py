from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.common.utils import api_response

from .permissions import IsHRUserOrAdmin
from .serializers import DateRangeFilterSerializer
from .services import (
    CandidateAnalyticsService,
    JobAnalyticsService,
    OverviewDashboardService,
    ScreeningAnalyticsService,
)


class DashboardOverviewView(APIView):
    """GET /dashboard/overview/?start_date=&end_date=  -> KPI summary."""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        filters = DateRangeFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = OverviewDashboardService.get_kpis(
            filters.validated_data.get("start_date"), filters.validated_data.get("end_date")
        )
        return api_response(True, "Dashboard KPIs fetched successfully.", data, 200)


class ApplicationStatusBreakdownView(APIView):
    """GET /dashboard/applications/status-breakdown/?start_date=&end_date="""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        filters = DateRangeFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = OverviewDashboardService.get_application_status_breakdown(
            filters.validated_data.get("start_date"), filters.validated_data.get("end_date")
        )
        return api_response(True, "Application status breakdown fetched successfully.", data, 200)


class ApplicationsTimelineView(APIView):
    """GET /dashboard/applications/timeline/?start_date=&end_date=&granularity=day|month"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        filters = DateRangeFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        granularity = request.query_params.get("granularity", "day")
        if granularity not in ("day", "month"):
            granularity = "day"
        data = OverviewDashboardService.get_applications_timeline(
            filters.validated_data.get("start_date"),
            filters.validated_data.get("end_date"),
            granularity,
        )
        return api_response(True, "Applications timeline fetched successfully.", data, 200)


class RecentApplicationsView(APIView):
    """GET /dashboard/applications/recent/?limit=10"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        limit = int(request.query_params.get("limit", 10))
        data = OverviewDashboardService.get_recent_applications(limit=limit)
        return api_response(True, "Recent applications fetched successfully.", data, 200)


class UpcomingInterviewsView(APIView):
    """GET /dashboard/interviews/upcoming/?limit=10"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        limit = int(request.query_params.get("limit", 10))
        data = OverviewDashboardService.get_upcoming_interviews(limit=limit)
        return api_response(True, "Upcoming interviews fetched successfully.", data, 200)


class JobAnalyticsView(APIView):
    """GET /dashboard/jobs/analytics/?department=&status="""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        data = JobAnalyticsService.get_job_analytics(request.query_params)
        return api_response(True, "Job analytics fetched successfully.", data, 200)


class DepartmentDistributionView(APIView):
    """GET /dashboard/jobs/department-distribution/"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        data = JobAnalyticsService.get_department_distribution()
        return api_response(True, "Department distribution fetched successfully.", data, 200)


class TopJobsView(APIView):
    """GET /dashboard/jobs/top/?limit=5"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        limit = int(request.query_params.get("limit", 5))
        data = JobAnalyticsService.get_top_jobs_by_applications(limit=limit)
        return api_response(True, "Top jobs fetched successfully.", data, 200)


class CandidateAnalyticsView(APIView):
    """GET /dashboard/candidates/analytics/"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        data = CandidateAnalyticsService.get_candidate_analytics()
        return api_response(True, "Candidate analytics fetched successfully.", data, 200)


class ScreeningAnalyticsView(APIView):
    """GET /dashboard/screening/analytics/"""

    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def get(self, request):
        data = ScreeningAnalyticsService.get_screening_analytics()
        return api_response(True, "Resume screening analytics fetched successfully.", data, 200)