from rest_framework.permissions import BasePermission


class IsHRUserOrAdmin(BasePermission):
    """Dashboard & analytics are internal HR views — both roles can read."""

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ("HR_ADMIN", "HR_USER")
        )