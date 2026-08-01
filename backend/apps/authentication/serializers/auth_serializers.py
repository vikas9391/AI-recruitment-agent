from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from apps.authentication.models.company_model import Company
from apps.authentication.models.user_model import Role, User, phone_validator


class RegisterSerializer(serializers.Serializer):
    """
    Handles onboarding of a brand-new company together with its first
    user (the HR_ADMIN who signed up).

    This is intentionally a plain Serializer (not a ModelSerializer)
    because it writes to two models — Company and User — atomically.
    """

    # --- Company fields ---
    company_name = serializers.CharField(max_length=255)
    company_email = serializers.EmailField()
    website = serializers.URLField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    # --- User fields ---
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(
        max_length=17, required=False, allow_blank=True
    )
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    # ---- Field-level validation ----

    def validate_company_name(self, value):
        value = value.strip()
        if Company.objects.filter(company_name__iexact=value).exists():
            raise serializers.ValidationError(
                "A company with this name is already registered."
            )
        return value

    def validate_company_email(self, value):
        value = value.strip().lower()
        if Company.objects.filter(company_email__iexact=value).exists():
            raise serializers.ValidationError(
                "A company with this email is already registered."
            )
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate_phone(self, value):
        if value:
            phone_validator(value)
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    # ---- Cross-field validation ----

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    # ---- Persistence ----

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        company = Company.objects.create(
            company_name=validated_data.pop("company_name"),
            company_email=validated_data.pop("company_email"),
            website=validated_data.pop("website", "") or None,
            address=validated_data.pop("address", "") or None,
        )

        user = User.objects.create_user(
            email=validated_data.pop("email"),
            password=password,
            first_name=validated_data.pop("first_name"),
            last_name=validated_data.pop("last_name"),
            phone=validated_data.pop("phone", "") or None,
            role=Role.HR_ADMIN,
            company=company,
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Validates credentials and attaches the authenticated user to
    validated_data as `user` for the view to consume.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password.", code="authorization"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account has been deactivated.", code="authorization"
            )

        attrs["user"] = user
        return attrs