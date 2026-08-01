from django.contrib import admin

from .models import (
    Application,
    ApplicationHistory,
    Candidate,
    CandidateDocument,
    Resume,
    ResumeAnalysis,
    ResumeScore,
)


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email", "phone", "created_at")
    search_fields = ("first_name", "last_name", "email", "phone")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate", "file_name", "file_type", "is_parsed", "uploaded_at")
    list_filter = ("file_type", "is_parsed")
    search_fields = ("candidate__first_name", "candidate__last_name", "candidate__email", "file_name")
    readonly_fields = ("uploaded_at",)


class ApplicationHistoryInline(admin.TabularInline):
    model = ApplicationHistory
    extra = 0
    readonly_fields = ("status", "remarks", "changed_at")
    can_delete = False


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate", "job", "status", "applied_at", "updated_at")
    list_filter = ("status", "job")
    search_fields = ("candidate__first_name", "candidate__last_name", "candidate__email", "job__title")
    readonly_fields = ("applied_at", "updated_at")
    inlines = [ApplicationHistoryInline]


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "application", "mandatory_skills_passed", "ats_score", "keyword_match", "created_at")
    list_filter = ("mandatory_skills_passed",)
    readonly_fields = ("created_at",)


@admin.register(ResumeScore)
class ResumeScoreAdmin(admin.ModelAdmin):
    list_display = ("id", "application", "overall_score", "threshold_used", "is_shortlisted", "created_at")
    list_filter = ("is_shortlisted",)
    readonly_fields = ("created_at",)


@admin.register(ApplicationHistory)
class ApplicationHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "application", "status", "changed_at")
    list_filter = ("status",)
    readonly_fields = ("changed_at",)

@admin.register(CandidateDocument)
class CandidateDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "candidate", "document_type", "file_name", "application", "uploaded_at")
    list_filter = ("document_type",)
    search_fields = ("candidate__first_name", "candidate__last_name", "candidate__email", "file_name")
    readonly_fields = ("uploaded_at",)