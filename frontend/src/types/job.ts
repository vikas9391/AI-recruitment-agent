// UI-facing Job shape. Components render this — NOT the raw backend
// payload — so the API layer (lib/jobsApi.ts) is responsible for mapping
// backend snake_case fields onto this shape.
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary";
  experienceLevel: "Entry" | "Mid" | "Senior";
  experience: string;
  applications: number;
  status: "Open" | "Closed" | "Draft" | "Paused";
  createdDate: string;
  salaryRange: string;
  vacancies: number;
  skills: string[];
  description: string;
  deadline: string;
}

// Static form options — not "mock data" (nothing here fakes a record),
// just the choices shown in dropdowns. Fine to keep hardcoded, or swap
// `departments`/`locations` for an API-driven list later if you want
// per-company customization.
export const departments = ["Engineering", "AI/ML", "Design", "Product", "Sales", "HR"];
export const locations = ["Hyderabad, IN", "Bengaluru, IN", "Pune, IN", "Remote"];
export const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
export const experienceLevels = ["Entry", "Mid", "Senior"];
export const jobStatuses = ["Open", "Closed", "Draft", "Paused"];
