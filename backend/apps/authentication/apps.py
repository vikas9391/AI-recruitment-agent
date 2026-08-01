from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    """
    App configuration for the Authentication & Company Management module.
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.authentication"
    verbose_name = "Authentication & Company Management"
