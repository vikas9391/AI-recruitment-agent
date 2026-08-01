export const dashboardStats = [
  { id: "active-jobs", label: "Active Jobs", value: 42, growth: 8.2, icon: "Briefcase" },
  { id: "applications", label: "Applications", value: 1284, growth: 12.5, icon: "FileText" },
  { id: "shortlisted", label: "Shortlisted", value: 316, growth: 5.1, icon: "ListChecks" },
  { id: "interviews", label: "Interviews", value: 94, growth: -2.4, icon: "CalendarClock" },
  { id: "offers", label: "Offers", value: 28, growth: 15.0, icon: "Send" },
  { id: "hired", label: "Hired", value: 19, growth: 9.3, icon: "UserCheck" },
] as const;

export const monthlyApplications = [
  { month: "Jan", applications: 180 },
  { month: "Feb", applications: 220 },
  { month: "Mar", applications: 260 },
  { month: "Apr", applications: 240 },
  { month: "May", applications: 310 },
  { month: "Jun", applications: 355 },
  { month: "Jul", applications: 402 },
];

export const hiringFunnel = [
  { stage: "Applied", value: 1284 },
  { stage: "Screening", value: 620 },
  { stage: "Assessment", value: 410 },
  { stage: "Interview", value: 210 },
  { stage: "Offer", value: 60 },
  { stage: "Hired", value: 19 },
];

export const departmentHiring = [
  { department: "Engineering", hires: 34 },
  { department: "Design", hires: 12 },
  { department: "Sales", hires: 21 },
  { department: "Marketing", hires: 9 },
  { department: "Ops", hires: 15 },
];

export const candidateStatus = [
  { name: "In Review", value: 340, color: "#65B8FF" },
  { name: "Shortlisted", value: 210, color: "#B38BFF" },
  { name: "Rejected", value: 480, color: "#EF4444" },
  { name: "Hired", value: 19, color: "#22C55E" },
];

export const recentActivity = [
  { id: 1, type: "job_created", text: "New job opening created for Senior Frontend Engineer", time: "12 minutes ago" },
  { id: 2, type: "shortlisted", text: "Ananya Rao was shortlisted for Product Designer", time: "45 minutes ago" },
  { id: 3, type: "assessment", text: "Rahul Mehta completed the Backend Engineer assessment", time: "2 hours ago" },
  { id: 4, type: "interview", text: "Interview scheduled with Priya Singh for Data Analyst", time: "4 hours ago" },
  { id: 5, type: "offer", text: "Offer approved for Karan Verma — DevOps Engineer", time: "1 day ago" },
] as const;

export const upcomingInterviews = [
  { id: 1, candidate: "Ananya Rao", position: "Product Designer", date: "Aug 3, 2026 · 10:00 AM", status: "Confirmed" },
  { id: 2, candidate: "Rahul Mehta", position: "Backend Engineer", date: "Aug 3, 2026 · 2:30 PM", status: "Pending" },
  { id: 3, candidate: "Priya Singh", position: "Data Analyst", date: "Aug 4, 2026 · 11:00 AM", status: "Confirmed" },
  { id: 4, candidate: "Karan Verma", position: "DevOps Engineer", date: "Aug 5, 2026 · 4:00 PM", status: "Rescheduled" },
] as const;

export const topCandidates = [
  { id: 1, name: "Ananya Rao", role: "Product Designer", matchScore: 96, experience: "5 yrs", skills: ["Figma", "Design Systems", "UX Research"], status: "Shortlisted" },
  { id: 2, name: "Rahul Mehta", role: "Backend Engineer", matchScore: 92, experience: "4 yrs", skills: ["Node.js", "PostgreSQL", "AWS"], status: "In Review" },
  { id: 3, name: "Priya Singh", role: "Data Analyst", matchScore: 89, experience: "3 yrs", skills: ["Python", "SQL", "Tableau"], status: "Shortlisted" },
] as const;

export const recruitmentPipeline = [
  { stage: "Applied", count: 1284 },
  { stage: "Screening", count: 620 },
  { stage: "Assessment", count: 410 },
  { stage: "Interview", count: 210 },
  { stage: "Offer", count: 60 },
  { stage: "Hired", count: 19 },
];