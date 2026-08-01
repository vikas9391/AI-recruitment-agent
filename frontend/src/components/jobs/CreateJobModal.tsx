import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  departments,
  locations,
  employmentTypes,
} from "../../types/job";
import type { Job } from "../../types/job";
import { createJob } from "../../lib/jobsApi";
import { getApiErrorMessage } from "../../lib/apiClient";

interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (job: Job) => void;
}

const selectClass =
  "w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40 dark:border-gray-700 dark:bg-gray-900";

export function CreateJobModal({ open, onClose, onCreate }: CreateJobModalProps) {
  const [form, setForm] = useState({
    title: "",
    department: departments[0],
    location: locations[0],
    employmentType: employmentTypes[0],
    experience: "",
    educationRequired: "",
    requirements: "",
    responsibilities: "",
    salaryMin: "",
    salaryMax: "",
    remoteType: "ONSITE" as "ONSITE" | "REMOTE" | "HYBRID",
    vacancies: "1",
    skills: "",
    deadline: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () =>
    setForm({
      title: "",
      department: departments[0],
      location: locations[0],
      employmentType: employmentTypes[0],
      experience: "",
      educationRequired: "",
      requirements: "",
      responsibilities: "",
      salaryMin: "",
      salaryMax: "",
      remoteType: "ONSITE",
      vacancies: "1",
      skills: "",
      deadline: "",
      description: "",
    });

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.deadline) {
      setError("Job title, description, and deadline are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { job, resumeIngestion } = await createJob({
        title: form.title,
        department: form.department,
        location: form.location,
        employmentType: form.employmentType as Job["employmentType"],
        experience: form.experience || "Not specified",
        educationRequired: form.educationRequired,
        requirements: form.requirements,
        responsibilities: form.responsibilities,
        description: form.description,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        remoteType: form.remoteType,
        vacancies: Number(form.vacancies) || 1,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline,
        status: "Draft",
      });
      onCreate(job);
      resetForm();
      onClose();

      // Surface what the synchronous Gmail resume pull just did (or didn't do).
      if (!resumeIngestion || !resumeIngestion.attempted) {
        const reason = resumeIngestion?.errors?.[0];
        toast.info(
          reason
            ? `Job created. Resume pull skipped: ${reason}`
            : "Job created. Connect Gmail to auto-pull matching resumes."
        );
      } else if (resumeIngestion.created > 0) {
        toast.success(
          `Job created. Pulled ${resumeIngestion.created} resume${resumeIngestion.created === 1 ? "" : "s"} from Gmail.`
        );
      } else if (resumeIngestion.found > 0) {
        toast.info(
          `Job created. Found ${resumeIngestion.found} matching email(s), but none produced a new application (already applied or unparsable).`
        );
      } else {
        toast.info("Job created. No matching resume emails found yet.");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create job. Please check the fields and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink">Create Job</h2>
              <button onClick={onClose}>
                <X size={18} className="text-ink-secondary" />
              </button>
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded-xl px-4 py-2.5 mb-4">{error}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-ink-secondary mb-1 block">Job Title</label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Frontend Developer" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Department</label>
                <select className={selectClass} value={form.department} onChange={(e) => update("department", e.target.value)}>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Location</label>
                <select className={selectClass} value={form.location} onChange={(e) => update("location", e.target.value)}>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Employment Type</label>
                <select className={selectClass} value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)}>
                  {employmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Remote Type</label>
                <select className={selectClass} value={form.remoteType} onChange={(e) => update("remoteType", e.target.value)}>
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Experience Required</label>
                <Input value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 2-4 years" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Education Required</label>
                <Input value={form.educationRequired} onChange={(e) => update("educationRequired", e.target.value)} placeholder="e.g. B.Tech in CS" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Salary Min (₹)</label>
                <Input type="number" value={form.salaryMin} onChange={(e) => update("salaryMin", e.target.value)} placeholder="800000" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Salary Max (₹)</label>
                <Input type="number" value={form.salaryMax} onChange={(e) => update("salaryMax", e.target.value)} placeholder="1400000" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Number of Vacancies</label>
                <Input type="number" min={1} value={form.vacancies} onChange={(e) => update("vacancies", e.target.value)} />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Application Deadline</label>
                <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-ink-secondary mb-1 block">Required Skills (comma-separated)</label>
                <Input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="e.g. React, TypeScript, Tailwind" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-ink-secondary mb-1 block">Job Description</label>
                <textarea
                  className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40 dark:border-gray-700 dark:bg-gray-900 min-h-[100px]"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the role..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-ink-secondary mb-1 block">Requirements</label>
                <textarea
                  className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40 dark:border-gray-700 dark:bg-gray-900 min-h-[80px]"
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  placeholder="Must-have qualifications..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-ink-secondary mb-1 block">Responsibilities</label>
                <textarea
                  className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40 dark:border-gray-700 dark:bg-gray-900 min-h-[80px]"
                  value={form.responsibilities}
                  onChange={(e) => update("responsibilities", e.target.value)}
                  placeholder="Day-to-day responsibilities..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="!px-5 !py-2.5 text-sm" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" className="!px-5 !py-2.5 text-sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Job"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}