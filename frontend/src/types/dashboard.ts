// These mirror the real payloads returned by apps/dashboard/services.py.
// There is no "offers" concept, no interview-outcome tracking, and no
// assessment-completion tracking anywhere in the backend yet (those are
// separate, not-yet-built pieces — see Emails/Assessments in the cutover
// notes) — so none of those show up here. Everything below is backed by
// a real queryset.

export interface DashboardKPIs {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalCandidates: number;
  totalApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
  inProgressApplications: number;
  hiredApplications: number;
  averageResumeScore: number;
  shortlistRatePercentage: number;
  // null until at least one application has actually moved APPLIED -> SHORTLISTED
  averageTimeToShortlistDays: number | null;
  interviewsScheduled: number;
  emailsSent: number;
}

export interface StatusBreakdownItem {
  status: string; // backend enum value, e.g. SHORTLISTED
  label: string; // UI label, e.g. "Shortlisted"
  count: number;
}

export interface TimelinePoint {
  period: string; // raw backend period key (YYYY-MM-DD or YYYY-MM)
  label: string; // display label, e.g. "Aug" or "Aug 3"
  count: number;
}

export interface RecentApplicationItem {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  overallScore: number | null;
  appliedAt: string;
}

export interface UpcomingInterviewItem {
  id: string;
  candidate: string;
  position: string;
  date: string; // pre-formatted for display, e.g. "Aug 3, 2026 · 10:00 AM"
  mode: string;
  status: string;
}

export interface JobAnalyticsItem {
  jobId: string;
  jobTitle: string;
  department: string;
  status: string;
  vacancies: number;
  totalApplications: number;
  shortlisted: number;
  rejected: number;
  inProgress: number;
  averageScore: number | null;
  deadline: string;
}

export interface DepartmentDistributionItem {
  department: string;
  jobCount: number;
  applicationCount: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface CandidateAnalytics {
  totalCandidates: number;
  newCandidatesThisMonth: number;
  topSkills: { skill: string; count: number }[];
  experienceDistribution: Record<string, number>;
  applicationsPerCandidateAvg: number;
}

export interface ScreeningAnalytics {
  totalResumesAnalyzed: number;
  averageOverallScore: number;
  averageSkillsMatchScore: number;
  averageExperienceScore: number;
  averageEducationScore: number;
  averageProjectsScore: number;
  averageCertificationsScore: number;
  averageAtsScore: number;
  averageKeywordMatchScore: number;
  mandatorySkillsPassRatePercentage: number;
  scoreDistribution: { bucket: string; count: number }[];
  mostCommonMissingSkills: { skill: string; count: number }[];
}
