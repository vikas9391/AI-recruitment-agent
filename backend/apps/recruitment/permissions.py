from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsHRUserOrAdmin(BasePermission):
    """Allows access to authenticated HR_ADMIN or HR_USER roles (internal recruitment views)."""

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ("HR_ADMIN", "HR_USER")
        )


class IsHRAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "HR_ADMIN"
        )


class AllowApply(BasePermission):
    """Public endpoint — candidates apply without authentication."""

    def has_permission(self, request, view) -> bool:
        return True

class AllowCandidateSelfService(BasePermission):
    """Public — candidate accesses their own data via verified email lookup."""

    def has_permission(self, request, view) -> bool:
        return True