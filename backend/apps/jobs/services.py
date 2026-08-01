from typing import Any, Dict

from django.db import transaction
from django.db.models import Q, QuerySet
from rest_framework.exceptions import NotFound, ValidationError

from .models import Job


class JobService:

    @staticmethod
    @transaction.atomic
    def create_job(data: Dict[str, Any], user) -> Job:
        job = Job.objects.create(created_by=user, **data)
        return job

    @staticmethod
    @transaction.atomic
    def update_job(job_id: int, data: Dict[str, Any]) -> Job:
        job = JobService.get_job(job_id)
        for field, value in data.items():
            setattr(job, field, value)
        job.save()
        return job

    @staticmethod
    @transaction.atomic
    def delete_job(job_id: int) -> None:
        job = JobService.get_job(job_id)
        job.delete()

    @staticmethod
    def get_job(job_id: int) -> Job:
        job = Job.objects.filter(id=job_id).first()
        if not job:
            raise NotFound("Job not found.")
        return job

    @staticmethod
    def list_jobs(query_params: Dict[str, Any]) -> QuerySet:
        queryset = Job.objects.all()

        search = query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(company__icontains=search)
                | Q(department__icontains=search)
            )

        filters = {
            "department": ("department__iexact", query_params.get("department")),
            "employment_type": ("employment_type", query_params.get("employment_type")),
            "remote_type": ("remote_type", query_params.get("remote_type")),
            "status": ("status", query_params.get("status")),
            "location": ("location__icontains", query_params.get("location")),
            "company": ("company__icontains", query_params.get("company")),
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
    def open_job(job_id: int) -> Job:
        job = JobService.get_job(job_id)
        if job.status == Job.Status.OPEN:
            raise ValidationError("Job is already open.")
        job.status = Job.Status.OPEN
        job.save(update_fields=["status", "updated_at"])
        return job

    @staticmethod
    @transaction.atomic
    def close_job(job_id: int) -> Job:
        job = JobService.get_job(job_id)
        if job.status == Job.Status.CLOSED:
            raise ValidationError("Job is already closed.")
        job.status = Job.Status.CLOSED
        job.save(update_fields=["status", "updated_at"])
        return job