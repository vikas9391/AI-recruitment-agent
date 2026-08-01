export type CandidateStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Hired"
  | "Rejected";

export interface Project {
  name: string;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedJob: string;
  experienceYears: number;
  experienceLabel: string;
  skills: string[];
  education: string;
  projects: Project[];
  certifications: string[];
  resumeUrl: string;
  matchScore: number;
  status: CandidateStatus;
  aiSummary: string;
}

export const candidates: Candidate[] = [
  {
    id: "c-001",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98765 43210",
    appliedJob: "Frontend Developer",
    experienceYears: 4,
    experienceLabel: "4 years",
    skills: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Vite"],
    education: "B.Tech in Computer Science, VIT Vellore",
    projects: [
      { name: "E-commerce Dashboard", description: "Built an analytics dashboard for a D2C brand using React and Recharts." },
      { name: "Design System", description: "Led creation of a shared component library used across 5 internal apps." },
    ],
    certifications: ["Meta Front-End Developer Certificate"],
    resumeUrl: "/mock-resumes/ananya-rao.pdf",
    matchScore: 94,
    status: "Interview Scheduled",
    aiSummary:
      "Strong frontend fundamentals with proven design-system experience. Skills closely match job requirements; recommended for fast-track interview.",
  },
  {
    id: "c-002",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 91234 56780",
    appliedJob: "Backend Developer",
    experienceYears: 6,
    experienceLabel: "6 years",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Docker"],
    education: "M.Tech in Software Engineering, BITS Pilani",
    projects: [
      { name: "Payments Microservice", description: "Designed a high-throughput payments service handling 2M+ txns/day." },
      { name: "Event Streaming Pipeline", description: "Migrated batch jobs to a Kafka-based streaming architecture." },
    ],
    certifications: ["AWS Certified Solutions Architect – Associate"],
    resumeUrl: "/mock-resumes/rohan-mehta.pdf",
    matchScore: 88,
    status: "Shortlisted",
    aiSummary:
      "Deep backend and distributed systems experience. Solid fit for high-scale service ownership; salary expectations to be confirmed.",
  },
  {
    id: "c-003",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 99887 66554",
    appliedJob: "Data Scientist",
    experienceYears: 3,
    experienceLabel: "3 years",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL", "Tableau"],
    education: "M.Sc in Statistics, Delhi University",
    projects: [
      { name: "Churn Prediction Model", description: "Built a churn model improving retention campaign targeting by 22%." },
      { name: "Sales Forecasting", description: "Time-series forecasting pipeline used across 3 regional teams." },
    ],
    certifications: ["Google Data Analytics Certificate"],
    resumeUrl: "/mock-resumes/priya-nair.pdf",
    matchScore: 81,
    status: "Applied",
    aiSummary:
      "Good applied ML foundation with clear business impact framing. Slightly junior for senior-level scope; consider for mid-level track.",
  },
  {
    id: "c-004",
    name: "Karan Verma",
    email: "karan.verma@example.com",
    phone: "+91 90909 80808",
    appliedJob: "DevOps Engineer",
    experienceYears: 5,
    experienceLabel: "5 years",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Prometheus"],
    education: "B.E. in Information Technology, Pune University",
    projects: [
      { name: "Multi-Cluster K8s Rollout", description: "Rolled out a multi-region Kubernetes setup with zero-downtime deploys." },
      { name: "Observability Overhaul", description: "Implemented Prometheus + Grafana stack cutting MTTR by 40%." },
    ],
    certifications: ["Certified Kubernetes Administrator (CKA)"],
    resumeUrl: "/mock-resumes/karan-verma.pdf",
    matchScore: 91,
    status: "Interview Scheduled",
    aiSummary:
      "Excellent infra automation track record with quantifiable reliability improvements. Strong candidate for platform team.",
  },
  {
    id: "c-005",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 98123 45670",
    appliedJob: "Product Designer",
    experienceYears: 2,
    experienceLabel: "2 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    education: "B.Des in Interaction Design, NID Ahmedabad",
    projects: [
      { name: "Onboarding Redesign", description: "Redesigned onboarding flow, lifting activation rate by 15%." },
      { name: "Accessibility Audit", description: "Led an app-wide WCAG 2.1 AA compliance audit and fix rollout." },
    ],
    certifications: [],
    resumeUrl: "/mock-resumes/sneha-iyer.pdf",
    matchScore: 76,
    status: "Applied",
    aiSummary:
      "Promising design fundamentals with early accessibility focus. Portfolio depth is moderate for a senior req; good for mid-level design role.",
  },
  {
    id: "c-006",
    name: "Arjun Sharma",
    email: "arjun.sharma@example.com",
    phone: "+91 97654 32109",
    appliedJob: "QA Engineer",
    experienceYears: 4,
    experienceLabel: "4 years",
    skills: ["Selenium", "Cypress", "Jest", "API Testing", "Postman"],
    education: "B.Tech in Computer Science, Anna University",
    projects: [
      { name: "E2E Test Suite", description: "Built a Cypress E2E suite covering 90% of critical checkout flows." },
      { name: "API Contract Testing", description: "Introduced contract testing reducing prod integration bugs by 30%." },
    ],
    certifications: ["ISTQB Foundation Level"],
    resumeUrl: "/mock-resumes/arjun-sharma.pdf",
    matchScore: 72,
    status: "Rejected",
    aiSummary:
      "Solid manual and automation testing background. Automation tooling experience narrower than role requires; not an immediate fit.",
  },
  {
    id: "c-007",
    name: "Divya Krishnan",
    email: "divya.krishnan@example.com",
    phone: "+91 96543 21098",
    appliedJob: "Full Stack Developer",
    experienceYears: 7,
    experienceLabel: "7 years",
    skills: ["React", "Node.js", "GraphQL", "MongoDB", "AWS"],
    education: "B.Tech in Computer Science, IIT Madras",
    projects: [
      { name: "Marketplace Platform", description: "Owned end-to-end build of a two-sided marketplace serving 500K users." },
      { name: "GraphQL Gateway", description: "Unified 6 REST services behind a single GraphQL gateway." },
    ],
    certifications: ["AWS Certified Developer – Associate"],
    resumeUrl: "/mock-resumes/divya-krishnan.pdf",
    matchScore: 97,
    status: "Hired",
    aiSummary:
      "Exceptional end-to-end ownership with proven scale experience. Top-tier match; offer already extended and accepted.",
  },
  {
    id: "c-008",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 95432 10987",
    appliedJob: "ML Engineer",
    experienceYears: 5,
    experienceLabel: "5 years",
    skills: ["PyTorch", "TensorFlow", "MLOps", "Python", "Docker"],
    education: "M.Tech in Artificial Intelligence, IISc Bangalore",
    projects: [
      { name: "Recommendation Engine", description: "Built a real-time recommender improving CTR by 18%." },
      { name: "MLOps Pipeline", description: "Automated model retraining and deployment via a CI/CD-driven MLOps stack." },
    ],
    certifications: ["TensorFlow Developer Certificate"],
    resumeUrl: "/mock-resumes/vikram-singh.pdf",
    matchScore: 89,
    status: "Shortlisted",
    aiSummary:
      "Strong production ML experience spanning modeling and deployment. Well-suited for a role requiring MLOps maturity.",
  },
  {
    id: "c-009",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 94321 09876",
    appliedJob: "Mobile Developer",
    experienceYears: 3,
    experienceLabel: "3 years",
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    education: "B.E. in Computer Engineering, Mumbai University",
    projects: [
      { name: "Fitness Tracking App", description: "Shipped a cross-platform fitness app with 100K+ downloads." },
      { name: "Offline-First Sync", description: "Built an offline-first data sync layer for a field-services app." },
    ],
    certifications: [],
    resumeUrl: "/mock-resumes/neha-kapoor.pdf",
    matchScore: 79,
    status: "Applied",
    aiSummary:
      "Good cross-platform mobile experience with real shipped products. Native module depth is limited; suitable for React Native-heavy roles.",
  },
  {
    id: "c-010",
    name: "Aditya Joshi",
    email: "aditya.joshi@example.com",
    phone: "+91 93210 98765",
    appliedJob: "Cloud Architect",
    experienceYears: 9,
    experienceLabel: "9 years",
    skills: ["AWS", "Azure", "Terraform", "System Design", "Security"],
    education: "B.Tech in Electronics & Communication, NIT Trichy",
    projects: [
      { name: "Cloud Migration Program", description: "Led migration of legacy on-prem systems to AWS for a 200-person org." },
      { name: "Zero-Trust Architecture", description: "Designed a zero-trust network model adopted org-wide." },
    ],
    certifications: ["AWS Certified Solutions Architect – Professional", "Azure Solutions Architect Expert"],
    resumeUrl: "/mock-resumes/aditya-joshi.pdf",
    matchScore: 92,
    status: "Interview Scheduled",
    aiSummary:
      "Highly experienced architect with dual-cloud expertise and security focus. Strong candidate for senior architecture ownership.",
  },
];