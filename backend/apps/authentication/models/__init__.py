"""
Models package for the authentication app.

Django's migration framework and `related_name` lookups need every model
importable from `apps.authentication.models`, so we re-export them here.
"""

from apps.authentication.models.company_model import Company
from apps.authentication.models.user_model import User

__all__ = [
    "Company",
    "User",
]