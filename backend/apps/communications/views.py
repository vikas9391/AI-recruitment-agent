from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.common.pagination import StandardResultsSetPagination
from apps.common.utils import api_response
from apps.recruitment.services import ApplicationService

from .permissions import IsHRAdmin, IsHRAdminOrReadOnly, IsHRUserOrAdmin
from .serializers import (
    EmailLogSerializer,
    EmailTemplateSerializer,
    InterviewCancelSerializer,
    InterviewRescheduleSerializer,
    InterviewScheduleSerializer,
    ManualEmailSendSerializer,
)
from .services import (
    EmailTemplateService,
    InterviewSchedulingService,
    NotificationService,
)
from .models import EmailLog


class EmailTemplateViewSet(viewsets.ViewSet):
    """
    NOTE: EmailTemplate has no company FK in the current schema — templates
    are shared globally across all tenants by design (see models.py). If
    you want templates to be per-company, that needs a migration adding
    `company` to EmailTemplate; this view can't scope what the model
    doesn't store.
    """

    permission_classes = [IsAuthenticated, IsHRAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = [IsAuthenticated, IsHRAdmin]
        else:
            self.permission_classes = [IsAuthenticated, IsHRAdminOrReadOnly]
        return super().get_permissions()

    def list(self, request):
        queryset = EmailTemplateService.list_templates(request.query_params)
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = EmailTemplateSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        template = EmailTemplateService.get_template(int(pk))
        serializer = EmailTemplateSerializer(template)
        return api_response(True, "Email template fetched successfully.", serializer.data, status.HTTP_200_OK)

    def create(self, request):
        serializer = EmailTemplateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        template = EmailTemplateService.create_template(serializer.validated_data)
        response_serializer = EmailTemplateSerializer(template)
        return api_response(True, "Email template created successfully.", response_serializer.data, status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        template = EmailTemplateService.get_template(int(pk))
        serializer = EmailTemplateSerializer(instance=template, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated = EmailTemplateService.update_template(int(pk), serializer.validated_data)
        response_serializer = EmailTemplateSerializer(updated)
        return api_response(True, "Email template updated successfully.", response_serializer.data, status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        template = EmailTemplateService.get_template(int(pk))
        serializer = EmailTemplateSerializer(instance=template, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = EmailTemplateService.update_template(int(pk), serializer.validated_data)
        response_serializer = EmailTemplateSerializer(updated)
        return api_response(True, "Email template updated successfully.", response_serializer.data, status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        EmailTemplateService.delete_template(int(pk))
        return api_response(True, "Email template deleted successfully.", {}, status.HTTP_200_OK)


class EmailLogViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        queryset = (
            EmailLog.objects.select_related("template", "application", "candidate")
            .filter(application__job__company=request.user.company)
        )

        application_id = request.query_params.get("application_id")
        if application_id:
            queryset = queryset.filter(application_id=application_id)

        status_filter = request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        recipient_email = request.query_params.get("recipient_email")
        if recipient_email:
            queryset = queryset.filter(recipient_email__icontains=recipient_email)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = EmailLogSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        log = (
            EmailLog.objects.select_related("template", "application", "candidate")
            .filter(id=pk, application__job__company=request.user.company)
            .first()
        )
        if not log:
            return api_response(False, "Email log not found.", {}, status.HTTP_404_NOT_FOUND)
        serializer = EmailLogSerializer(log)
        return api_response(True, "Email log fetched successfully.", serializer.data, status.HTTP_200_OK)


class SendManualEmailView(APIView):
    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]

    def post(self, request):
        serializer = ManualEmailSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        application = ApplicationService.get_application(
            serializer.validated_data["application_id"], request.user
        )
        template = EmailTemplateService.get_template(serializer.validated_data["template_id"])

        from .services import NotificationService
        log = NotificationService.send_manual_email(application, template)

        response_serializer = EmailLogSerializer(log)
        return api_response(True, "Email sent successfully.", response_serializer.data, status.HTTP_200_OK)


class InterviewScheduleViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsHRUserOrAdmin]
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        queryset = InterviewSchedulingService.list_interviews(request.query_params, request.user)
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = InterviewScheduleSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        interview = InterviewSchedulingService.get_interview(int(pk), request.user)
        serializer = InterviewScheduleSerializer(interview)
        return api_response(True, "Interview fetched successfully.", serializer.data, status.HTTP_200_OK)

    def create(self, request):
        serializer = InterviewScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        interview = InterviewSchedulingService.schedule_interview(dict(serializer.validated_data), request.user)
        response_serializer = InterviewScheduleSerializer(interview)
        return api_response(True, "Interview scheduled successfully.", response_serializer.data, status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="reschedule")
    def reschedule(self, request, pk=None):
        serializer = InterviewRescheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        interview = InterviewSchedulingService.reschedule_interview(
            int(pk), serializer.validated_data, request.user
        )
        response_serializer = InterviewScheduleSerializer(interview)
        return api_response(True, "Interview rescheduled successfully.", response_serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        serializer = InterviewCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        interview = InterviewSchedulingService.cancel_interview(
            int(pk), serializer.validated_data.get("notes", ""), request.user
        )
        response_serializer = InterviewScheduleSerializer(interview)
        return api_response(True, "Interview cancelled successfully.", response_serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="complete")
    def complete(self, request, pk=None):
        interview = InterviewSchedulingService.complete_interview(int(pk), request.user)
        response_serializer = InterviewScheduleSerializer(interview)
        return api_response(True, "Interview marked as completed.", response_serializer.data, status.HTTP_200_OK)
