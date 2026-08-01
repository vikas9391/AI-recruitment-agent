// These map 1:1 onto real `Application` objects from the recruitment
// backend (an application = a candidate applying to one job), not raw
// Candidate records. A candidate with two applications shows up twice —
// which matches how HR actually needs to review them (per job).
export type CandidateStatus =
  | "Applied"
  | "Processing"
  | "Under Review"
  | "Shortlisted"
  | "Rejected"
  | "Failed"
  | "Hired"
  | "Withdrawn";

// Note: there's no "Interview Scheduled" application status on the
// backend — interviews are a separate resource (communications.InterviewSchedule),
// not a status an application sits in. If you want that concept back in the
// UI, derive it from whether an InterviewSchedule exists for the application,
// rather than treating it as a status.

export interface CandidateListItem {
  id: string;
  jobId: string;
  name: string;
  email: string;
  appliedJob: string;
  status: CandidateStatus;
  matchScore: number; // 0 until AI scoring has run
  skills: string[];
  experienceYears: number | null;
  experienceLabel: string;
  appliedAt: string;
}

export interface CandidateDetail extends CandidateListItem {
  phone: string;
  location: string;
  education: string;
  matchedSkills: string[];
  missingSkills: string[];
  projects: string[];
  certifications: string[];
  strengths: string[];
  weaknesses: string[];
  // Composed from ResumeAnalysis.experience_summary — the backend has no
  // single "AI summary" field, this is the closest real one.
  aiSummary: string;
  resumeUrl: string | null;
  resumeFileName: string;
  recruiterNotes: string;
}
