from typing import Any, Dict

from rest_framework import serializers

from .models import (
    Application,
    ApplicationHistory,
    Candidate,
    Resume,
    ResumeAnalysis,
    ResumeScore,
)
from .models import CandidateDocument

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            "id", "first_name", "last_name", "email", "phone", "location",
            "linkedin_url", "portfolio_url", "total_experience_years",
            "highest_education", "skills", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id", "candidate", "file", "file_name", "file_type",
            "is_parsed", "parse_error", "uploaded_at",
        ]
        read_only_fields = ["id", "file_name", "file_type", "is_parsed", "parse_error", "uploaded_at"]


class ApplyForJobSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    portfolio_url = serializers.URLField(required=False, allow_blank=True)
    cover_note = serializers.CharField(required=False, allow_blank=True)
    resume_file = serializers.FileField()

    def validate_resume_file(self, value):
        allowed_extensions = ("pdf", "docx")
        ext = value.name.split(".")[-1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError("Only PDF and DOCX files are supported.")
        max_size_mb = 5
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(f"File size must not exceed {max_size_mb}MB.")
        return value


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = [
            "id", "skills", "matched_skills", "missing_skills",
            "experience_summary", "education_summary", "projects",
            "certifications", "keyword_match", "ats_score", "strengths",
            "weaknesses", "improvement_report", "mandatory_skills_passed",
            "created_at",
        ]
        read_only_fields = fields


class ResumeScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeScore
        fields = [
            "id", "skills_match_score", "experience_score", "education_score",
            "projects_score", "certifications_score", "ats_formatting_score",
            "keyword_match_score", "overall_score", "threshold_used",
            "is_shortlisted", "created_at",
        ]
        read_only_fields = fields


class ApplicationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationHistory
        fields = ["id", "status", "remarks", "changed_at"]
        read_only_fields = fields


class ApplicationListSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="candidate.full_name", read_only=True)
    candidate_email = serializers.CharField(source="candidate.email", read_only=True)
    candidate_skills = serializers.ListField(source="candidate.skills", read_only=True, default=list)
    candidate_experience_years = serializers.DecimalField(
        source="candidate.total_experience_years", max_digits=4, decimal_places=1,
        read_only=True, allow_null=True,
    )
    job_title = serializers.CharField(source="job.title", read_only=True)
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id", "job", "job_title", "candidate", "candidate_name",
            "candidate_email", "candidate_skills", "candidate_experience_years",
            "status", "overall_score", "applied_at", "updated_at",
        ]

    def get_overall_score(self, obj: Application):
        score = getattr(obj, "score", None)
        return float(score.overall_score) if score else None


class ApplicationDetailSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)
    analysis = ResumeAnalysisSerializer(read_only=True)
    score = ResumeScoreSerializer(read_only=True)
    history = ApplicationHistorySerializer(many=True, read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id", "job", "job_title", "candidate", "resume", "status",
            "cover_note", "recruiter_notes", "analysis", "score", "history",
            "applied_at", "updated_at",
        ]


class RecruiterNotesUpdateSerializer(serializers.Serializer):
    recruiter_notes = serializers.CharField(allow_blank=True)


class ApplicationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Application.Status.choices)
    remarks = serializers.CharField(required=False, allow_blank=True)

class CandidateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateDocument
        fields = ["id", "candidate", "application", "document_type", "file", "file_name", "uploaded_at"]
        read_only_fields = ["id", "file_name", "uploaded_at"]


class CandidateDocumentUploadSerializer(serializers.Serializer):
    ALLOWED_EXTENSIONS = ("pdf", "docx", "png", "jpg", "jpeg")
    MAX_SIZE_MB = 10

    email = serializers.EmailField()
    document_type = serializers.ChoiceField(choices=CandidateDocument.DocumentType.choices)
    file = serializers.FileField()
    application_id = serializers.IntegerField(required=False)

    def validate_file(self, value):
        ext = value.name.split(".")[-1].lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported file type '.{ext}'. Allowed types: "
                f"{', '.join(self.ALLOWED_EXTENSIONS).upper()}."
            )
        if value.size > self.MAX_SIZE_MB * 1024 * 1024:
            raise serializers.ValidationError(f"File size must not exceed {self.MAX_SIZE_MB}MB.")
        return value

class CandidateLookupSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CandidateDashboardApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company = serializers.CharField(source="job.company.company_name", read_only=True)
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id", "job", "job_title", "company", "status",
            "overall_score", "applied_at", "updated_at",
        ]

    def get_overall_score(self, obj: Application):
        score = getattr(obj, "score", None)
        return float(score.overall_score) if score else None


class CandidateDashboardSerializer(serializers.Serializer):
    profile = CandidateSerializer()
    total_applications = serializers.IntegerField()
    shortlisted_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    in_progress_count = serializers.IntegerField()
    resumes = ResumeSerializer(many=True)
    applications = CandidateDashboardApplicationSerializer(many=True)    