import { apiClient, type ApiEnvelope } from "./apiClient";
import type { CandidateStatus, CandidateListItem, CandidateDetail } from "../types/candidate";

type BackendStatus =
  | "APPLIED" | "PROCESSING" | "UNDER_REVIEW" | "SHORTLISTED"
  | "REJECTED" | "REJECTED_MANDATORY_SKILLS" | "FAILED" | "HIRED" | "WITHDRAWN";

// Exported so other consumers of the same Application resource (e.g. the
// dashboard) can map the identical backend status enum without redefining it.
export const STATUS_TO_UI: Record<BackendStatus, CandidateStatus> = {
  APPLIED: "Applied",
  PROCESSING: "Processing",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  REJECTED_MANDATORY_SKILLS: "Rejected",
  FAILED: "Failed",
  HIRED: "Hired",
  WITHDRAWN: "Withdrawn",
};

// UI -> backend only covers statuses HR can actually set manually via the
// status-update endpoint (AI-only statuses like PROCESSING/FAILED are
// system-set and excluded here).
const STATUS_TO_BACKEND: Partial<Record<CandidateStatus, BackendStatus>> = {
  "Under Review": "UNDER_REVIEW",
  Shortlisted: "SHORTLISTED",
  Rejected: "REJECTED",
  Hired: "HIRED",
  Withdrawn: "WITHDRAWN",
};

function experienceLabel(years: number | string | null): string {
  if (years == null) return "Not specified";
  const n = Number(years);
  return `${n} ${n === 1 ? "year" : "years"}`;
}

interface BackendApplicationList {
  id: number;
  job: number;
  job_title: string;
  candidate: number;
  candidate_name: string;
  candidate_email: string;
  candidate_skills: string[];
  candidate_experience_years: string | number | null;
  status: BackendStatus;
  overall_score: number | null;
  applied_at: string;
  updated_at: string;
}

interface PaginatedResult<T> {
  count: number;
  total_pages: number;
  current_page: number;
  results: T[];
}

function mapListItem(raw: BackendApplicationList): CandidateListItem {
  return {
    id: String(raw.id),
    jobId: String(raw.job),
    name: raw.candidate_name,
    email: raw.candidate_email,
    appliedJob: raw.job_title,
    status: STATUS_TO_UI[raw.status] ?? "Applied",
    matchScore: raw.overall_score != null ? Math.round(raw.overall_score) : 0,
    skills: raw.candidate_skills ?? [],
    experienceYears: raw.candidate_experience_years != null ? Number(raw.candidate_experience_years) : null,
    experienceLabel: experienceLabel(raw.candidate_experience_years),
    appliedAt: raw.applied_at,
  };
}

export async function fetchCandidates(params?: {
  search?: string;
  status?: string;
  job?: string;
  page?: number;
  // Passed straight through to DRF's `ordering=` query param, e.g.
  // "-score__overall_score" for highest-matched first. Used by the
  // dashboard's "Top Candidates" widget.
  ordering?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<BackendApplicationList>>>(
    "/recruitment/applications/",
    { params }
  );
  return {
    candidates: data.data.results.map(mapListItem),
    count: data.data.count,
    totalPages: data.data.total_pages,
  };
}

interface BackendApplicationDetail {
  id: number;
  job: number;
  job_title: string;
  status: BackendStatus;
  cover_note: string | null;
  recruiter_notes: string | null;
  applied_at: string;
  updated_at: string;
  candidate: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string | null;
    total_experience_years: string | number | null;
    highest_education: string | null;
    skills: string[];
  };
  resume: { id: number; file: string; file_name: string; file_type: string } | null;
  analysis: {
    skills: string[];
    matched_skills: string[];
    missing_skills: string[];
    experience_summary: string | null;
    education_summary: string | null;
    projects: string[];
    certifications: string[];
    strengths: string[];
    weaknesses: string[];
  } | null;
  score: { overall_score: number } | null;
}

function mapDetail(raw: BackendApplicationDetail): CandidateDetail {
  const fullName = `${raw.candidate.first_name} ${raw.candidate.last_name}`.trim();
  return {
    id: String(raw.id),
    jobId: String(raw.job),
    name: fullName,
    email: raw.candidate.email,
    phone: raw.candidate.phone,
    location: raw.candidate.location ?? "Not specified",
    appliedJob: raw.job_title,
    status: STATUS_TO_UI[raw.status] ?? "Applied",
    matchScore: raw.score ? Math.round(raw.score.overall_score) : 0,
    education: raw.analysis?.education_summary || raw.candidate.highest_education || "Not specified",
    // Prefer AI-parsed resume skills where available, fall back to the
    // candidate's own declared skill list.
    skills: raw.analysis?.skills?.length ? raw.analysis.skills : raw.candidate.skills ?? [],
    matchedSkills: raw.analysis?.matched_skills ?? [],
    missingSkills: raw.analysis?.missing_skills ?? [],
    experienceYears: raw.candidate.total_experience_years != null ? Number(raw.candidate.total_experience_years) : null,
    experienceLabel: experienceLabel(raw.candidate.total_experience_years),
    projects: raw.analysis?.projects ?? [],
    certifications: raw.analysis?.certifications ?? [],
    strengths: raw.analysis?.strengths ?? [],
    weaknesses: raw.analysis?.weaknesses ?? [],
    aiSummary: raw.analysis?.experience_summary || "AI analysis not available yet for this application.",
    resumeUrl: raw.resume?.file ?? null,
    resumeFileName: raw.resume?.file_name ?? `${fullName || "candidate"}_resume`,
    recruiterNotes: raw.recruiter_notes ?? "",
    appliedAt: raw.applied_at,
  };
}

export async function fetchCandidateDetail(applicationId: string) {
  const { data } = await apiClient.get<ApiEnvelope<BackendApplicationDetail>>(
    `/recruitment/applications/${applicationId}/`
  );
  return mapDetail(data.data);
}

export async function updateCandidateStatus(applicationId: string, status: CandidateStatus, remarks?: string) {
  const backendStatus = STATUS_TO_BACKEND[status];
  if (!backendStatus) {
    throw new Error(`"${status}" can't be set manually — it's a system-managed status.`);
  }
  const { data } = await apiClient.patch<ApiEnvelope<BackendApplicationDetail>>(
    `/recruitment/applications/${applicationId}/status/`,
    { status: backendStatus, remarks }
  );
  return mapDetail(data.data);
}

export async function updateCandidateNotes(applicationId: string, notes: string) {
  const { data } = await apiClient.patch<ApiEnvelope<BackendApplicationDetail>>(
    `/recruitment/applications/${applicationId}/notes/`,
    { recruiter_notes: notes }
  );
  return mapDetail(data.data);
}
