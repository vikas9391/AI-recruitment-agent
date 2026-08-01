from typing import Any, Dict

from django.utils import timezone
from rest_framework import serializers

from .models import EmailLog, EmailTemplate, InterviewSchedule


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = [
            "id", "name", "template_type", "subject", "body",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        subject = attrs.get("subject", getattr(self.instance, "subject", ""))
        body = attrs.get("body", getattr(self.instance, "body", ""))
        if not subject or not subject.strip():
            raise serializers.ValidationError({"subject": "Subject cannot be empty."})
        if not body or not body.strip():
            raise serializers.ValidationError({"body": "Body cannot be empty."})
        return attrs


class EmailLogSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source="template.name", read_only=True, default=None)
    candidate_name = serializers.CharField(source="candidate.full_name", read_only=True, default=None)
    job_title = serializers.CharField(source="application.job.title", read_only=True, default=None)

    class Meta:
        model = EmailLog
        fields = [
            "id", "template", "template_name", "application", "candidate",
            "candidate_name", "job_title", "recipient_email", "subject", "body",
            "status", "error_message", "sent_at", "created_at",
        ]
        read_only_fields = fields


class InterviewScheduleSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="application.candidate.full_name", read_only=True)
    candidate_email = serializers.CharField(source="application.candidate.email", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    scheduled_by_name = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSchedule
        fields = [
            "id", "application", "candidate_name", "candidate_email", "job_title",
            "scheduled_by", "scheduled_by_name", "interview_date", "interview_time",
            "mode", "meeting_link", "location", "interviewer_name", "status",
            "notes", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "scheduled_by", "status", "created_at", "updated_at"]

    def get_scheduled_by_name(self, obj: InterviewSchedule):
        if obj.scheduled_by:
            full_name = getattr(obj.scheduled_by, "get_full_name", lambda: "")()
            return full_name or str(obj.scheduled_by)
        return None

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        mode = attrs.get("mode", getattr(self.instance, "mode", InterviewSchedule.Mode.ONLINE))
        meeting_link = attrs.get("meeting_link", getattr(self.instance, "meeting_link", None))
        location = attrs.get("location", getattr(self.instance, "location", None))

        if mode == InterviewSchedule.Mode.ONLINE and not meeting_link:
            raise serializers.ValidationError({"meeting_link": "Meeting link is required for online interviews."})
        if mode == InterviewSchedule.Mode.OFFLINE and not location:
            raise serializers.ValidationError({"location": "Location is required for offline interviews."})

        interview_date = attrs.get("interview_date", getattr(self.instance, "interview_date", None))
        if interview_date and self.instance is None and interview_date < timezone.now().date():
            raise serializers.ValidationError({"interview_date": "Interview date cannot be in the past."})

        return attrs


class InterviewRescheduleSerializer(serializers.Serializer):
    interview_date = serializers.DateField()
    interview_time = serializers.TimeField()
    mode = serializers.ChoiceField(choices=InterviewSchedule.Mode.choices, required=False)
    meeting_link = serializers.URLField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class InterviewCancelSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)


class ManualEmailSendSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    template_id = serializers.IntegerField()