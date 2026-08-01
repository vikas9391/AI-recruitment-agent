from django.conf import settings
from django.db import models

from apps.recruitment.models import Application, Candidate


class EmailTemplate(models.Model):
    class TemplateType(models.TextChoices):
        APPLICATION_RECEIVED = "APPLICATION_RECEIVED", "Application Received"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        REJECTED = "REJECTED", "Rejected"
        INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED", "Interview Scheduled"
        INTERVIEW_RESCHEDULED = "INTERVIEW_RESCHEDULED", "Interview Rescheduled"
        INTERVIEW_CANCELLED = "INTERVIEW_CANCELLED", "Interview Cancelled"
        OFFER = "OFFER", "Offer"
        CUSTOM = "CUSTOM", "Custom"

    name = models.CharField(max_length=150)
    template_type = models.CharField(max_length=30, choices=TemplateType.choices)
    subject = models.CharField(max_length=255)
    body = models.TextField(
        help_text="Supports placeholders: {{candidate_name}}, {{job_title}}, {{company_name}}, "
        "{{status}}, {{interview_date}}, {{interview_time}}, {{interview_mode}}, "
        "{{meeting_link}}, {{location}}, {{interviewer_name}}"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "email_templates"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["template_type", "is_active"])]

    def __str__(self) -> str:
        return f"{self.name} ({self.template_type})"


class EmailLog(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SENT = "SENT", "Sent"
        FAILED = "FAILED", "Failed"

    template = models.ForeignKey(
        EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name="logs"
    )
    application = models.ForeignKey(
        Application, on_delete=models.SET_NULL, null=True, blank=True, related_name="email_logs"
    )
    candidate = models.ForeignKey(
        Candidate, on_delete=models.SET_NULL, null=True, blank=True, related_name="email_logs"
    )
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    error_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "email_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["recipient_email"]),
        ]

    def __str__(self) -> str:
        return f"{self.recipient_email} - {self.subject} [{self.status}]"


class InterviewSchedule(models.Model):
    class Mode(models.TextChoices):
        ONLINE = "ONLINE", "Online"
        OFFLINE = "OFFLINE", "Offline"
        PHONE = "PHONE", "Phone"

    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        RESCHEDULED = "RESCHEDULED", "Rescheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name="interviews")
    scheduled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="interviews_scheduled"
    )
    interview_date = models.DateField()
    interview_time = models.TimeField()
    mode = models.CharField(max_length=10, choices=Mode.choices, default=Mode.ONLINE)
    meeting_link = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    interviewer_name = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "interview_schedules"
        ordering = ["-interview_date", "-interview_time"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["interview_date"]),
        ]

    def __str__(self) -> str:
        return f"Interview - {self.application_id} on {self.interview_date} [{self.status}]"