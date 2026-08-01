from rest_framework.permissions import BasePermission

from apps.authentication.models.user_model import Role


class IsHRAdmin(BasePermission):
    """
    Grants access only to authenticated users with the HR_ADMIN role.

    Kept deliberately simple for Module 1 — a full RBAC/permission
    matrix is out of scope here.
    """

    message = "Only an HR Admin can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.HR_ADMIN
        )


class IsSameCompany(BasePermission):
    """
    Object-level permission: restricts access to objects belonging to
    the requesting user's own company. Intended for future modules
    (jobs, recruitment) that scope data by company; included now so
    the pattern is established from Module 1 onward.
    """

    message = "You do not have access to this company's data."

    def has_object_permission(self, request, view, obj):
        company = getattr(obj, "company", obj)
        return bool(
            request.user
            and request.user.is_authenticated
            and company == request.user.company
        )