from django.contrib import admin

from .models import GmailAccount, ProcessedResumeEmail


@admin.register(GmailAccount)
class GmailAccountAdmin(admin.ModelAdmin):
    list_display = ("gmail_address", "company", "is_active", "last_synced_at")
    list_filter = ("is_active",)
    search_fields = ("gmail_address", "company__company_name")
    readonly_fields = ("refresh_token", "created_at", "updated_at")


@admin.register(ProcessedResumeEmail)
class ProcessedResumeEmailAdmin(admin.ModelAdmin):
    list_display = ("gmail_message_id", "job", "sender_email", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("gmail_message_id", "sender_email", "job__title")
