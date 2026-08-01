export type AssessmentStatus = "Pending" | "In Progress" | "Completed" | "Expired";
export type AssessmentDifficulty = "Easy" | "Medium" | "Hard";

export interface QuestionSummaryItem {
  topic: string;
  count: number;
}

export interface Assessment {
  id: string;
  name: string;
  candidateName: string;
  jobRole: string;
  difficulty: AssessmentDifficulty;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
  score: number | null;
  status: AssessmentStatus;
  createdDate: string;
  submissionTime: string | null;
  questionSummary: QuestionSummaryItem[];
}

export const assessments: Assessment[] = [
  {
    id: "a-001",
    name: "Frontend Developer Test",
    candidateName: "Ananya Rao",
    jobRole: "Frontend Developer",
    difficulty: "Medium",
    questionCount: 25,
    durationMinutes: 45,
    passingScore: 70,
    score: 92,
    status: "Completed",
    createdDate: "2026-06-12",
    submissionTime: "38 min",
    questionSummary: [
      { topic: "React & Hooks", count: 8 },
      { topic: "CSS & Layout", count: 6 },
      { topic: "JavaScript Fundamentals", count: 7 },
      { topic: "Debugging", count: 4 },
    ],
  },
  {
    id: "a-002",
    name: "Backend Developer Test",
    candidateName: "Rohan Mehta",
    jobRole: "Backend Developer",
    difficulty: "Hard",
    questionCount: 30,
    durationMinutes: 60,
    passingScore: 75,
    score: 81,
    status: "Completed",
    createdDate: "2026-06-10",
    submissionTime: "54 min",
    questionSummary: [
      { topic: "System Design", count: 8 },
      { topic: "Spring Boot", count: 10 },
      { topic: "Databases", count: 7 },
      { topic: "Concurrency", count: 5 },
    ],
  },
  {
    id: "a-003",
    name: "React Assessment",
    candidateName: "Divya Krishnan",
    jobRole: "Full Stack Developer",
    difficulty: "Medium",
    questionCount: 20,
    durationMinutes: 40,
    passingScore: 70,
    score: null,
    status: "In Progress",
    createdDate: "2026-07-22",
    submissionTime: null,
    questionSummary: [
      { topic: "Component Design", count: 6 },
      { topic: "State Management", count: 6 },
      { topic: "Performance", count: 4 },
      { topic: "Testing", count: 4 },
    ],
  },
  {
    id: "a-004",
    name: "Python Assessment",
    candidateName: "Priya Nair",
    jobRole: "Data Scientist",
    difficulty: "Medium",
    questionCount: 22,
    durationMinutes: 45,
    passingScore: 65,
    score: null,
    status: "Pending",
    createdDate: "2026-07-28",
    submissionTime: null,
    questionSummary: [
      { topic: "Python Core", count: 8 },
      { topic: "Pandas & NumPy", count: 6 },
      { topic: "Statistics", count: 5 },
      { topic: "SQL", count: 3 },
    ],
  },
  {
    id: "a-005",
    name: "Java Assessment",
    candidateName: "Arjun Sharma",
    jobRole: "QA Engineer",
    difficulty: "Easy",
    questionCount: 15,
    durationMinutes: 30,
    passingScore: 60,
    score: 48,
    status: "Completed",
    createdDate: "2026-06-05",
    submissionTime: "29 min",
    questionSummary: [
      { topic: "Java Basics", count: 6 },
      { topic: "OOP Concepts", count: 5 },
      { topic: "Collections", count: 4 },
    ],
  },
  {
    id: "a-006",
    name: "AI Engineer Test",
    candidateName: "Vikram Singh",
    jobRole: "ML Engineer",
    difficulty: "Hard",
    questionCount: 28,
    durationMinutes: 60,
    passingScore: 75,
    score: null,
    status: "Expired",
    createdDate: "2026-05-18",
    submissionTime: null,
    questionSummary: [
      { topic: "Deep Learning", count: 10 },
      { topic: "Model Deployment", count: 8 },
      { topic: "MLOps", count: 6 },
      { topic: "Math Foundations", count: 4 },
    ],
  },
  {
    id: "a-007",
    name: "ML Assessment",
    candidateName: "Vikram Singh",
    jobRole: "ML Engineer",
    difficulty: "Medium",
    questionCount: 20,
    durationMinutes: 40,
    passingScore: 70,
    score: 88,
    status: "Completed",
    createdDate: "2026-07-01",
    submissionTime: "35 min",
    questionSummary: [
      { topic: "Supervised Learning", count: 7 },
      { topic: "Feature Engineering", count: 6 },
      { topic: "Evaluation Metrics", count: 7 },
    ],
  },
  {
    id: "a-008",
    name: "UI/UX Assessment",
    candidateName: "Sneha Iyer",
    jobRole: "Product Designer",
    difficulty: "Easy",
    questionCount: 18,
    durationMinutes: 35,
    passingScore: 60,
    score: null,
    status: "Pending",
    createdDate: "2026-07-30",
    submissionTime: null,
    questionSummary: [
      { topic: "Design Principles", count: 6 },
      { topic: "Prototyping Tools", count: 5 },
      { topic: "User Research", count: 4 },
      { topic: "Accessibility", count: 3 },
    ],
  },
  {
    id: "a-009",
    name: "DevOps Fundamentals Test",
    candidateName: "Karan Verma",
    jobRole: "DevOps Engineer",
    difficulty: "Medium",
    questionCount: 24,
    durationMinutes: 50,
    passingScore: 70,
    score: 95,
    status: "Completed",
    createdDate: "2026-06-20",
    submissionTime: "41 min",
    questionSummary: [
      { topic: "CI/CD Pipelines", count: 8 },
      { topic: "Kubernetes", count: 8 },
      { topic: "Infrastructure as Code", count: 5 },
      { topic: "Monitoring", count: 3 },
    ],
  },
  {
    id: "a-010",
    name: "Cloud Architecture Test",
    candidateName: "Aditya Joshi",
    jobRole: "Cloud Architect",
    difficulty: "Hard",
    questionCount: 26,
    durationMinutes: 55,
    passingScore: 75,
    score: null,
    status: "In Progress",
    createdDate: "2026-07-26",
    submissionTime: null,
    questionSummary: [
      { topic: "Cloud Design Patterns", count: 9 },
      { topic: "Security", count: 7 },
      { topic: "Cost Optimization", count: 5 },
      { topic: "Multi-Cloud Strategy", count: 5 },
    ],
  },
];

export const jobRoles = Array.from(new Set(assessments.map((a) => a.jobRole)));
export const candidateNames = Array.from(new Set(assessments.map((a) => a.candidateName)));