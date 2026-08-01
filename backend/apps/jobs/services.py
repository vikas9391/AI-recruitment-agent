import logging
from typing import Any, Dict

from django.db import transaction
from django.db.models import Q, QuerySet
from rest_framework.exceptions import NotFound, ValidationError

from .models import Job

logger = logging.getLogger(__name__)


class JobService:

    @staticmethod
    @transaction.atomic
    def create_job(data: Dict[str, Any], user) -> Job:
        # `company` is never trusted from client input — it's always the
        # caller's own tenant, so a HR Admin can't create a job under
        # another company's id.
        data.pop("company", None)
        job = Job.objects.create(created_by=user, company=user.company, **data)

        # Synchronous inbox pull: if this job was created already OPEN and
        # the company has a connected Gmail mailbox, immediately screen any
        # matching resume emails waiting in the inbox. Never blocks or
        # fails job creation — failures/summary are attached to the
        # instance for the view/serializer to surface.
        job.resume_ingestion_summary = JobService._pull_resumes(job, user)
        return job

    @staticmethod
    def _pull_resumes(job: Job, user) -> Dict[str, Any]:
        try:
            from apps.mailbox.services import ResumeIngestionService
            return ResumeIngestionService.pull_resumes_for_job(job, user)
        except Exception as exc:  # noqa: BLE001 — mailbox issues must never break job creation
            logger.exception("Resume ingestion failed for job %s", job.id)
            return {"attempted": False, "found": 0, "created": 0, "skipped": 0, "failed": 0, "errors": [str(exc)]}

    @staticmethod
    @transaction.atomic
    def update_job(job_id: int, data: Dict[str, Any], user) -> Job:
        job = JobService.get_job(job_id, user)
        data.pop("company", None)  # company can never be reassigned via update
        for field, value in data.items():
            setattr(job, field, value)
        job.save()
        return job

    @staticmethod
    @transaction.atomic
    def delete_job(job_id: int, user) -> None:
        job = JobService.get_job(job_id, user)
        job.delete()

    @staticmethod
    def get_job(job_id: int, user) -> Job:
        job = Job.objects.filter(id=job_id, company=user.company).first()
        if not job:
            raise NotFound("Job not found.")
        return job

    @staticmethod
    def list_jobs(query_params: Dict[str, Any], user) -> QuerySet:
        # Always scoped to the caller's own company — never cross-tenant.
        queryset = Job.objects.filter(company=user.company)

        search = query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(department__icontains=search)
            )

        filters = {
            "department": ("department__iexact", query_params.get("department")),
            "employment_type": ("employment_type", query_params.get("employment_type")),
            "remote_type": ("remote_type", query_params.get("remote_type")),
            "status": ("status", query_params.get("status")),
            "location": ("location__icontains", query_params.get("location")),
        }
        for _, (lookup, value) in filters.items():
            if value:
                queryset = queryset.filter(**{lookup: value})

        min_salary = query_params.get("min_salary")
        if min_salary:
            queryset = queryset.filter(salary_max__gte=min_salary)

        max_salary = query_params.get("max_salary")
        if max_salary:
            queryset = queryset.filter(salary_min__lte=max_salary)

        ordering = query_params.get("ordering")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    @staticmethod
    @transaction.atomic
    def open_job(job_id: int, user) -> Job:
        job = JobService.get_job(job_id, user)
        if job.status == Job.Status.OPEN:
            raise ValidationError("Job is already open.")
        job.status = Job.Status.OPEN
        job.save(update_fields=["status", "updated_at"])
        job.resume_ingestion_summary = JobService._pull_resumes(job, user)
        return job

    @staticmethod
    @transaction.atomic
    def close_job(job_id: int, user) -> Job:
        job = JobService.get_job(job_id, user)
        if job.status == Job.Status.CLOSED:
            raise ValidationError("Job is already closed.")
        job.status = Job.Status.CLOSED
        job.save(update_fields=["status", "updated_at"])
        return job