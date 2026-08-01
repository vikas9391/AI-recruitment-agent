from collections import Counter
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from django.db.models import Avg, Count, DecimalField, Q
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone

from apps.jobs.models import Job
from apps.recruitment.models import Application, Candidate, ResumeAnalysis, ResumeScore


class DashboardFilterMixin:
    """Shared helper for applying optional start_date/end_date filters."""

    @staticmethod
    def apply_date_range(queryset, field_name: str, start_date: Optional[date], end_date: Optional[date]):
        if start_date:
            queryset = queryset.filter(**{f"{field_name}__date__gte": start_date})
        if end_date:
            queryset = queryset.filter(**{f"{field_name}__date__lte": end_date})
        return queryset


class OverviewDashboardService(DashboardFilterMixin):

    @staticmethod
    def get_kpis(user, start_date: Optional[date] = None, end_date: Optional[date] = None) -> Dict[str, Any]:
        # Every queryset below is scoped to the caller's own company —
        # never platform-wide.
        jobs_qs = Job.objects.filter(company=user.company)
        applications_qs = OverviewDashboardService.apply_date_range(
            Application.objects.filter(job__company=user.company), "applied_at", start_date, end_date
        )

        total_jobs = jobs_qs.count()
        open_jobs = jobs_qs.filter(status=Job.Status.OPEN).count()
        closed_jobs = jobs_qs.filter(status=Job.Status.CLOSED).count()

        total_candidates = Candidate.objects.filter(applications__job__company=user.company).distinct().count()
        total_applications = applications_qs.count()
        shortlisted = applications_qs.filter(status=Application.Status.SHORTLISTED).count()
        rejected = applications_qs.filter(
            status__in=[Application.Status.REJECTED, Application.Status.REJECTED_MANDATORY_SKILLS]
        ).count()
        hired = applications_qs.filter(status=Application.Status.HIRED).count()
        in_progress = applications_qs.filter(
            status__in=[Application.Status.APPLIED, Application.Status.PROCESSING, Application.Status.UNDER_REVIEW]
        ).count()

        avg_score = ResumeScore.objects.filter(application__in=applications_qs).aggregate(
            avg=Avg("overall_score")
        )["avg"]

        shortlist_rate = round((shortlisted / total_applications) * 100, 2) if total_applications else 0.0

        avg_time_to_shortlist = OverviewDashboardService._average_time_to_shortlist(applications_qs)

        interviews_scheduled = 0
        emails_sent = 0
        try:
            from apps.communications.models import EmailLog, InterviewSchedule

            interviews_scheduled = InterviewSchedule.objects.filter(
                application__in=applications_qs
            ).exclude(status=InterviewSchedule.Status.CANCELLED).count()
            emails_sent = EmailLog.objects.filter(
                application__in=applications_qs, status=EmailLog.Status.SENT
            ).count()
        except ImportError:
            pass

        return {
            "total_jobs": total_jobs,
            "open_jobs": open_jobs,
            "closed_jobs": closed_jobs,
            "total_candidates": total_candidates,
            "total_applications": total_applications,
            "shortlisted_applications": shortlisted,
            "rejected_applications": rejected,
            "in_progress_applications": in_progress,
            "hired_applications": hired,
            "average_resume_score": round(float(avg_score), 2) if avg_score is not None else 0.0,
            "shortlist_rate_percentage": shortlist_rate,
            "average_time_to_shortlist_days": avg_time_to_shortlist,
            "interviews_scheduled": interviews_scheduled,
            "emails_sent": emails_sent,
        }

    @staticmethod
    def _average_time_to_shortlist(applications_qs) -> Optional[float]:
        shortlisted_apps = applications_qs.filter(status=Application.Status.SHORTLISTED).prefetch_related("history")
        durations: List[float] = []
        for application in shortlisted_apps:
            first_applied = application.history.filter(status=Application.Status.APPLIED).order_by("changed_at").first()
            shortlisted_event = application.history.filter(status=Application.Status.SHORTLISTED).order_by("changed_at").first()
            if first_applied and shortlisted_event:
                delta = shortlisted_event.changed_at - first_applied.changed_at
                durations.append(delta.total_seconds() / 86400)
        if not durations:
            return None
        return round(sum(durations) / len(durations), 2)

    @staticmethod
    def get_application_status_breakdown(
        user, start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> List[Dict[str, Any]]:
        applications_qs = OverviewDashboardService.apply_date_range(
            Application.objects.filter(job__company=user.company), "applied_at", start_date, end_date
        )
        rows = (
            applications_qs.values("status")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return [{"status": row["status"], "count": row["count"]} for row in rows]

    @staticmethod
    def get_applications_timeline(
        user, start_date: Optional[date] = None, end_date: Optional[date] = None, granularity: str = "day"
    ) -> List[Dict[str, Any]]:
        applications_qs = OverviewDashboardService.apply_date_range(
            Application.objects.filter(job__company=user.company), "applied_at", start_date, end_date
        )

        trunc_fn = TruncMonth if granularity == "month" else TruncDate
        rows = (
            applications_qs.annotate(period=trunc_fn("applied_at"))
            .values("period")
            .annotate(count=Count("id"))
            .order_by("period")
        )

        fmt = "%Y-%m" if granularity == "month" else "%Y-%m-%d"
        return [{"period": row["period"].strftime(fmt), "count": row["count"]} for row in rows]

    @staticmethod
    def get_recent_applications(user, limit: int = 10) -> List[Dict[str, Any]]:
        applications = (
            Application.objects.select_related("candidate", "job", "score")
            .filter(job__company=user.company)
            .order_by("-applied_at")[:limit]
        )
        results = []
        for application in applications:
            score = getattr(application, "score", None)
            results.append({
                "application_id": application.id,
                "candidate_name": application.candidate.full_name,
                "job_title": application.job.title,
                "status": application.status,
                "overall_score": float(score.overall_score) if score else None,
                "applied_at": application.applied_at,
            })
        return results

    @staticmethod
    def get_upcoming_interviews(user, limit: int = 10) -> List[Dict[str, Any]]:
        try:
            from apps.communications.models import InterviewSchedule
        except ImportError:
            return []

        today = timezone.now().date()
        interviews = (
            InterviewSchedule.objects.select_related("application", "application__candidate", "application__job")
            .filter(interview_date__gte=today, application__job__company=user.company)
            .exclude(status=InterviewSchedule.Status.CANCELLED)
            .order_by("interview_date", "interview_time")[:limit]
        )
        results = []
        for interview in interviews:
            results.append({
                "interview_id": interview.id,
                "candidate_name": interview.application.candidate.full_name,
                "job_title": interview.application.job.title,
                "interview_date": interview.interview_date,
                "interview_time": interview.interview_time,
                "mode": interview.mode,
                "status": interview.status,
            })
        return results


class JobAnalyticsService(DashboardFilterMixin):

    @staticmethod
    def get_job_analytics(user, query_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        jobs_qs = Job.objects.filter(company=user.company)

        department = query_params.get("department")
        if department:
            jobs_qs = jobs_qs.filter(department__iexact=department)

        status_filter = query_params.get("status")
        if status_filter:
            jobs_qs = jobs_qs.filter(status=status_filter)

        jobs_qs = jobs_qs.annotate(
            total_applications=Count("applications", distinct=True),
            shortlisted=Count(
                "applications", filter=Q(applications__status=Application.Status.SHORTLISTED), distinct=True
            ),
            rejected=Count(
                "applications",
                filter=Q(
                    applications__status__in=[
                        Application.Status.REJECTED, Application.Status.REJECTED_MANDATORY_SKILLS
                    ]
                ),
                distinct=True,
            ),
            in_progress=Count(
                "applications",
                filter=Q(
                    applications__status__in=[
                        Application.Status.APPLIED, Application.Status.PROCESSING, Application.Status.UNDER_REVIEW
                    ]
                ),
                distinct=True,
            ),
            average_score=Avg("applications__score__overall_score"),
        ).order_by("-total_applications")

        results = []
        for job in jobs_qs:
            results.append({
                "job_id": job.id,
                "job_title": job.title,
                "department": job.department,
                "status": job.status,
                "vacancies": job.vacancies,
                "total_applications": job.total_applications,
                "shortlisted": job.shortlisted,
                "rejected": job.rejected,
                "in_progress": job.in_progress,
                "average_score": round(float(job.average_score), 2) if job.average_score is not None else None,
                "deadline": job.deadline,
            })
        return results

    @staticmethod
    def get_department_distribution(user) -> List[Dict[str, Any]]:
        rows = (
            Job.objects.filter(company=user.company)
            .values("department")
            .annotate(
                job_count=Count("id", distinct=True),
                application_count=Count("applications", distinct=True),
            )
            .order_by("-job_count")
        )
        return [
            {
                "department": row["department"],
                "job_count": row["job_count"],
                "application_count": row["application_count"],
            }
            for row in rows
        ]

    @staticmethod
    def get_top_jobs_by_applications(user, limit: int = 5) -> List[Dict[str, Any]]:
        return JobAnalyticsService.get_job_analytics(user, {})[:limit]


class CandidateAnalyticsService:

    @staticmethod
    def get_candidate_analytics(user) -> Dict[str, Any]:
        # "Candidates" scoped to this company = candidates who've applied
        # to at least one of this company's jobs. Candidate itself has no
        # company FK (one candidate row can apply across companies), so
        # scoping has to go through the application relation.
        company_candidates_qs = Candidate.objects.filter(applications__job__company=user.company).distinct()
        total_candidates = company_candidates_qs.count()

        today = timezone.now().date()
        month_start = today.replace(day=1)
        new_this_month = company_candidates_qs.filter(created_at__date__gte=month_start).count()

        top_skills = CandidateAnalyticsService._top_skills(user, limit=10)
        experience_distribution = CandidateAnalyticsService._experience_distribution(user)

        total_applications = Application.objects.filter(job__company=user.company).count()
        applications_per_candidate_avg = (
            round(total_applications / total_candidates, 2) if total_candidates else 0.0
        )

        return {
            "total_candidates": total_candidates,
            "new_candidates_this_month": new_this_month,
            "top_skills": top_skills,
            "experience_distribution": experience_distribution,
            "applications_per_candidate_avg": applications_per_candidate_avg,
        }

    @staticmethod
    def _top_skills(user, limit: int = 10) -> List[Dict[str, Any]]:
        skill_counter: Counter = Counter()
        candidates_qs = (
            Candidate.objects.filter(applications__job__company=user.company)
            .distinct()
            .exclude(skills=[])
        )
        for skills in candidates_qs.values_list("skills", flat=True):
            if isinstance(skills, list):
                for skill in skills:
                    normalized = str(skill).strip().lower()
                    if normalized:
                        skill_counter[normalized] += 1

        return [
            {"skill": skill, "count": count}
            for skill, count in skill_counter.most_common(limit)
        ]

    @staticmethod
    def _experience_distribution(user) -> Dict[str, int]:
        buckets = {"0-1 years": 0, "1-3 years": 0, "3-5 years": 0, "5-10 years": 0, "10+ years": 0, "Not specified": 0}

        candidates_qs = Candidate.objects.filter(applications__job__company=user.company).distinct()
        for exp in candidates_qs.values_list("total_experience_years", flat=True):
            if exp is None:
                buckets["Not specified"] += 1
            elif exp < 1:
                buckets["0-1 years"] += 1
            elif exp < 3:
                buckets["1-3 years"] += 1
            elif exp < 5:
                buckets["3-5 years"] += 1
            elif exp < 10:
                buckets["5-10 years"] += 1
            else:
                buckets["10+ years"] += 1

        return buckets


class ScreeningAnalyticsService:

    @staticmethod
    def get_screening_analytics(user) -> Dict[str, Any]:
        scores_qs = ResumeScore.objects.filter(application__job__company=user.company)
        total_resumes_analyzed = scores_qs.count()

        aggregates = scores_qs.aggregate(
            avg_overall=Avg("overall_score"),
            avg_skills=Avg("skills_match_score"),
            avg_experience=Avg("experience_score"),
            avg_education=Avg("education_score"),
            avg_projects=Avg("projects_score"),
            avg_certifications=Avg("certifications_score"),
            avg_ats=Avg("ats_formatting_score"),
            avg_keyword=Avg("keyword_match_score"),
        )

        analysis_qs = ResumeAnalysis.objects.filter(application__job__company=user.company)
        total_analyzed = analysis_qs.count()
        passed_mandatory = analysis_qs.filter(mandatory_skills_passed=True).count()
        pass_rate = round((passed_mandatory / total_analyzed) * 100, 2) if total_analyzed else 0.0

        score_distribution = ScreeningAnalyticsService._score_distribution(scores_qs)
        missing_skills = ScreeningAnalyticsService._most_common_missing_skills(user, limit=10)

        def _fmt(value) -> float:
            return round(float(value), 2) if value is not None else 0.0

        return {
            "total_resumes_analyzed": total_resumes_analyzed,
            "average_overall_score": _fmt(aggregates["avg_overall"]),
            "average_skills_match_score": _fmt(aggregates["avg_skills"]),
            "average_experience_score": _fmt(aggregates["avg_experience"]),
            "average_education_score": _fmt(aggregates["avg_education"]),
            "average_projects_score": _fmt(aggregates["avg_projects"]),
            "average_certifications_score": _fmt(aggregates["avg_certifications"]),
            "average_ats_score": _fmt(aggregates["avg_ats"]),
            "average_keyword_match_score": _fmt(aggregates["avg_keyword"]),
            "mandatory_skills_pass_rate_percentage": pass_rate,
            "score_distribution": score_distribution,
            "most_common_missing_skills": missing_skills,
        }

    @staticmethod
    def _score_distribution(scores_qs) -> List[Dict[str, Any]]:
        buckets = [
            ("0-20", 0, 20), ("21-40", 21, 40), ("41-60", 41, 60),
            ("61-75", 61, 75), ("76-90", 76, 90), ("91-100", 91, 100),
        ]
        results = []
        for label, low, high in buckets:
            count = scores_qs.filter(overall_score__gte=low, overall_score__lte=high).count()
            results.append({"bucket": label, "count": count})
        return results

    @staticmethod
    def _most_common_missing_skills(user, limit: int = 10) -> List[Dict[str, Any]]:
        skill_counter: Counter = Counter()
        analysis_qs = (
            ResumeAnalysis.objects.filter(application__job__company=user.company)
            .exclude(missing_skills=[])
        )
        for missing in analysis_qs.values_list("missing_skills", flat=True):
            if isinstance(missing, list):
                for skill in missing:
                    normalized = str(skill).strip().lower()
                    if normalized:
                        skill_counter[normalized] += 1

        return [
            {"skill": skill, "count": count}
            for skill, count in skill_counter.most_common(limit)
        ]
