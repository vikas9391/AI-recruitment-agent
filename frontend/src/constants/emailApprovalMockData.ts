export type EmailType =
  | "Interview Invitation"
  | "Assessment Invitation"
  | "Rejection Email"
  | "Offer Letter";

export type EmailApprovalStatus = "Pending Approval" | "Approved" | "Rejected";

export interface EmailApprovalItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  job: string;
  emailType: EmailType;
  generatedDate: string;
  status: EmailApprovalStatus;
  subject: string;
  body: string;
}

export const emailApprovals: EmailApprovalItem[] = [
  {
    id: "e-001",
    candidateName: "Ananya Rao",
    candidateEmail: "ananya.rao@example.com",
    job: "Frontend Developer",
    emailType: "Interview Invitation",
    generatedDate: "2026-07-28",
    status: "Pending Approval",
    subject: "Interview Invitation — Frontend Developer at RecruitAI",
    body: "Hi Ananya,\n\nWe were impressed by your application for the Frontend Developer role. We'd like to invite you to a technical interview with our engineering team.\n\nPlease let us know your availability over the next week, and we'll confirm a time slot.\n\nLooking forward to speaking with you.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-002",
    candidateName: "Priya Nair",
    candidateEmail: "priya.nair@example.com",
    job: "Data Scientist",
    emailType: "Assessment Invitation",
    generatedDate: "2026-07-27",
    status: "Pending Approval",
    subject: "Complete Your Assessment — Data Scientist Role",
    body: "Hi Priya,\n\nThanks for applying to the Data Scientist position. As the next step, please complete a short online assessment covering Python, statistics, and SQL.\n\nYou'll have 45 minutes once you begin. The link will remain active for 5 days.\n\nGood luck!\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-003",
    candidateName: "Arjun Sharma",
    candidateEmail: "arjun.sharma@example.com",
    job: "QA Engineer",
    emailType: "Rejection Email",
    generatedDate: "2026-07-26",
    status: "Approved",
    subject: "Update on Your Application — QA Engineer",
    body: "Hi Arjun,\n\nThank you for taking the time to apply and complete the assessment for the QA Engineer role. After careful review, we've decided to move forward with other candidates whose experience more closely matches our current requirements.\n\nWe appreciate your interest and encourage you to apply for future openings that fit your background.\n\nWishing you the best in your search.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-004",
    candidateName: "Divya Krishnan",
    candidateEmail: "divya.krishnan@example.com",
    job: "Full Stack Developer",
    emailType: "Offer Letter",
    generatedDate: "2026-07-20",
    status: "Approved",
    subject: "Offer of Employment — Full Stack Developer",
    body: "Hi Divya,\n\nCongratulations! We're thrilled to offer you the Full Stack Developer position at RecruitAI.\n\nAttached you'll find details on compensation, start date, and benefits. Please review and let us know if you have any questions.\n\nWe're excited to have you join the team.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-005",
    candidateName: "Karan Verma",
    candidateEmail: "karan.verma@example.com",
    job: "DevOps Engineer",
    emailType: "Interview Invitation",
    generatedDate: "2026-07-25",
    status: "Pending Approval",
    subject: "Interview Invitation — DevOps Engineer at RecruitAI",
    body: "Hi Karan,\n\nYour background in Kubernetes and infrastructure automation stood out to our team. We'd like to schedule a technical interview to learn more about your experience.\n\nPlease share a few time slots that work for you this week.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-006",
    candidateName: "Sneha Iyer",
    candidateEmail: "sneha.iyer@example.com",
    job: "Product Designer",
    emailType: "Assessment Invitation",
    generatedDate: "2026-07-24",
    status: "Rejected",
    subject: "Complete Your Assessment — Product Designer Role",
    body: "Hi Sneha,\n\nThanks for applying to the Product Designer role. As the next step, please complete a short design assessment covering prototyping and accessibility fundamentals.\n\nThe assessment takes about 35 minutes and the link stays active for 5 days.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-007",
    candidateName: "Vikram Singh",
    candidateEmail: "vikram.singh@example.com",
    job: "ML Engineer",
    emailType: "Offer Letter",
    generatedDate: "2026-07-15",
    status: "Pending Approval",
    subject: "Offer of Employment — ML Engineer",
    body: "Hi Vikram,\n\nCongratulations! Following your strong performance across interviews and assessments, we're delighted to offer you the ML Engineer position at RecruitAI.\n\nFull offer details including compensation and start date are attached. We look forward to your response.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-008",
    candidateName: "Neha Kapoor",
    candidateEmail: "neha.kapoor@example.com",
    job: "Mobile Developer",
    emailType: "Assessment Invitation",
    generatedDate: "2026-07-30",
    status: "Pending Approval",
    subject: "Complete Your Assessment — Mobile Developer Role",
    body: "Hi Neha,\n\nThanks for applying to the Mobile Developer role. Please complete a short assessment covering React Native and mobile architecture fundamentals.\n\nYou'll have 40 minutes once you begin, and the link remains active for 5 days.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-009",
    candidateName: "Aditya Joshi",
    candidateEmail: "aditya.joshi@example.com",
    job: "Cloud Architect",
    emailType: "Interview Invitation",
    generatedDate: "2026-07-29",
    status: "Approved",
    subject: "Interview Invitation — Cloud Architect at RecruitAI",
    body: "Hi Aditya,\n\nYour experience leading large-scale cloud migrations really stood out. We'd like to invite you for a final round interview with our architecture team.\n\nPlease let us know your availability over the next few days.\n\nBest regards,\nRecruitAI Hiring Team",
  },
  {
    id: "e-010",
    candidateName: "Rohan Mehta",
    candidateEmail: "rohan.mehta@example.com",
    job: "Backend Developer",
    emailType: "Offer Letter",
    generatedDate: "2026-07-18",
    status: "Pending Approval",
    subject: "Offer of Employment — Backend Developer",
    body: "Hi Rohan,\n\nCongratulations! We're excited to offer you the Backend Developer position at RecruitAI, based on your strong performance throughout the interview process.\n\nOffer details including compensation and start date are attached. Let us know if you have any questions.\n\nBest regards,\nRecruitAI Hiring Team",
  },
];