import { apiClient, type ApiEnvelope } from "./apiClient";
import { STATUS_TO_UI } from "./candidatesApi";
import type {
  CandidateAnalytics,
  DashboardKPIs,
  DepartmentDistributionItem,
  FunnelStage,
  JobAnalyticsItem,
  RecentApplicationItem,
  ScreeningAnalytics,
  StatusBreakdownItem,
  TimelinePoint,
  UpcomingInterviewItem,
} from "../types/dashboard";

// ---- Raw shapes returned by apps/dashboard/services.py (snake_case) ----

interface BackendKPIs {
  total_jobs: number;
  open_jobs: number;
  closed_jobs: number;
  total_candidates: number;
  total_applications: number;
  shortlisted_applications: number;
  rejected_applications: number;
  in_progress_applications: number;
  hired_applications: number;
  average_resume_score: number;
  shortlist_rate_percentage: number;
  average_time_to_shortlist_days: number | null;
  interviews_scheduled: number;
  emails_sent: number;
}

interface BackendStatusBreakdown {
  status: string;
  count: number;
}

interface BackendTimelinePoint {
  period: string;
  count: number;
}

interface BackendRecentApplication {
  application_id: number;
  candidate_name: string;
  job_title: string;
  status: string;
  overall_score: number | null;
  applied_at: string;
}

interface BackendUpcomingInterview {
  interview_id: number;
  candidate_name: string;
  job_title: string;
  interview_date: string; // YYYY-MM-DD
  interview_time: string; // HH:MM:SS
  mode: "ONLINE" | "OFFLINE" | "PHONE";
  status: "SCHEDULED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED";
}

interface BackendJobAnalytics {
  job_id: number;
  job_title: string;
  department: string;
  status: string;
  vacancies: number;
  total_applications: number;
  shortlisted: number;
  rejected: number;
  in_progress: number;
  average_score: number | null;
  deadline: string;
}

interface BackendDepartmentDistribution {
  department: string;
  job_count: number;
  application_count: number;
}

interface BackendCandidateAnalytics {
  total_candidates: number;
  new_candidates_this_month: number;
  top_skills: { skill: string; count: number }[];
  experience_distribution: Record<string, number>;
  applications_per_candidate_avg: number;
}

interface BackendScreeningAnalytics {
  total_resumes_analyzed: number;
  average_overall_score: number;
  average_skills_match_score: number;
  average_experience_score: number;
  average_education_score: number;
  average_projects_score: number;
  average_certifications_score: number;
  average_ats_score: number;
  average_keyword_match_score: number;
  mandatory_skills_pass_rate_percentage: number;
  score_distribution: { bucket: string; count: number }[];
  most_common_missing_skills: { skill: string; count: number }[];
}

// ---- Mappers ----

function mapKPIs(raw: BackendKPIs): DashboardKPIs {
  return {
    totalJobs: raw.total_jobs,
    openJobs: raw.open_jobs,
    closedJobs: raw.closed_jobs,
    totalCandidates: raw.total_candidates,
    totalApplications: raw.total_applications,
    shortlistedApplications: raw.shortlisted_applications,
    rejectedApplications: raw.rejected_applications,
    inProgressApplications: raw.in_progress_applications,
    hiredApplications: raw.hired_applications,
    averageResumeScore: raw.average_resume_score,
    shortlistRatePercentage: raw.shortlist_rate_percentage,
    averageTimeToShortlistDays: raw.average_time_to_shortlist_days,
    interviewsScheduled: raw.interviews_scheduled,
    emailsSent: raw.emails_sent,
  };
}

const MONTH_LABEL = new Intl.DateTimeFormat("en", { month: "short" });

function mapTimelinePoint(raw: BackendTimelinePoint): TimelinePoint {
  // period is "YYYY-MM-DD" (day granularity) or "YYYY-MM" (month granularity)
  const parts = raw.period.split("-").map(Number);
  const label =
    parts.length === 3
      ? MONTH_LABEL.format(new Date(parts[0], parts[1] - 1, parts[2])) + ` ${parts[2]}`
      : MONTH_LABEL.format(new Date(parts[0], (parts[1] ?? 1) - 1, 1));
  return { period: raw.period, label, count: raw.count };
}

const MODE_TO_UI: Record<BackendUpcomingInterview["mode"], string> = {
  ONLINE: "Online",
  OFFLINE: "In-person",
  PHONE: "Phone",
};

const INTERVIEW_STATUS_TO_UI: Record<BackendUpcomingInterview["status"], string> = {
  SCHEDULED: "Confirmed",
  RESCHEDULED: "Rescheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function mapUpcomingInterview(raw: BackendUpcomingInterview): UpcomingInterviewItem {
  const date = new Date(`${raw.interview_date}T${raw.interview_time}`);
  const dateLabel = Number.isNaN(date.getTime())
    ? `${raw.interview_date} · ${raw.interview_time.slice(0, 5)}`
    : `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${date.toLocaleTimeString(
        "en-US",
        { hour: "numeric", minute: "2-digit" }
      )}`;
  return {
    id: String(raw.interview_id),
    candidate: raw.candidate_name,
    position: raw.job_title,
    date: dateLabel,
    mode: MODE_TO_UI[raw.mode] ?? raw.mode,
    status: INTERVIEW_STATUS_TO_UI[raw.status] ?? raw.status,
  };
}

function mapJobAnalytics(raw: BackendJobAnalytics): JobAnalyticsItem {
  return {
    jobId: String(raw.job_id),
    jobTitle: raw.job_title,
    department: raw.department,
    status: raw.status,
    vacancies: raw.vacancies,
    totalApplications: raw.total_applications,
    shortlisted: raw.shortlisted,
    rejected: raw.rejected,
    inProgress: raw.in_progress,
    averageScore: raw.average_score,
    deadline: raw.deadline,
  };
}

