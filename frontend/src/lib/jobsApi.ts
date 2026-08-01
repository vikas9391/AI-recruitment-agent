import { apiClient, type ApiEnvelope } from "./apiClient";
import type { Job } from "../types/job";

// ---- Raw shapes returned by Django/DRF (snake_case, backend enums) ----

type BackendEmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "TEMPORARY";
type BackendStatus = "DRAFT" | "OPEN" | "CLOSED" | "PAUSED";

interface BackendJob {
  id: number;
  company: number;
  title: string;
  department: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  employment_type: BackendEmploymentType;
  experience_required: string;
  education_required?: string;
  salary_min: string | number | null;
  salary_max: string | number | null;
  location: string;
  remote_type: "ONSITE" | "REMOTE" | "HYBRID";
  skills_required: string[];
  vacancies: number;
  deadline: string;
  status: BackendStatus;
  created_by_name?: string;
  created_at: string;
  updated_at?: string;
}

interface PaginatedResult<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const EMPLOYMENT_TYPE_TO_UI: Record<BackendEmploymentType, Job["employmentType"]> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};
const EMPLOYMENT_TYPE_TO_BACKEND: Record<Job["employmentType"], BackendEmploymentType> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
  Temporary: "TEMPORARY",
};

const STATUS_TO_UI: Record<BackendStatus, Job["status"]> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  PAUSED: "Paused",
};
const STATUS_TO_BACKEND: Record<Job["status"], BackendStatus> = {
  Draft: "DRAFT",
  Open: "OPEN",
  Closed: "CLOSED",
  Paused: "PAUSED",
};

/**
 * The backend has no `experience_level` field, only a free-text
 * `experience_required` string (e.g. "2-4 years"). This is a best-effort
 * guess for UI grouping/filtering only — do not treat it as authoritative.
 * If you need real filtering by level, add an `experience_level` field to
 * the Job model instead of relying on this heuristic.
 */
function inferExperienceLevel(experienceRequired: string): Job["experienceLevel"] {
  const text = experienceRequired.toLowerCase();
  if (/\b(0|1)\b/.test(text) || text.includes("entry") || text.includes("fresher")) return "Entry";
  if (/\b([5-9]|1\d)\+?\b/.test(text) || text.includes("senior") || text.includes("lead")) return "Senior";
  return "Mid";
}

function formatSalaryRange(min: BackendJob["salary_min"], max: BackendJob["salary_max"]): string {
  if (min == null && max == null) return "Not disclosed";
  const fmt = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

function mapBackendJob(raw: BackendJob): Job {
  return {
    id: String(raw.id),
    title: raw.title,
    department: raw.department,
    location: raw.location,
    employmentType: EMPLOYMENT_TYPE_TO_UI[raw.employment_type] ?? "Full-time",
    experienceLevel: inferExperienceLevel(raw.experience_required ?? ""),
    experience: raw.experience_required ?? "Not specified",
    applications: 0, // TODO: backend doesn't return an application count on Job yet —
    // wire this up via /api/dashboard/jobs/analytics/ or add an annotated
    // `application_count` field to JobListSerializer.
    status: STATUS_TO_UI[raw.status] ?? "Draft",
    createdDate: raw.created_at?.slice(0, 10) ?? "",
    salaryRange: formatSalaryRange(raw.salary_min, raw.salary_max),
    vacancies: raw.vacancies,
    skills: raw.skills_required ?? [],
    description: raw.description,
    deadline: raw.deadline,
  };
}

export interface CreateJobPayload {
  title: string;
  department: string;
  description: string;
  requirements: string;
  responsibilities: string;
  employmentType: Job["employmentType"];
  experience: string; // maps to experience_required
  educationRequired: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  remoteType: "ONSITE" | "REMOTE" | "HYBRID";
  skills: string[];
  vacancies: number;
  deadline: string; // YYYY-MM-DD
  status?: Job["status"];
}

function toBackendPayload(payload: CreateJobPayload) {
  return {
    title: payload.title,
    department: payload.department,
    description: payload.description,
    requirements: payload.requirements,
    responsibilities: payload.responsibilities,
    employment_type: EMPLOYMENT_TYPE_TO_BACKEND[payload.employmentType],
    experience_required: payload.experience,
    education_required: payload.educationRequired,
    salary_min: payload.salaryMin ?? null,
    salary_max: payload.salaryMax ?? null,
    location: payload.location,
    remote_type: payload.remoteType,
    skills_required: payload.skills,
    vacancies: payload.vacancies,
    deadline: payload.deadline,
    status: STATUS_TO_BACKEND[payload.status ?? "Draft"],
  };
}

export async function fetchJobs(params?: { search?: string; status?: string; department?: string; page?: number }) {
  const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<BackendJob>>>("/jobs/", { params });
  return {
    jobs: data.data.results.map(mapBackendJob),
    count: data.data.count,
    totalPages: data.data.total_pages,
    currentPage: data.data.current_page,
  };
}

export async function fetchJob(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<BackendJob>>(`/jobs/${id}/`);
  return mapBackendJob(data.data);
}

export async function createJob(payload: CreateJobPayload) {
  const { data } = await apiClient.post<ApiEnvelope<BackendJob>>("/jobs/", toBackendPayload(payload));
  return mapBackendJob(data.data);
}

export async function updateJob(id: string, payload: CreateJobPayload) {
  const { data } = await apiClient.put<ApiEnvelope<BackendJob>>(`/jobs/${id}/`, toBackendPayload(payload));
  return mapBackendJob(data.data);
}

export async function deleteJob(id: string) {
  await apiClient.delete(`/jobs/${id}/`);
}

export async function openJob(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<BackendJob>>(`/jobs/${id}/open/`);
  return mapBackendJob(data.data);
}

export async function closeJob(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<BackendJob>>(`/jobs/${id}/close/`);
  return mapBackendJob(data.data);
}
