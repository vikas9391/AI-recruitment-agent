import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JobStatusBadge } from "./JobStatusBadge";
import { Button } from "../ui/Button";
import type { Job } from "../../constants/jobsMockData";

interface JobTableProps {
  jobs: Job[];
  onView: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobTable({ jobs, onView, onDelete }: JobTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="relative overflow-x-auto rounded-2xl">
      <table className="w-full text-sm min-w-[900px]">
        <thead className="sticky top-0 bg-white/80 backdrop-blur-glass z-10">
          <tr className="text-left text-xs text-ink-secondary border-b border-glass-border">
            <th className="py-3 px-4 font-medium">Job Title</th>
            <th className="py-3 px-4 font-medium">Department</th>
            <th className="py-3 px-4 font-medium">Location</th>
            <th className="py-3 px-4 font-medium">Type</th>
            <th className="py-3 px-4 font-medium">Experience</th>
            <th className="py-3 px-4 font-medium">Applications</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Created</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-glass-border/60 last:border-0 hover:bg-white/40 transition-colors"
            >
              <td className="py-3.5 px-4 text-ink font-medium">{job.title}</td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.department}</td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.location}</td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.employmentType}</td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.experience}</td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.applications}</td>
              <td className="py-3.5 px-4"><JobStatusBadge status={job.status} /></td>
              <td className="py-3.5 px-4 text-ink-secondary">{job.createdDate}</td>
              <td className="py-3.5 px-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(job)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="View"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    // TODO: Backend Integration — wire up edit flow
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-ink/5 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmId(job.id)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {confirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-4"
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">Delete this job?</h3>
                <button onClick={() => setConfirmId(null)}>
                  <X size={16} className="text-ink-secondary" />
                </button>
              </div>
              <p className="text-sm text-ink-secondary mt-2">
                This action can't be undone. This only removes it from the current view (frontend-only, no backend call).
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <Button variant="ghost" className="!px-4 !py-2 text-sm" onClick={() => setConfirmId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="!px-4 !py-2 text-sm !bg-danger hover:!bg-danger/90"
                  onClick={() => {
                    onDelete(confirmId);
                    setConfirmId(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}