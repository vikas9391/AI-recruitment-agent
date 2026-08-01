from django.contrib import admin

from .models import EmailLog, EmailTemplate, InterviewSchedule


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "template_type", "is_active", "created_at")
    list_filter = ("template_type", "is_active")
    search_fields = ("name", "subject")
    readonly_fields = ("created_at", "updated_at")


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient_email", "subject", "status", "sent_at", "created_at")
    list_filter = ("status",)
    search_fields = ("recipient_email", "subject")
    readonly_fields = ("created_at", "sent_at")


@admin.register(InterviewSchedule)
class InterviewScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "id", "application", "interview_date", "interview_time",
        "mode", "status", "scheduled_by", "created_at",
    )
    list_filter = ("status", "mode")
    search_fields = ("application__candidate__first_name", "application__candidate__email")
    readonly_fields = ("created_at", "updated_at")