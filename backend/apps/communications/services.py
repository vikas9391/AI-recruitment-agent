import logging
import re
from typing import Any, Dict, Optional

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import NotFound, ValidationError

from apps.recruitment.models import Application

from .models import EmailLog, EmailTemplate, InterviewSchedule

logger = logging.getLogger(__name__)


class EmailTemplateService:

    @staticmethod
    def get_template(template_id: int) -> EmailTemplate:
        template = EmailTemplate.objects.filter(id=template_id).first()
        if not template:
            raise NotFound("Email template not found.")
        return template

    @staticmethod
    def get_active_template_by_type(template_type: str) -> Optional[EmailTemplate]:
        return EmailTemplate.objects.filter(template_type=template_type, is_active=True).first()

    @staticmethod
    def list_templates(query_params: Dict[str, Any]):
        queryset = EmailTemplate.objects.all()
        template_type = query_params.get("template_type")
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        is_active = query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")
        return queryset

    @staticmethod
    @transaction.atomic
    def create_template(data: Dict[str, Any]) -> EmailTemplate:
        return EmailTemplate.objects.create(**data)

    @staticmethod
    @transaction.atomic
    def update_template(template_id: int, data: Dict[str, Any]) -> EmailTemplate:
        template = EmailTemplateService.get_template(template_id)
        for field, value in data.items():
            setattr(template, field, value)
        template.save()
        return template

    @staticmethod
    @transaction.atomic
    def delete_template(template_id: int) -> None:
        template = EmailTemplateService.get_template(template_id)
        template.delete()


