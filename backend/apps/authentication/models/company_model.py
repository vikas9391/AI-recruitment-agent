from django.core.validators import URLValidator
from django.db import models


class Company(models.Model):
    """
    Represents a client organization (tenant) using the WorkforceIQ platform.

    Every recruiting user (HR_ADMIN / HR_USER) belongs to exactly one Company.
    This is the anchor model for future multi-tenant scoping of jobs and
    recruitment data.
    """

    company_name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Legal / display name of the company.",
    )
    company_email = models.EmailField(
        unique=True,
        help_text="Primary contact email for the company account.",
    )
    website = models.URLField(
        max_length=255,
        blank=True,
        null=True,
        validators=[URLValidator()],
    )
    address = models.TextField(blank=True, null=True)
    logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "companies"
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        ordering = ["-created_at"]

    def __str__(self):
        return self.company_name