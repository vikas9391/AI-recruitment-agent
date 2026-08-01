import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("authentication", "0001_initial"),
        ("jobs", "0001_initial"),
        ("recruitment", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="GmailAccount",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("gmail_address", models.EmailField(max_length=254)),
                ("refresh_token", models.TextField()),
                ("is_active", models.BooleanField(default=True)),
                ("last_synced_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "company",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="gmail_account",
                        to="authentication.company",
                    ),
                ),
            ],
            options={
                "db_table": "gmail_accounts",
                "verbose_name": "Gmail Account",
                "verbose_name_plural": "Gmail Accounts",
            },
        ),
        migrations.CreateModel(
            name="ProcessedResumeEmail",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("gmail_message_id", models.CharField(max_length=100)),
                ("sender_email", models.EmailField(blank=True, max_length=254)),
                (
                    "status",
                    models.CharField(
                        choices=[("INGESTED", "Ingested"), ("SKIPPED", "Skipped"), ("FAILED", "Failed")],
                        default="INGESTED",
                        max_length=20,
                    ),
                ),
                ("detail", models.CharField(blank=True, max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "application",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="source_email",
                        to="recruitment.application",
                    ),
                ),
                (
                    "job",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="processed_resume_emails",
                        to="jobs.job",
                    ),
                ),
            ],
            options={"db_table": "processed_resume_emails"},
        ),
        migrations.AddIndex(
            model_name="processedresumeemail",
            index=models.Index(fields=["job", "gmail_message_id"], name="processed_r_job_id_27c038_idx"),
        ),
        migrations.AddConstraint(
            model_name="processedresumeemail",
            constraint=models.UniqueConstraint(
                fields=("job", "gmail_message_id"), name="unique_job_gmail_message"
            ),
        ),
    ]