class EmailRenderService:
    """Renders {{placeholder}} tokens in template subject/body against a context dict."""

    PLACEHOLDER_PATTERN = re.compile(r"\{\{\s*(\w+)\s*\}\}")

    @classmethod
    def render(cls, text: str, context: Dict[str, Any]) -> str:
        def replace(match: "re.Match") -> str:
            key = match.group(1)
            value = context.get(key, "")
            return "" if value is None else str(value)

        return cls.PLACEHOLDER_PATTERN.sub(replace, text or "")

    @classmethod
    def build_context_from_application(
        cls, application: Application, extra: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        job = application.job
        candidate = application.candidate
        context = {
            "candidate_name": candidate.full_name,
            "job_title": job.title,
            "company_name": job.company.company_name if getattr(job.company, "company_name", None) else str(job.company),
            "status": application.get_status_display(),
        }
        if extra:
            context.update(extra)
        return context


class EmailService:
    """Handles actual email dispatch and logging. Uses Django's real send_mail
    (console backend in dev, SMTP when EMAIL_* settings are configured)."""

    @staticmethod
    @transaction.atomic
    def send_email(
        recipient_email: str,
        subject: str,
        body: str,
        template: Optional[EmailTemplate] = None,
        application: Optional[Application] = None,
        candidate: Optional[Any] = None,
    ) -> EmailLog:
        log = EmailLog.objects.create(
            template=template,
            application=application,
            candidate=candidate or (application.candidate if application else None),
            recipient_email=recipient_email,
            subject=subject,
            body=body,
            status=EmailLog.Status.PENDING,
        )

        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@workforceiq.com"),
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            log.status = EmailLog.Status.SENT
            log.sent_at = timezone.now()
            log.error_message = None
        except Exception as exc:
            logger.exception("Failed to send email to %s", recipient_email)
            log.status = EmailLog.Status.FAILED
            log.error_message = str(exc)

        log.save(update_fields=["status", "sent_at", "error_message"])
        return log


class NotificationService:
    """High-level, event-driven notification triggers used by signals and views."""

    STATUS_TEMPLATE_MAP = {
        Application.Status.APPLIED: EmailTemplate.TemplateType.APPLICATION_RECEIVED,
        Application.Status.SHORTLISTED: EmailTemplate.TemplateType.SHORTLISTED,
        Application.Status.REJECTED: EmailTemplate.TemplateType.REJECTED,
        Application.Status.REJECTED_MANDATORY_SKILLS: EmailTemplate.TemplateType.REJECTED,
    }

    @staticmethod
    def _dispatch(application: Application, template_type: str, extra_context: Optional[Dict[str, Any]] = None) -> Optional[EmailLog]:
        template = EmailTemplateService.get_active_template_by_type(template_type)
        if not template:
            logger.warning("No active email template found for type '%s'. Skipping notification.", template_type)
            return None

        context = EmailRenderService.build_context_from_application(application, extra_context)
        subject = EmailRenderService.render(template.subject, context)
        body = EmailRenderService.render(template.body, context)

        return EmailService.send_email(
            recipient_email=application.candidate.email,
            subject=subject,
            body=body,
            template=template,
            application=application,
        )

    @staticmethod
    def send_application_received(application: Application) -> Optional[EmailLog]:
        return NotificationService._dispatch(application, EmailTemplate.TemplateType.APPLICATION_RECEIVED)

    @staticmethod
    def notify_status_change(application: Application) -> Optional[EmailLog]:
        template_type = NotificationService.STATUS_TEMPLATE_MAP.get(application.status)
        if not template_type:
            return None
        return NotificationService._dispatch(application, template_type)

    @staticmethod
    def notify_interview_scheduled(interview: InterviewSchedule) -> Optional[EmailLog]:
        extra = {
            "interview_date": interview.interview_date.strftime("%d %b %Y"),
            "interview_time": interview.interview_time.strftime("%I:%M %p"),
            "interview_mode": interview.get_mode_display(),
            "meeting_link": interview.meeting_link or "",
            "location": interview.location or "",
            "interviewer_name": interview.interviewer_name or "",
        }
        return NotificationService._dispatch(
            interview.application, EmailTemplate.TemplateType.INTERVIEW_SCHEDULED, extra
        )

    @staticmethod
    def notify_interview_rescheduled(interview: InterviewSchedule) -> Optional[EmailLog]:
        extra = {
            "interview_date": interview.interview_date.strftime("%d %b %Y"),
            "interview_time": interview.interview_time.strftime("%I:%M %p"),
            "interview_mode": interview.get_mode_display(),
            "meeting_link": interview.meeting_link or "",
            "location": interview.location or "",
            "interviewer_name": interview.interviewer_name or "",
        }
        return NotificationService._dispatch(
            interview.application, EmailTemplate.TemplateType.INTERVIEW_RESCHEDULED, extra
        )

    @staticmethod
    def notify_interview_cancelled(interview: InterviewSchedule) -> Optional[EmailLog]:
        return NotificationService._dispatch(
            interview.application, EmailTemplate.TemplateType.INTERVIEW_CANCELLED
        )

    @staticmethod
    def send_manual_email(application: Application, template: EmailTemplate) -> EmailLog:
        context = EmailRenderService.build_context_from_application(application)
        subject = EmailRenderService.render(template.subject, context)
        body = EmailRenderService.render(template.body, context)
        return EmailService.send_email(
            recipient_email=application.candidate.email,
            subject=subject,
            body=body,
            template=template,
            application=application,
        )


class InterviewSchedulingService:

    @staticmethod
    def get_interview(interview_id: int) -> InterviewSchedule:
        interview = InterviewSchedule.objects.select_related("application", "application__candidate", "application__job").filter(id=interview_id).first()
        if not interview:
            raise NotFound("Interview not found.")
        return interview

    @staticmethod
    def list_interviews(query_params: Dict[str, Any]):
        queryset = InterviewSchedule.objects.select_related(
            "application", "application__candidate", "application__job"
        ).all()

        application_id = query_params.get("application_id")
        if application_id:
            queryset = queryset.filter(application_id=application_id)

        status_filter = query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        interview_date = query_params.get("interview_date")
        if interview_date:
            queryset = queryset.filter(interview_date=interview_date)

        return queryset

    @staticmethod
    @transaction.atomic
    def schedule_interview(data: Dict[str, Any], scheduled_by) -> InterviewSchedule:
        application = data.pop("application")
        if not isinstance(application, Application):
            application = Application.objects.filter(id=application).first()
            if not application:
                raise NotFound("Application not found.")

        interview = InterviewSchedule.objects.create(
            application=application,
            scheduled_by=scheduled_by,
            status=InterviewSchedule.Status.SCHEDULED,
            **data,
        )
        NotificationService.notify_interview_scheduled(interview)
        return interview

    @staticmethod
    @transaction.atomic
    def reschedule_interview(interview_id: int, data: Dict[str, Any]) -> InterviewSchedule:
        interview = InterviewSchedulingService.get_interview(interview_id)
        if interview.status == InterviewSchedule.Status.CANCELLED:
            raise ValidationError("Cannot reschedule a cancelled interview.")

        for field, value in data.items():
            setattr(interview, field, value)
        interview.status = InterviewSchedule.Status.RESCHEDULED
        interview.save()

        NotificationService.notify_interview_rescheduled(interview)
        return interview

    @staticmethod
    @transaction.atomic
    def cancel_interview(interview_id: int, notes: str = "") -> InterviewSchedule:
        interview = InterviewSchedulingService.get_interview(interview_id)
        if interview.status == InterviewSchedule.Status.CANCELLED:
            raise ValidationError("Interview is already cancelled.")

        interview.status = InterviewSchedule.Status.CANCELLED
        if notes:
            interview.notes = notes
        interview.save(update_fields=["status", "notes", "updated_at"])

        NotificationService.notify_interview_cancelled(interview)
        return interview

    @staticmethod
    @transaction.atomic
    def complete_interview(interview_id: int) -> InterviewSchedule:
        interview = InterviewSchedulingService.get_interview(interview_id)
        if interview.status == InterviewSchedule.Status.CANCELLED:
            raise ValidationError("Cannot complete a cancelled interview.")
        interview.status = InterviewSchedule.Status.COMPLETED
        interview.save(update_fields=["status", "updated_at"])
        return interview