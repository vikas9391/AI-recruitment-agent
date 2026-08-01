from django.contrib import admin
from django.urls import path, include

# ADD THESE TWO IMPORTS
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("apps.authentication.urls")),
    path("api/", include("apps.jobs.urls")),
    path("api/recruitment/", include("apps.recruitment.urls")),
    path("api/communications/", include("apps.communications.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]

# ADD THIS AT THE VERY END OF THE FILE
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )