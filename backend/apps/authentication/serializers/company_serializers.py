from rest_framework import serializers

from apps.authentication.models.company_model import Company


class CompanySerializer(serializers.ModelSerializer):
    """
    Read/write serializer for the Company model.

    Used both to nest company details inside user responses and to
    expose standalone company CRUD endpoints in company_views.py.
    """

    class Meta:
        model = Company
        fields = [
            "id",
            "company_name",
            "company_email",
            "website",
            "address",
            "logo",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_company_name(self, value):
        value = value.strip()
        qs = Company.objects.filter(company_name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "A company with this name already exists."
            )
        return value

    def validate_company_email(self, value):
        value = value.strip().lower()
        qs = Company.objects.filter(company_email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "A company with this email already exists."
            )
        return value