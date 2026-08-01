import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
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
import PlatformCompanies from "../pages/platform/Companies";
import MailboxSettings from "../pages/dashboard/MailboxSettings";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { SuperAdminRoute } from "../components/auth/SuperAdminRoute";

// Dashboard/candidate-portal pages require an authenticated session;
// everything else (landing, auth pages) stays public.
function guarded(element: React.ReactElement) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/dashboard", element: guarded(<Dashboard />) },
  { path: "/dashboard/jobs", element: guarded(<Jobs />) },
  { path: "/dashboard/candidates", element: guarded(<Candidates />) },
  { path: "/dashboard/resume-viewer", element: guarded(<ResumeViewer />) },
  { path: "/dashboard/rankings", element: guarded(<CandidateRankings />) },
  { path: "/dashboard/assessments", element: guarded(<Assessments />) },
  { path: "/dashboard/analytics", element: guarded(<Analytics />) },
  { path: "/dashboard/email-approval", element: guarded(<EmailApproval />) },
  { path: "/dashboard/settings/mailbox", element: guarded(<MailboxSettings />) },
  { path: "/candidate/assessment", element: <CandidateAssessment /> },
  { path: "/candidate/coding", element: <CandidateCoding /> },
  { path: "/candidate/submission", element: <CandidateSubmission /> },
  { path: "/dashboard/admin/users", element: guarded(<UserManagement />) },
  { path: "/dashboard/admin/roles", element: guarded(<RolesPermissions />) },
  { path: "/dashboard/admin/audit-logs", element: guarded(<AuditLogs />) },
  { path: "/dashboard/admin/settings", element: guarded(<SystemSettings />) },
  {
    path: "/platform/companies",
    element: (
      <ProtectedRoute>
        <SuperAdminRoute>
          <PlatformCompanies />
        </SuperAdminRoute>
      </ProtectedRoute>
    ),
  },
  // TODO: Backend Integration — /dashboard/settings (user-level settings,
  // distinct from Admin Panel's System Settings) still pending for a future module.
]);