from typing import Any, ClassVar, cast

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.common.pagination import StandardResultsSetPagination
from apps.common.utils import api_response

from .permissions import AllowCandidateSelfService, IsHRUserOrAdmin
from .serializers import (
    ApplicationDetailSerializer,
    ApplicationHistorySerializer,
    ApplicationListSerializer,
    ApplicationStatusUpdateSerializer,
    ApplyForJobSerializer,
    CandidateDashboardApplicationSerializer,
    CandidateDashboardSerializer,
    CandidateDocumentSerializer,
    CandidateDocumentUploadSerializer,
    CandidateLookupSerializer,
    RecruiterNotesUpdateSerializer,
    ResumeSerializer,
)
from .services import ApplicationService, CandidateDashboardService, CandidateDocumentService


class ApplyForJobView(APIView):
    """Public endpoint — candidate applies to a job with resume upload."""

    permission_classes: ClassVar = [AllowAny]
    parser_classes: ClassVar = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ApplyForJobSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        application = ApplicationService.apply_for_job(validated_data)

        # Run screening pipeline synchronously (no Celery yet per architecture).
        application = ApplicationService.process_application(application.pk)

        response_serializer = ApplicationDetailSerializer(application)
        return api_response(
            True,
            "Application submitted and screened successfully.",
            response_serializer.data,
            status.HTTP_201_CREATED,
        )


class ReprocessApplicationView(APIView):
    """Allows HR to manually re-trigger the screening pipeline for an application."""

    permission_classes: ClassVar = [IsAuthenticated, IsHRUserOrAdmin]

    def post(self, request, pk: str):
        application = ApplicationService.process_application(int(pk), request.user)
        serializer = ApplicationDetailSerializer(application)
        return api_response(True, "Application re-processed successfully.", serializer.data, status.HTTP_200_OK)


class ApplicationViewSet(viewsets.ViewSet):
    permission_classes: ClassVar = [IsAuthenticated, IsHRUserOrAdmin]
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        queryset = ApplicationService.list_applications(request.query_params, request.user)
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ApplicationListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk: str | None = None):
        assert pk is not None
        application = ApplicationService.get_application(int(pk), request.user)
        serializer = ApplicationDetailSerializer(application)
        return api_response(True, "Application fetched successfully.", serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="analysis")
    def analysis(self, request, pk: str | None = None):
        assert pk is not None
        application = ApplicationService.get_application(int(pk), request.user)
        analysis = getattr(application, "analysis", None)
        if analysis is None:
            return api_response(
                False, "Resume analysis not available for this application.", {}, status.HTTP_404_NOT_FOUND
            )
        from .serializers import ResumeAnalysisSerializer

        serializer = ResumeAnalysisSerializer(analysis)
        return api_response(True, "Resume analysis fetched successfully.", serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="score")
    def score(self, request, pk: str | None = None):
        assert pk is not None
        application = ApplicationService.get_application(int(pk), request.user)
        score = getattr(application, "score", None)
        if score is None:
            return api_response(
                False, "Resume score not available for this application.", {}, status.HTTP_404_NOT_FOUND
            )
        from .serializers import ResumeScoreSerializer

        serializer = ResumeScoreSerializer(score)
        return api_response(True, "Resume score fetched successfully.", serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="timeline")
    def timeline(self, request, pk: str | None = None):
        assert pk is not None
        application = ApplicationService.get_application(int(pk), request.user)
        from .serializers import ApplicationHistorySerializer as HistorySerializer

        history_manager = getattr(application, "history")
        serializer = HistorySerializer(history_manager.all(), many=True)
        return api_response(True, "Application timeline fetched successfully.", serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk: str | None = None):
        assert pk is not None
        serializer = ApplicationStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        application = ApplicationService.update_status(
            int(pk),
            validated_data["status"],
            validated_data.get("remarks", ""),
            request.user,
        )
        response_serializer = ApplicationDetailSerializer(application)
        return api_response(True, "Application status updated successfully.", response_serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="notes")
    def update_notes(self, request, pk: str | None = None):
        assert pk is not None
        serializer = RecruiterNotesUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        application = ApplicationService.update_recruiter_notes(
            int(pk), validated_data["recruiter_notes"], request.user
        )
        response_serializer = ApplicationDetailSerializer(application)
        return api_response(True, "Recruiter notes updated successfully.", response_serializer.data, status.HTTP_200_OK)


class CandidateDashboardView(APIView):
    """GET /candidates/dashboard/?email=candidate@example.com"""

    permission_classes: ClassVar = [AllowCandidateSelfService]

    def get(self, request):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        dashboard_data = CandidateDashboardService.get_dashboard(validated_data["email"])
        response_serializer = CandidateDashboardSerializer(dashboard_data)
        return api_response(True, "Candidate dashboard fetched successfully.", response_serializer.data, status.HTTP_200_OK)


class CandidateApplicationHistoryView(APIView):
    """GET /candidates/applications/?email=candidate@example.com"""

    permission_classes: ClassVar = [AllowCandidateSelfService]

    def get(self, request):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        applications = CandidateDashboardService.get_application_history(validated_data["email"])
        response_serializer = CandidateDashboardApplicationSerializer(applications, many=True)
        return api_response(True, "Application history fetched successfully.", response_serializer.data, status.HTTP_200_OK)


class CandidateApplicationStatusView(APIView):
    """GET /candidates/applications/{id}/status/?email=candidate@example.com"""

    permission_classes: ClassVar = [AllowCandidateSelfService]

    def get(self, request, pk: str):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        application = CandidateDashboardService.get_application_status(validated_data["email"], int(pk))
        return api_response(
            True,
            "Application status fetched successfully.",
            {"application_id": application.pk, "status": application.status, "updated_at": application.updated_at},
            status.HTTP_200_OK,
        )


class CandidateApplicationTimelineView(APIView):
    """GET /candidates/applications/{id}/timeline/?email=candidate@example.com"""

    permission_classes: ClassVar = [AllowCandidateSelfService]

    def get(self, request, pk: str):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        history = CandidateDashboardService.get_application_timeline(validated_data["email"], int(pk))
        response_serializer = ApplicationHistorySerializer(history, many=True)
        return api_response(True, "Application timeline fetched successfully.", response_serializer.data, status.HTTP_200_OK)


class CandidateResumeHistoryView(APIView):
    """GET /candidates/resumes/?email=candidate@example.com"""

    permission_classes: ClassVar = [AllowCandidateSelfService]

    def get(self, request):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        resumes = CandidateDashboardService.get_resume_history(validated_data["email"])
        response_serializer = ResumeSerializer(resumes, many=True)
        return api_response(True, "Resume history fetched successfully.", response_serializer.data, status.HTTP_200_OK)


class CandidateDocumentView(APIView):
    """
    POST /candidates/documents/  (multipart: email, document_type, file, application_id?)
    GET  /candidates/documents/?email=candidate@example.com
    """

    permission_classes: ClassVar = [AllowCandidateSelfService]
    parser_classes: ClassVar = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CandidateDocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        document = CandidateDocumentService.upload_document(validated_data)
        response_serializer = CandidateDocumentSerializer(document)
        return api_response(True, "Document uploaded successfully.", response_serializer.data, status.HTTP_201_CREATED)

    def get(self, request):
        serializer = CandidateLookupSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        documents = CandidateDocumentService.list_documents(validated_data["email"])
        response_serializer = CandidateDocumentSerializer(documents, many=True)
        return api_response(True, "Documents fetched successfully.", response_serializer.data, status.HTTP_200_OK)