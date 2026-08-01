from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError


class CustomUserManager(BaseUserManager):
    """
    Manager for the custom `User` model.

    Replaces Django's default username-based manager with one that
    treats `email` as the unique identifier for authentication.
    """

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValidationError("Users must have an email address.")
        if not password:
            raise ValidationError("Users must have a password.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.full_clean(exclude=["password"])
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user (HR_ADMIN or HR_USER).
        """
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with is_staff and is_superuser set.

        A superuser still needs a `company` — the caller (or a data
        migration / management command) is expected to supply one via
        extra_fields, since `company` is a required FK on the model.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)