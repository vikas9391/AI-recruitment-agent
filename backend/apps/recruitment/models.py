from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.jobs.models import Job


class Candidate(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255, blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    total_experience_years = models.DecimalField(
        max_digits=4, decimal_places=1, blank=True, null=True
    )
    highest_education = models.CharField(max_length=255, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "candidates"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class Resume(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="resumes")
    file = models.FileField(upload_to="resumes/%Y/%m/")
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10)  # PDF / DOCX
    parsed_text = models.TextField(blank=True, null=True)
    is_parsed = models.BooleanField(default=False)
    parse_error = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "resumes"
        ordering = ["-uploaded_at"]

    def __str__(self) -> str:
        return f"Resume - {self.candidate.full_name} ({self.file_name})"


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        PROCESSING = "PROCESSING", "Processing"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        REJECTED = "REJECTED", "Rejected"
        REJECTED_MANDATORY_SKILLS = "REJECTED_MANDATORY_SKILLS", "Rejected - Missing Mandatory Skills"
        FAILED = "FAILED", "Processing Failed"
        HIRED = "HIRED", "Hired"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="applications")
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, related_name="applications")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.APPLIED)
    cover_note = models.TextField(blank=True, null=True)
    recruiter_notes = models.TextField(blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "applications"
        ordering = ["-applied_at"]
        unique_together = ("job", "candidate")
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["job"]),
        ]

    def __str__(self) -> str:
        return f"{self.candidate.full_name} -> {self.job.title} [{self.status}]"


class ResumeAnalysis(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name="analysis")
    skills = models.JSONField(default=list, blank=True)
    matched_skills = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)
    experience_summary = models.TextField(blank=True, null=True)
    education_summary = models.TextField(blank=True, null=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    keyword_match = models.PositiveIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    ats_score = models.PositiveIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    improvement_report = models.JSONField(default=list, blank=True)
    raw_ai_response = models.JSONField(default=dict, blank=True)
    mandatory_skills_passed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "resume_analysis"

    def __str__(self) -> str:
        return f"Analysis - {self.application_id}"


class ResumeScore(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name="score")
    skills_match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    experience_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    education_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    projects_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    certifications_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    ats_formatting_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    keyword_match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    overall_score = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    threshold_used = models.DecimalField(max_digits=5, decimal_places=2, default=75)
    is_shortlisted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "resume_scores"

    def __str__(self) -> str:
        return f"Score - {self.application_id}: {self.overall_score}"


class ApplicationHistory(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name="history")
    status = models.CharField(max_length=30, choices=Application.Status.choices)
    remarks = models.TextField(blank=True, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "application_history"
        ordering = ["-changed_at"]

    def __str__(self) -> str:
        return f"{self.application_id} -> {self.status}"

class CandidateDocument(models.Model):
    class DocumentType(models.TextChoices):
        ID_PROOF = "ID_PROOF", "ID Proof"
        COVER_LETTER = "COVER_LETTER", "Cover Letter"
        PORTFOLIO = "PORTFOLIO", "Portfolio"
        CERTIFICATE = "CERTIFICATE", "Certificate"
        OTHER = "OTHER", "Other"

    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="documents")
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="documents", null=True, blank=True
    )
    document_type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER)
    file = models.FileField(upload_to="candidate_documents/%Y/%m/")
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "candidate_documents"
        ordering = ["-uploaded_at"]

    def __str__(self) -> str:
        return f"{self.candidate.full_name} - {self.document_type} ({self.file_name})"