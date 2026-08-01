from django.core.management.base import BaseCommand

from apps.authentication.models.company_model import Company
from apps.authentication.models.user_model import Role, User

DEFAULT_SUPER_ADMIN_EMAIL = "vikas93912@gmail.com"
DEFAULT_SUPER_ADMIN_PASSWORD = "vikas93912"
PLATFORM_COMPANY_NAME = "Platform"


class Command(BaseCommand):
    help = (
        "Creates the default Super Admin account "
        f"({DEFAULT_SUPER_ADMIN_EMAIL}) if it doesn't already exist. "
        "The Super Admin isn't tied to any single tenant — it's "
        "attached to an internal 'Platform' company used only to "
        "satisfy the User.company foreign key, and can create new "
        "tenant companies via /api/auth/admin/companies/."
    )

    def handle(self, *args, **options):
        if User.objects.filter(email__iexact=DEFAULT_SUPER_ADMIN_EMAIL).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"A user with email {DEFAULT_SUPER_ADMIN_EMAIL} already "
                    "exists — skipping."
                )
            )
            return

        platform_company, _ = Company.objects.get_or_create(
            company_name=PLATFORM_COMPANY_NAME,
            defaults={"company_email": DEFAULT_SUPER_ADMIN_EMAIL},
        )

        User.objects.create_superuser(
            email=DEFAULT_SUPER_ADMIN_EMAIL,
            password=DEFAULT_SUPER_ADMIN_PASSWORD,
            first_name="Vikas",
            last_name="Admin",
            company=platform_company,
            role=Role.SUPER_ADMIN,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Created Super Admin {DEFAULT_SUPER_ADMIN_EMAIL}. "
                "Change this password before deploying anywhere public."
            )
        )
