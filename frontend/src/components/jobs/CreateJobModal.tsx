import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  departments,
  locations,
  employmentTypes,
  experienceLevels,
} from "../../constants/jobsMockData";
import type { Job } from "../../constants/jobsMockData";

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
    experienceLevel: experienceLevels[0],
    experience: "",
    salaryRange: "",
    vacancies: "1",
    skills: "",
    deadline: "",
    description: "",
  });
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Job title and description are required.");
      return;
    }
    // TODO: Backend Integration — replace with API call to create job

    onCreate({
      id: `job-${Date.now()}`,
      title: form.title,
      department: form.department,
      location: form.location,
      employmentType: form.employmentType as Job["employmentType"],
      experienceLevel: form.experienceLevel as Job["experienceLevel"],
      experience: form.experience || "Not specified",
      applications: 0,
      status: "Draft",
      createdDate: new Date().toISOString().slice(0, 10),
      salaryRange: form.salaryRange || "Not disclosed",
      vacancies: Number(form.vacancies) || 1,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: form.description,
      deadline: form.deadline || "Not specified",
    });
    setError("");
    setForm({
      title: "",
      department: departments[0],
      location: locations[0],
      employmentType: employmentTypes[0],
      experienceLevel: experienceLevels[0],
      experience: "",
      salaryRange: "",
      vacancies: "1",
      skills: "",
      deadline: "",
      description: "",
    });
    onClose();
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
                <label className="text-xs text-ink-secondary mb-1 block">Experience Level</label>
                <select className={selectClass} value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)}>
                  {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Experience Required</label>
                <Input value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 2-4 yrs" />
              </div>

              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Salary Range</label>
                <Input value={form.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} placeholder="e.g. ₹8L - ₹14L" />
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
                  placeholder="Describe the role and responsibilities..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="!px-5 !py-2.5 text-sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" className="!px-5 !py-2.5 text-sm" onClick={handleSubmit}>
                Create Job
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}