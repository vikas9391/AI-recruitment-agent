from rest_framework import serializers

from apps.authentication.models.user_model import User
from apps.authentication.serializers.company_serializers import (
    CompanySerializer,
)


class UserSerializer(serializers.ModelSerializer):
    """
    Read-mostly serializer for exposing a user's profile, e.g. from the
    "current user" endpoint. Company is nested (read) for convenience;
    it is not writable through this serializer.
    """

    company = CompanySerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "role",
            "company",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "email",
            "role",
            "company",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()