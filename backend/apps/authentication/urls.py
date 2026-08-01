from django.urls import path

from apps.authentication.views.auth_views import (
    CurrentUserView,
    LoginView,
    LogoutView,
    RefreshTokenView,
    RegisterView,
)
from apps.authentication.views.company_views import (
    CompanyDetailView,
    CompanyListCreateView,
    SuperAdminCompaniesView,
)

app_name = "authentication"

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),

    path(
        "auth/admin/companies/",
        SuperAdminCompaniesView.as_view(),
        name="super-admin-companies",
    ),

    path("companies/", CompanyListCreateView.as_view(), name="company-list"),
    path(
        "companies/<int:pk>/",
        CompanyDetailView.as_view(),
        name="company-detail",
    ),
]