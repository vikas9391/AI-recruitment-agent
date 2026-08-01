from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "company", "department", "employment_type",
        "status", "vacancies", "deadline", "created_by", "created_at",
    )
    list_filter = ("status", "employment_type", "remote_type", "department")
    search_fields = ("title", "company", "department", "location")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")