from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.pagination import StandardResultsSetPagination
from apps.common.utils import api_response

from .permissions import IsHRAdmin, IsHRAdminOrReadOnly
from .serializers import (
    JobCreateUpdateSerializer,
    JobDetailSerializer,
    JobListSerializer,
)
from .services import JobService


class JobViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsHRAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy", "open_job", "close_job"):
            self.permission_classes = [IsAuthenticated, IsHRAdmin]
        else:
            self.permission_classes = [IsAuthenticated, IsHRAdminOrReadOnly]
        return super().get_permissions()

    def list(self, request):
        queryset = JobService.list_jobs(request.query_params, request.user)
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = JobListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        job = JobService.get_job(int(pk), request.user)
        serializer = JobDetailSerializer(job)
        return api_response(True, "Job fetched successfully.", serializer.data, status.HTTP_200_OK)

    def create(self, request):
        serializer = JobCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = JobService.create_job(serializer.validated_data, request.user)
        response_serializer = JobDetailSerializer(job)
        data = {**response_serializer.data, "resume_ingestion": getattr(job, "resume_ingestion_summary", None)}
        return api_response(True, "Job created successfully.", data, status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        job = JobService.get_job(int(pk), request.user)
        serializer = JobCreateUpdateSerializer(instance=job, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated_job = JobService.update_job(int(pk), serializer.validated_data, request.user)
        response_serializer = JobDetailSerializer(updated_job)
        return api_response(True, "Job updated successfully.", response_serializer.data, status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        job = JobService.get_job(int(pk), request.user)
        serializer = JobCreateUpdateSerializer(instance=job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_job = JobService.update_job(int(pk), serializer.validated_data, request.user)
        response_serializer = JobDetailSerializer(updated_job)
        return api_response(True, "Job updated successfully.", response_serializer.data, status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        JobService.delete_job(int(pk), request.user)
        return api_response(True, "Job deleted successfully.", {}, status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="open")
    def open_job(self, request, pk=None):
        job = JobService.open_job(int(pk), request.user)
        serializer = JobDetailSerializer(job)
        data = {**serializer.data, "resume_ingestion": getattr(job, "resume_ingestion_summary", None)}
        return api_response(True, "Job opened successfully.", data, status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="close")
    def close_job(self, request, pk=None):
        job = JobService.close_job(int(pk), request.user)
        serializer = JobDetailSerializer(job)
        return api_response(True, "Job closed successfully.", serializer.data, status.HTTP_200_OK)
