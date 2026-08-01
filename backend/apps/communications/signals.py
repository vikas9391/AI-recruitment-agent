import logging

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.recruitment.models import Application

from .services import NotificationService

logger = logging.getLogger(__name__)

_STATUS_CACHE_ATTR = "_previous_status"


@receiver(pre_save, sender=Application)
def cache_previous_status(sender, instance: Application, **kwargs) -> None:
    if instance.pk:
        previous = Application.objects.filter(pk=instance.pk).values_list("status", flat=True).first()
        setattr(instance, _STATUS_CACHE_ATTR, previous)
    else:
        setattr(instance, _STATUS_CACHE_ATTR, None)


@receiver(post_save, sender=Application)
def notify_on_status_change(sender, instance: Application, created: bool, **kwargs) -> None:
    previous_status = getattr(instance, _STATUS_CACHE_ATTR, None)

    if created:
        try:
            NotificationService.send_application_received(instance)
        except Exception:
            logger.exception("Failed to send application-received notification for application %s", instance.pk)
        return

    if previous_status is not None and previous_status != instance.status:
        try:
            NotificationService.notify_status_change(instance)
        except Exception:
            logger.exception("Failed to send status-change notification for application %s", instance.pk)