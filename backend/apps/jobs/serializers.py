from django.utils import timezone
from rest_framework import serializers

from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id", "company", "title", "department", "employment_type",
            "experience_required", "location", "remote_type", "vacancies",
            "deadline", "status", "created_by_name", "created_at",
        ]

    def get_created_by_name(self, obj: Job) -> str:
        if obj.created_by:
            full_name = getattr(obj.created_by, "get_full_name", lambda: "")()
            return full_name or str(obj.created_by)
        return ""


class JobDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id", "company", "title", "department", "description", "requirements",
            "responsibilities", "employment_type", "experience_required",
            "education_required", "salary_min", "salary_max", "location",
            "remote_type", "skills_required", "vacancies", "deadline", "status",
            "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def get_created_by_name(self, obj: Job) -> str:
        if obj.created_by:
            full_name = getattr(obj.created_by, "get_full_name", lambda: "")()
            return full_name or str(obj.created_by)
        return ""


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        # `company` is intentionally excluded — it's always set server-side
        # from the requesting user's own company, never client-supplied.
        fields = [
            "title", "department", "description", "requirements",
            "responsibilities", "employment_type", "experience_required",
            "education_required", "salary_min", "salary_max", "location",
            "remote_type", "skills_required", "vacancies", "deadline", "status",
        ]

    def validate_skills_required(self, value):
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("skills_required must be a list of strings.")
        return value

    def validate(self, attrs):
        salary_min = attrs.get("salary_min", getattr(self.instance, "salary_min", None))
        salary_max = attrs.get("salary_max", getattr(self.instance, "salary_max", None))
        if salary_min is not None and salary_max is not None and salary_min > salary_max:
            raise serializers.ValidationError(
                {"salary_min": "salary_min cannot be greater than salary_max."}
            )

        deadline = attrs.get("deadline")
        if deadline and self.instance is None and deadline < timezone.now().date():
            raise serializers.ValidationError({"deadline": "Deadline cannot be in the past."})

        return attrs


class JobStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Job.Status.choices)