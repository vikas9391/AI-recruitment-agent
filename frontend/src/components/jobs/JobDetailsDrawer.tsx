import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users, IndianRupee, Calendar, Briefcase, Mail, Loader2 } from "lucide-react";
import { JobStatusBadge } from "./JobStatusBadge";
import type { Job } from "../../types/job";
import { pullResumesForJob, type ResumeIngestionSummary } from "../../lib/mailboxApi";

interface JobDetailsDrawerProps {
  job: Job | null;
  onClose: () => void;
  // Called with the fresh summary after a manual sync completes, so the
  // parent (Jobs page) can refresh its application counts if it wants to.
  onResumesSynced?: (jobId: string, summary: ResumeIngestionSummary) => void;
}

const MOCK_ACTIVITY = [
  { label: "Job posted", time: "5 days ago" },
  { label: "First application received", time: "4 days ago" },
  { label: "Shortlisting started", time: "2 days ago" },
];

export function JobDetailsDrawer({ job, onClose, onResumesSynced }: JobDetailsDrawerProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<ResumeIngestionSummary | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function handleSyncGmail() {
    if (!job) return;
    setSyncing(true);
    setSyncError(null);
    setSyncSummary(null);
    try {
      const summary = await pullResumesForJob(job.id);
      setSyncSummary(summary);
      onResumesSynced?.(job.id, summary);
    } catch {
      setSyncError("Couldn't sync Gmail right now. Try again in a moment.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <AnimatePresence>
      {job && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md glass-card !rounded-none p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink">{job.title}</h2>
              <button onClick={onClose}>
                <X size={18} className="text-ink-secondary" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <JobStatusBadge status={job.status} />
              <span className="text-xs text-ink-secondary">{job.department}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-ink-secondary">
                <MapPin size={14} /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-ink-secondary">
                <Briefcase size={14} /> {job.employmentType} · {job.experience}
              </div>
              <div className="flex items-center gap-2 text-ink-secondary">
                <IndianRupee size={14} /> {job.salaryRange}
              </div>
              <div className="flex items-center gap-2 text-ink-secondary">
                <Users size={14} /> {job.applications} applications · {job.vacancies} vacancies
              </div>
              <div className="flex items-center gap-2 text-ink-secondary">
                <Calendar size={14} /> Deadline: {job.deadline}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSyncGmail}
                disabled={syncing}
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-ink/5 text-ink hover:bg-ink/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {syncing ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                {syncing ? "Syncing Gmail…" : "Sync Gmail for resumes"}
              </button>

              {syncSummary && (
                <p className="mt-2 text-xs text-ink-secondary">
                  {syncSummary.attempted
                    ? `Found ${syncSummary.found} matching email(s) — ${syncSummary.created} added, ${syncSummary.skipped} skipped, ${syncSummary.failed} failed.`
                    : syncSummary.errors[0] ?? "No connected mailbox to sync from."}
                </p>
              )}
              {syncError && <p className="mt-2 text-xs text-red-500">{syncError}</p>}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Description</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{job.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-ink/5 text-ink-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Hiring Manager</h3>
              <p className="text-sm text-ink-secondary">
                {/* TODO: Backend Integration — pull assigned hiring manager */}
                Not assigned yet
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink mb-3">Recent Activity</h3>
              <ul className="space-y-3">
                {MOCK_ACTIVITY.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent-blue mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-ink">{item.label}</p>
                      <p className="text-xs text-ink-secondary">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}