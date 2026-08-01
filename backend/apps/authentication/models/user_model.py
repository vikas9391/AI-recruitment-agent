from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models

from apps.authentication.managers import CustomUserManager
from apps.authentication.models.company_model import Company


phone_validator = RegexValidator(
    regex=r"^\+?[1-9]\d{7,14}$",
    message=(
        "Phone number must be entered in a valid format "
        "(8-15 digits, optional leading '+')."
    ),
)


class Role(models.TextChoices):
    """
    Simple role field for Module 1.

    NOTE: This is intentionally a flat choice field, not a full
    role/permission system. A granular RBAC layer can be layered on
    top of this later without changing the schema drastically.
    """
    HR_ADMIN = "HR_ADMIN", "HR Admin"
    HR_USER = "HR_USER", "HR User"


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for WorkforceIQ.

    Authentication is done via `email` instead of Django's default
    `username`. Every user belongs to a `Company` and has a `role`
    that determines their level of access within that company.
    """

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(
        max_length=17,
        validators=[phone_validator],
        blank=True,
        null=True,
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.HR_USER,
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="employees",
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} ({self.role})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    @property
    def is_hr_admin(self):
        return self.role == Role.HR_ADMIN