"""
Business-logic layer for the authentication app.

Views should stay thin (parse request -> call service -> shape response).
Anything that isn't pure request/response plumbing lives here so it is
independently testable and reusable (e.g. from management commands or
Module 2+ later on).
"""

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens_for_user(user) -> dict:
    """
    Generate a fresh access/refresh token pair for a user and return
    them alongside a lightweight identity payload.
    """
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def blacklist_refresh_token(refresh_token: str) -> None:
    """
    Invalidate a refresh token on logout.

    Requires `rest_framework_simplejwt.token_blacklist` to be in
    INSTALLED_APPS (see MODULE_1_SETUP notes).
    """
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except TokenError as exc:
        raise ValueError("Invalid or expired refresh token.") from exc