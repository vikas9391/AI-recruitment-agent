from rest_framework import serializers


class DateRangeFilterSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({"start_date": "start_date cannot be after end_date."})
        return attrs


class OverviewKPISerializer(serializers.Serializer):
    total_jobs = serializers.IntegerField()
    open_jobs = serializers.IntegerField()
    closed_jobs = serializers.IntegerField()
    total_candidates = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    shortlisted_applications = serializers.IntegerField()
    rejected_applications = serializers.IntegerField()
    in_progress_applications = serializers.IntegerField()
    hired_applications = serializers.IntegerField()
    average_resume_score = serializers.FloatField()
    shortlist_rate_percentage = serializers.FloatField()
    average_time_to_shortlist_days = serializers.FloatField(allow_null=True)
    interviews_scheduled = serializers.IntegerField()
    emails_sent = serializers.IntegerField()


class ApplicationStatusBreakdownSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()


class ApplicationsTimelinePointSerializer(serializers.Serializer):
    period = serializers.CharField()
    count = serializers.IntegerField()


class JobAnalyticsItemSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    job_title = serializers.CharField()
    department = serializers.CharField()
    status = serializers.CharField()
    vacancies = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    shortlisted = serializers.IntegerField()
    rejected = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    average_score = serializers.FloatField(allow_null=True)
    deadline = serializers.DateField()


class DepartmentDistributionSerializer(serializers.Serializer):
    department = serializers.CharField()
    job_count = serializers.IntegerField()
    application_count = serializers.IntegerField()


class TopSkillSerializer(serializers.Serializer):
    skill = serializers.CharField()
    count = serializers.IntegerField()


class CandidateAnalyticsSerializer(serializers.Serializer):
    total_candidates = serializers.IntegerField()
    new_candidates_this_month = serializers.IntegerField()
    top_skills = TopSkillSerializer(many=True)
    experience_distribution = serializers.DictField(child=serializers.IntegerField())
    applications_per_candidate_avg = serializers.FloatField()


class ScoreDistributionBucketSerializer(serializers.Serializer):
    bucket = serializers.CharField()
    count = serializers.IntegerField()


class ScreeningAnalyticsSerializer(serializers.Serializer):
    total_resumes_analyzed = serializers.IntegerField()
    average_overall_score = serializers.FloatField()
    average_skills_match_score = serializers.FloatField()
    average_experience_score = serializers.FloatField()
    average_education_score = serializers.FloatField()
    average_projects_score = serializers.FloatField()
    average_certifications_score = serializers.FloatField()
    average_ats_score = serializers.FloatField()
    average_keyword_match_score = serializers.FloatField()
    mandatory_skills_pass_rate_percentage = serializers.FloatField()
    score_distribution = ScoreDistributionBucketSerializer(many=True)
    most_common_missing_skills = TopSkillSerializer(many=True)


class RecentApplicationSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    candidate_name = serializers.CharField()
    job_title = serializers.CharField()
    status = serializers.CharField()
    overall_score = serializers.FloatField(allow_null=True)
    applied_at = serializers.DateTimeField()


class UpcomingInterviewSerializer(serializers.Serializer):
    interview_id = serializers.IntegerField()
    candidate_name = serializers.CharField()
    job_title = serializers.CharField()
    interview_date = serializers.DateField()
    interview_time = serializers.TimeField()
    mode = serializers.CharField()
    status = serializers.CharField()