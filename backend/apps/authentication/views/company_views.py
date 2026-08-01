from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.authentication.models.company_model import Company
from apps.authentication.permissions import IsHRAdmin, IsSuperAdmin
from apps.authentication.serializers.auth_serializers import (
    AdminCreateCompanySerializer,
)
from apps.authentication.serializers.company_serializers import (
    CompanySerializer,
)
from apps.authentication.serializers.user_serializers import UserSerializer
from apps.authentication.utils import api_response, format_serializer_errors


class SuperAdminCompaniesView(APIView):
    """
    GET  /api/auth/admin/companies/  -> list every tenant company on
                                         the platform, with its employee
                                         count (Super Admin only).
    POST /api/auth/admin/companies/  -> onboard a brand-new tenant:
                                         creates the Company plus its
                                         first HR_ADMIN user in one
                                         call (Super Admin only). This
                                         is the multi-tenant admin
                                         surface — distinct from the
                                         public, self-service
                                         RegisterView.
    """

    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        companies = Company.objects.all().order_by("-created_at")
        data = []
        for company in companies:
            payload = CompanySerializer(company).data
            payload["employee_count"] = company.employees.count()
            data.append(payload)

        return api_response(
            success=True,
            message="Companies fetched successfully.",
            data=data,
            status_code=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = AdminCreateCompanySerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(
                success=False,
                message=format_serializer_errors(serializer.errors),
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        admin_user = serializer.save()
        return api_response(
            success=True,
            message=(
                f"Company '{admin_user.company.company_name}' and its "
                "HR Admin account were created successfully."
            ),
            data={
                "company": CompanySerializer(admin_user.company).data,
                "admin": UserSerializer(admin_user).data,
            },
            status_code=status.HTTP_201_CREATED,
        )


class CompanyListCreateView(APIView):
    """
    GET  /api/companies/   -> list all companies (staff only)
    POST /api/companies/   -> register an additional company record
                               (HR_ADMIN only; normal onboarding should
                               go through RegisterView instead — this
                               exists for staff/admin tooling).
    """

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsHRAdmin()]
        return [IsAuthenticated()]

    def get(self, request):
        if request.user.is_staff:
            companies = Company.objects.all()
        else:
            companies = Company.objects.filter(pk=request.user.company_id)

        serializer = CompanySerializer(companies, many=True)
        return api_response(
            success=True,
            message="Companies fetched successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(
                success=False,
                message=format_serializer_errors(serializer.errors),
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        company = serializer.save()
        return api_response(
            success=True,
            message="Company created successfully.",
            data=CompanySerializer(company).data,
            status_code=status.HTTP_201_CREATED,
        )


class CompanyDetailView(APIView):
    """
    GET   /api/companies/<id>/  -> retrieve a company
    PATCH /api/companies/<id>/  -> partially update a company

    A user may only access their own company unless they are staff.
    """

    permission_classes = [IsAuthenticated]

    def _get_company_or_none(self, request, pk):
        try:
            company = Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            return None

        if not request.user.is_staff and company.pk != request.user.company_id:
            return None

        return company

    def get(self, request, pk):
        company = self._get_company_or_none(request, pk)
        if company is None:
            return api_response(
                success=False,
                message="Company not found.",
                data=None,
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return api_response(
            success=True,
            message="Company fetched successfully.",
            data=CompanySerializer(company).data,
            status_code=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        company = self._get_company_or_none(request, pk)
        if company is None:
            return api_response(
                success=False,
                message="Company not found.",
                data=None,
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if not request.user.is_hr_admin and not request.user.is_staff:
            return api_response(
                success=False,
                message="Only an HR Admin can update company details.",
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        serializer = CompanySerializer(
            company, data=request.data, partial=True
        )
        if not serializer.is_valid():
            return api_response(
                success=False,
                message=format_serializer_errors(serializer.errors),
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        company = serializer.save()
        return api_response(
            success=True,
            message="Company updated successfully.",
            data=CompanySerializer(company).data,
            status_code=status.HTTP_200_OK,
        )