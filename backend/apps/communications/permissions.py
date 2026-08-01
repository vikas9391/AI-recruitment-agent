from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsHRUserOrAdmin(BasePermission):
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


class IsHRAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        role = getattr(request.user, "role", None)
        if request.method in SAFE_METHODS:
            return role in ("HR_ADMIN", "HR_USER")
        return role == "HR_ADMIN"