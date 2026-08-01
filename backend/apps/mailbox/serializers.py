from rest_framework import serializers

from .models import GmailAccount


class GmailAccountStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = GmailAccount
        fields = ["gmail_address", "is_active", "last_synced_at", "created_at"]
