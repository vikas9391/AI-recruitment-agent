import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { Dashboard } from "../pages/dashboard/Dashboard";
import Jobs from "../pages/dashboard/Jobs";
import Candidates from "../pages/dashboard/Candidates";
import ResumeViewer from "../pages/dashboard/ResumeViewer";
import CandidateRankings from "../pages/dashboard/CandidateRankings";
import Assessments from "../pages/dashboard/Assessments";
import Analytics from "../pages/dashboard/Analytics";
import EmailApproval from "../pages/dashboard/EmailApproval";
import CandidateAssessment from "../pages/candidate-portal/Assessment";
import CandidateCoding from "../pages/candidate-portal/CodingEditor";
import CandidateSubmission from "../pages/candidate-portal/Submission";
import UserManagement from "../pages/dashboard/admin/UserManagement";
import RolesPermissions from "../pages/dashboard/admin/RolesPermissions";
import AuditLogs from "../pages/dashboard/admin/AuditLogs";
import SystemSettings from "../pages/dashboard/admin/SystemSettings";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/jobs", element: <Jobs /> },
  { path: "/dashboard/candidates", element: <Candidates /> },
  { path: "/dashboard/resume-viewer", element: <ResumeViewer /> },
  { path: "/dashboard/rankings", element: <CandidateRankings /> },
  { path: "/dashboard/assessments", element: <Assessments /> },
  { path: "/dashboard/analytics", element: <Analytics /> },
  { path: "/dashboard/email-approval", element: <EmailApproval /> },
  { path: "/candidate/assessment", element: <CandidateAssessment /> },
  { path: "/candidate/coding", element: <CandidateCoding /> },
  { path: "/candidate/submission", element: <CandidateSubmission /> },
  { path: "/dashboard/admin/users", element: <UserManagement /> },
  { path: "/dashboard/admin/roles", element: <RolesPermissions /> },
  { path: "/dashboard/admin/audit-logs", element: <AuditLogs /> },
  { path: "/dashboard/admin/settings", element: <SystemSettings /> },
  // TODO: Backend Integration — /dashboard/settings (user-level settings,
  // distinct from Admin Panel's System Settings) still pending for a future module.
]);