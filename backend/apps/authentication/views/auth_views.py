from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.serializers.auth_serializers import (
    LoginSerializer,
    RegisterSerializer,
)
from apps.authentication.serializers.user_serializers import UserSerializer
from apps.authentication.services import (
    blacklist_refresh_token,
    issue_tokens_for_user,
)
from apps.authentication.utils import api_response, format_serializer_errors


class RegisterView(APIView):
    """
    POST /api/auth/register/

    Registers a new Company together with its first user (HR_ADMIN).
    Returns the created user profile plus a JWT pair so the client can
    log the user straight in after signup.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(
                success=False,
                message=format_serializer_errors(serializer.errors),
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()
        tokens = issue_tokens_for_user(user)

        return api_response(
            success=True,
            message="Company and admin account created successfully.",
            data={
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/

    Authenticates a user by email + password and returns a JWT pair.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return api_response(
                success=False,
                message=format_serializer_errors(serializer.errors),
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.validated_data["user"]
        tokens = issue_tokens_for_user(user)

        return api_response(
            success=True,
            message="Login successful.",
            data={
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status_code=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/

    Blacklists the supplied refresh token so it can no longer be used
    to mint new access tokens. Requires
    `rest_framework_simplejwt.token_blacklist` in INSTALLED_APPS.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return api_response(
                success=False,
                message="'refresh' token is required to log out.",
                data=None,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            blacklist_refresh_token(refresh_token)
        except ValueError as exc:
            return api_response(
                success=False,
                message=str(exc),
                data=None,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return api_response(
            success=True,
            message="Logged out successfully.",
            data=None,
            status_code=status.HTTP_200_OK,
        )


class CurrentUserView(APIView):
    """
    GET /api/auth/me/

    Returns the profile of the currently authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_response(
            success=True,
            message="Current user fetched successfully.",
            data=UserSerializer(request.user).data,
            status_code=status.HTTP_200_OK,
        )


class RefreshTokenView(APIView):
    """
    POST /api/auth/refresh/

    Thin wrapper around SimpleJWT's refresh flow, re-shaped into this
    project's standard {success, message, data} response envelope.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return api_response(
                success=False,
                message="'refresh' token is required.",
                data=None,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
        except TokenError:
            return api_response(
                success=False,
                message="Invalid or expired refresh token.",
                data=None,
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        return api_response(
            success=True,
            message="Access token refreshed successfully.",
            data={"access": access},
            status_code=status.HTTP_200_OK,
        )