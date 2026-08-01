export type UserRole = "Super Admin" | "HR Admin" | "HR Recruiter" | "HR Manager";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
}

export const adminUsers: AdminUser[] = [
  { id: "usr-001", name: "Priya Sharma", email: "priya.sharma@recruitai.com", role: "Super Admin", department: "Platform", status: "Active", lastLogin: "2026-07-31 09:12 AM" },
  { id: "usr-002", name: "Arjun Mehta", email: "arjun.mehta@recruitai.com", role: "HR Admin", department: "Human Resources", status: "Active", lastLogin: "2026-07-31 08:45 AM" },
  { id: "usr-003", name: "Kavya Reddy", email: "kavya.reddy@recruitai.com", role: "HR Recruiter", department: "Talent Acquisition", status: "Active", lastLogin: "2026-07-30 06:30 PM" },
  { id: "usr-004", name: "Rohan Iyer", email: "rohan.iyer@recruitai.com", role: "HR Manager", department: "Human Resources", status: "Inactive", lastLogin: "2026-07-22 11:05 AM" },
  { id: "usr-005", name: "Sneha Kapoor", email: "sneha.kapoor@recruitai.com", role: "HR Recruiter", department: "Talent Acquisition", status: "Active", lastLogin: "2026-07-31 07:58 AM" },
  { id: "usr-006", name: "Vikram Nair", email: "vikram.nair@recruitai.com", role: "HR Admin", department: "Engineering", status: "Suspended", lastLogin: "2026-07-10 02:20 PM" },
  { id: "usr-007", name: "Ananya Das", email: "ananya.das@recruitai.com", role: "HR Manager", department: "Human Resources", status: "Active", lastLogin: "2026-07-30 04:41 PM" },
  { id: "usr-008", name: "Karan Malhotra", email: "karan.malhotra@recruitai.com", role: "HR Recruiter", department: "Talent Acquisition", status: "Active", lastLogin: "2026-07-31 09:50 AM" },
  { id: "usr-009", name: "Isha Verma", email: "isha.verma@recruitai.com", role: "Super Admin", department: "Platform", status: "Active", lastLogin: "2026-07-31 10:02 AM" },
  { id: "usr-010", name: "Aditya Singh", email: "aditya.singh@recruitai.com", role: "HR Admin", department: "Finance", status: "Inactive", lastLogin: "2026-06-28 01:15 PM" },
];

export interface AdminRole {
  id: string;
  name: UserRole;
  description: string;
  permissions: string[];
}

export const adminRoles: AdminRole[] = [
  { id: "role-super-admin", name: "Super Admin", description: "Full access to every module, including user management and system configuration.", permissions: ["Manage Jobs", "Manage Candidates", "View Analytics", "Manage Assessments", "Approve Emails", "Manage Users"] },
  { id: "role-hr-admin", name: "HR Admin", description: "Oversees HR operations across jobs, candidates, and assessments with reporting access.", permissions: ["Manage Jobs", "Manage Candidates", "View Analytics", "Manage Assessments", "Approve Emails"] },
  { id: "role-hr-recruiter", name: "HR Recruiter", description: "Handles day-to-day candidate sourcing, screening, and job postings.", permissions: ["Manage Jobs", "Manage Candidates"] },
  { id: "role-hr-manager", name: "HR Manager", description: "Reviews team performance and hiring analytics, and approves outgoing communication.", permissions: ["View Analytics", "Manage Assessments", "Approve Emails"] },
];

export type AuditStatus = "Success" | "Failed";

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  date: string;
  time: string;
  status: AuditStatus;
}

export const auditLogs: AuditLogEntry[] = [
  { id: "log-001", user: "Priya Sharma", action: "Created Job", module: "Jobs", date: "2026-07-31", time: "09:14 AM", status: "Success" },
  { id: "log-002", user: "Kavya Reddy", action: "Updated Candidate", module: "Candidates", date: "2026-07-31", time: "08:52 AM", status: "Success" },
  { id: "log-003", user: "Rohan Iyer", action: "Approved Email", module: "Email Approval", date: "2026-07-30", time: "06:40 PM", status: "Success" },
  { id: "log-004", user: "Vikram Nair", action: "Deleted Assessment", module: "Assessments", date: "2026-07-30", time: "03:10 PM", status: "Failed" },
  { id: "log-005", user: "Isha Verma", action: "Changed Role", module: "Admin Panel", date: "2026-07-30", time: "11:25 AM", status: "Success" },
  { id: "log-006", user: "Sneha Kapoor", action: "Login", module: "Authentication", date: "2026-07-31", time: "07:58 AM", status: "Success" },
  { id: "log-007", user: "Arjun Mehta", action: "Logout", module: "Authentication", date: "2026-07-30", time: "07:02 PM", status: "Success" },
  { id: "log-008", user: "Karan Malhotra", action: "Created Job", module: "Jobs", date: "2026-07-29", time: "02:35 PM", status: "Success" },
  { id: "log-009", user: "Ananya Das", action: "Updated Candidate", module: "Candidates", date: "2026-07-29", time: "01:12 PM", status: "Failed" },
  { id: "log-010", user: "Aditya Singh", action: "Login", module: "Authentication", date: "2026-06-28", time: "01:15 PM", status: "Success" },
];

export interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  theme: "Light" | "Dark" | "System";
  notifications: {
    emailNotifications: boolean;
    assessmentAlerts: boolean;
    interviewAlerts: boolean;
  };
}

export const companySettings: CompanySettings = {
  companyName: "Recruit AI",
  email: "admin@recruitai.com",
  phone: "+91 98765 43210",
  address: "4th Floor, Salarpuria Sattva, Hitech City, Hyderabad, Telangana 500081",
  theme: "System",
  notifications: {
    emailNotifications: true,
    assessmentAlerts: true,
    interviewAlerts: false,
  },
};