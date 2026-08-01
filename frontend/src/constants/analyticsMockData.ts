export interface MonthlyApplications {
  month: string;
  applications: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface DepartmentCandidates {
  department: string;
  candidates: number;
}

export interface MatchScoreBucket {
  range: string;
  count: number;
}

export interface AssessmentCompletion {
  name: string;
  value: number;
}

export interface InterviewSuccess {
  month: string;
  successRate: number;
}

export interface ActivityItem {
  id: string;
  type: "Candidate Applied" | "Assessment Completed" | "Interview Scheduled" | "Offer Approved";
  candidateName: string;
  detail: string;
  timestamp: string;
}

export const summaryStats = {
  totalApplications: 482,
  shortlisted: 156,
  interviews: 94,
  offersSent: 38,
  offersAccepted: 29,
  hiringRate: 76, // percent of offers accepted
};

export const applicationsPerMonth: MonthlyApplications[] = [
  { month: "Feb", applications: 52 },
  { month: "Mar", applications: 61 },
  { month: "Apr", applications: 48 },
  { month: "May", applications: 70 },
  { month: "Jun", applications: 85 },
  { month: "Jul", applications: 93 },
  { month: "Aug", applications: 73 },
];

export const hiringFunnel: FunnelStage[] = [
  { stage: "Applications", count: 482 },
  { stage: "Shortlisted", count: 156 },
  { stage: "Interviews", count: 94 },
  { stage: "Offers Sent", count: 38 },
  { stage: "Offers Accepted", count: 29 },
];

export const candidatesByDepartment: DepartmentCandidates[] = [
  { department: "Engineering", candidates: 210 },
  { department: "Design", candidates: 64 },
  { department: "Data Science", candidates: 58 },
  { department: "DevOps", candidates: 45 },
  { department: "QA", candidates: 39 },
  { department: "Product", candidates: 31 },
  { department: "Other", candidates: 35 },
];

export const matchScoreDistribution: MatchScoreBucket[] = [
  { range: "0-49%", count: 18 },
  { range: "50-64%", count: 46 },
  { range: "65-79%", count: 122 },
  { range: "80-89%", count: 158 },
  { range: "90-100%", count: 138 },
];

export const assessmentCompletion: AssessmentCompletion[] = [
  { name: "Completed", value: 68 },
  { name: "In Progress", value: 14 },
  { name: "Pending", value: 12 },
  { name: "Expired", value: 6 },
];

export const interviewSuccessRate: InterviewSuccess[] = [
  { month: "Feb", successRate: 58 },
  { month: "Mar", successRate: 61 },
  { month: "Apr", successRate: 55 },
  { month: "May", successRate: 67 },
  { month: "Jun", successRate: 72 },
  { month: "Jul", successRate: 70 },
  { month: "Aug", successRate: 76 },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "act-001",
    type: "Offer Approved",
    candidateName: "Divya Krishnan",
    detail: "Offer for Full Stack Developer approved and accepted.",
    timestamp: "2 hours ago",
  },
  {
    id: "act-002",
    type: "Interview Scheduled",
    candidateName: "Aditya Joshi",
    detail: "Final round interview scheduled for Cloud Architect role.",
    timestamp: "5 hours ago",
  },
  {
    id: "act-003",
    type: "Assessment Completed",
    candidateName: "Rohan Mehta",
    detail: "Backend Developer Test completed with a score of 81%.",
    timestamp: "Yesterday",
  },
  {
    id: "act-004",
    type: "Candidate Applied",
    candidateName: "Neha Kapoor",
    detail: "Applied for Mobile Developer position.",
    timestamp: "Yesterday",
  },
  {
    id: "act-005",
    type: "Interview Scheduled",
    candidateName: "Karan Verma",
    detail: "Technical interview scheduled for DevOps Engineer role.",
    timestamp: "2 days ago",
  },
  {
    id: "act-006",
    type: "Assessment Completed",
    candidateName: "Vikram Singh",
    detail: "ML Assessment completed with a score of 88%.",
    timestamp: "2 days ago",
  },
  {
    id: "act-007",
    type: "Candidate Applied",
    candidateName: "Sneha Iyer",
    detail: "Applied for Product Designer position.",
    timestamp: "3 days ago",
  },
  {
    id: "act-008",
    type: "Offer Approved",
    candidateName: "Ananya Rao",
    detail: "Offer for Frontend Developer approved, pending response.",
    timestamp: "4 days ago",
  },
];