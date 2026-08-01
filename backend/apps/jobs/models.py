from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from apps.authentication.models.company_model import Company


class Job(models.Model):
    class EmploymentType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        PART_TIME = "PART_TIME", "Part Time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        TEMPORARY = "TEMPORARY", "Temporary"

    class RemoteType(models.TextChoices):
        ONSITE = "ONSITE", "Onsite"
        REMOTE = "REMOTE", "Remote"
        HYBRID = "HYBRID", "Hybrid"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        OPEN = "OPEN", "Open"
        CLOSED = "CLOSED", "Closed"
        PAUSED = "PAUSED", "Paused"

    company = models.ForeignKey(
    Company,
    on_delete=models.CASCADE,
    related_name="jobs",
)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=150)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    employment_type = models.CharField(
        max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    experience_required = models.CharField(max_length=100, help_text="e.g. 2-4 years")
    education_required = models.CharField(max_length=255)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255)
    remote_type = models.CharField(max_length=10, choices=RemoteType.choices, default=RemoteType.ONSITE)
    skills_required = models.JSONField(default=list, blank=True)
    vacancies = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    deadline = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    resume_threshold = models.DecimalField(
        max_digits=5, decimal_places=2, default=75.00,
        help_text="Minimum overall resume score required to auto-shortlist a candidate.",
    )

    job_description_file = models.FileField(
        upload_to="job_descriptions/",
        blank=True,
        null=True,
    )

    ai_summary = models.TextField(blank=True)

    notes = models.TextField(blank=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="jobs_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "jobs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["department"]),
            models.Index(fields=["employment_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} - {self.company}"

    