function mapCandidateAnalytics(raw: BackendCandidateAnalytics): CandidateAnalytics {
  return {
    totalCandidates: raw.total_candidates,
    newCandidatesThisMonth: raw.new_candidates_this_month,
    topSkills: raw.top_skills,
    experienceDistribution: raw.experience_distribution,
    applicationsPerCandidateAvg: raw.applications_per_candidate_avg,
  };
}

function mapScreeningAnalytics(raw: BackendScreeningAnalytics): ScreeningAnalytics {
  return {
    totalResumesAnalyzed: raw.total_resumes_analyzed,
    averageOverallScore: raw.average_overall_score,
    averageSkillsMatchScore: raw.average_skills_match_score,
    averageExperienceScore: raw.average_experience_score,
    averageEducationScore: raw.average_education_score,
    averageProjectsScore: raw.average_projects_score,
    averageCertificationsScore: raw.average_certifications_score,
    averageAtsScore: raw.average_ats_score,
    averageKeywordMatchScore: raw.average_keyword_match_score,
    mandatorySkillsPassRatePercentage: raw.mandatory_skills_pass_rate_percentage,
    scoreDistribution: raw.score_distribution,
    mostCommonMissingSkills: raw.most_common_missing_skills,
  };
}

// ---- Public API ----

export interface DateRangeParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
}

export async function fetchDashboardOverview(params?: DateRangeParams): Promise<DashboardKPIs> {
  const { data } = await apiClient.get<ApiEnvelope<BackendKPIs>>("/dashboard/overview/", {
    params: { start_date: params?.startDate, end_date: params?.endDate },
  });
  return mapKPIs(data.data);
}

export async function fetchApplicationStatusBreakdown(
  params?: DateRangeParams
): Promise<StatusBreakdownItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendStatusBreakdown[]>>(
    "/dashboard/applications/status-breakdown/",
    { params: { start_date: params?.startDate, end_date: params?.endDate } }
  );
  return data.data.map((row) => ({
    status: row.status,
    label: STATUS_TO_UI[row.status as keyof typeof STATUS_TO_UI] ?? row.status,
    count: row.count,
  }));
}

export async function fetchApplicationsTimeline(
  params?: DateRangeParams & { granularity?: "day" | "month" }
): Promise<TimelinePoint[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendTimelinePoint[]>>(
    "/dashboard/applications/timeline/",
    {
      params: {
        start_date: params?.startDate,
        end_date: params?.endDate,
        granularity: params?.granularity ?? "month",
      },
    }
  );
  return data.data.map(mapTimelinePoint);
}

export async function fetchRecentApplications(limit = 10): Promise<RecentApplicationItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendRecentApplication[]>>(
    "/dashboard/applications/recent/",
    { params: { limit } }
  );
  return data.data.map((row) => ({
    id: String(row.application_id),
    candidateName: row.candidate_name,
    jobTitle: row.job_title,
    status: STATUS_TO_UI[row.status as keyof typeof STATUS_TO_UI] ?? row.status,
    overallScore: row.overall_score,
    appliedAt: row.applied_at,
  }));
}

export async function fetchUpcomingInterviews(limit = 10): Promise<UpcomingInterviewItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendUpcomingInterview[]>>(
    "/dashboard/interviews/upcoming/",
    { params: { limit } }
  );
  return data.data.map(mapUpcomingInterview);
}

export async function fetchJobAnalytics(params?: {
  department?: string;
  status?: string;
}): Promise<JobAnalyticsItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendJobAnalytics[]>>("/dashboard/jobs/analytics/", {
    params,
  });
  return data.data.map(mapJobAnalytics);
}

export async function fetchDepartmentDistribution(): Promise<DepartmentDistributionItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendDepartmentDistribution[]>>(
    "/dashboard/jobs/department-distribution/"
  );
  return data.data.map((row) => ({
    department: row.department,
    jobCount: row.job_count,
    applicationCount: row.application_count,
  }));
}

export async function fetchTopJobs(limit = 5): Promise<JobAnalyticsItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BackendJobAnalytics[]>>("/dashboard/jobs/top/", {
    params: { limit },
  });
  return data.data.map(mapJobAnalytics);
}

export async function fetchCandidateAnalytics(): Promise<CandidateAnalytics> {
  const { data } = await apiClient.get<ApiEnvelope<BackendCandidateAnalytics>>(
    "/dashboard/candidates/analytics/"
  );
  return mapCandidateAnalytics(data.data);
}

export async function fetchScreeningAnalytics(): Promise<ScreeningAnalytics> {
  const { data } = await apiClient.get<ApiEnvelope<BackendScreeningAnalytics>>(
    "/dashboard/screening/analytics/"
  );
  return mapScreeningAnalytics(data.data);
}

/**
 * There's no dedicated "hiring funnel" endpoint — the backend doesn't
 * model a linear funnel, just independent counts. This builds one from
 * the overview KPIs using the same four stages the old mock data used
 * (Applications -> Shortlisted -> Interviews -> Hired), which is the
 * closest honest read of a "funnel" the real data supports. Note this
 * isn't strictly monotonic in theory (e.g. an application could be
 * shortlisted without an interview yet being scheduled), so treat it as
 * a summary, not a strict conversion funnel.
 */
export function buildHiringFunnel(kpis: DashboardKPIs): FunnelStage[] {
  return [
    { stage: "Applications", count: kpis.totalApplications },
    { stage: "Shortlisted", count: kpis.shortlistedApplications },
    { stage: "Interviews", count: kpis.interviewsScheduled },
    { stage: "Hired", count: kpis.hiredApplications },
  ];
}
