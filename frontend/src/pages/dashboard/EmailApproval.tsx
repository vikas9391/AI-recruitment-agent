import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Eye, Check, X as XIcon, Mail } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  emailApprovals as initialEmails,
  type EmailApprovalItem,
  type EmailType,
  type EmailApprovalStatus,
} from "../../constants/emailApprovalMockData";
import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<EmailApprovalStatus, string> = {
  "Pending Approval": "bg-warning/10 text-warning border-warning/30",
  Approved: "bg-success/10 text-success border-success/30",
  Rejected: "bg-danger/10 text-danger border-danger/30",
};

function StatusBadge({ status }: { status: EmailApprovalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

const TYPE_FILTERS: (EmailType | "all")[] = [
  "all",
  "Interview Invitation",
  "Assessment Invitation",
  "Rejection Email",
  "Offer Letter",
];

const STATUS_FILTERS: (EmailApprovalStatus | "all")[] = ["all", "Pending Approval", "Approved", "Rejected"];

export default function EmailApproval() {
  const [emails, setEmails] = useState<EmailApprovalItem[]>(initialEmails);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EmailType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<EmailApprovalStatus | "all">("all");
  const [previewing, setPreviewing] = useState<EmailApprovalItem | null>(null);

  const filtered = useMemo(() => {
    return emails.filter((e) => {
      const matchesSearch =
        !search ||
        e.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        e.job.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || e.emailType === typeFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [emails, search, typeFilter, statusFilter]);

  function updateStatus(id: string, status: EmailApprovalStatus) {
    // TODO: Backend Integration — persist approval/rejection decision via API.
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    setPreviewing((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  return (
    <DashboardLayout pageTitle="Email Approval">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Email Approval</h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Review AI-generated emails before sending.
          </p>
        </div>

        {/* Search + filters */}
        <div className="glass-card p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate, job, or subject..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EmailType | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All email types" : t}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EmailApprovalStatus | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Email Type</th>
                  <th className="px-4 py-3 font-medium">Generated Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{e.candidateName}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{e.job}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{e.emailType}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{e.generatedDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewing(e)}
                          title="Preview"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-ink hover:bg-white transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, "Approved")}
                          disabled={e.status === "Approved"}
                          title="Approve"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-success hover:bg-success/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, "Rejected")}
                          disabled={e.status === "Rejected"}
                          title="Reject"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-danger hover:bg-danger/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-secondary">
                      No emails match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>

      {/* Preview drawer */}
      <AnimatePresence>
        {previewing && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewing(null)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-lg glass-card rounded-l-3xl rounded-r-none p-6 overflow-y-auto flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center">
                    <Mail size={16} className="text-ink" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-secondary">{previewing.emailType}</p>
                    <StatusBadge status={previewing.status} />
                  </div>
                </div>
                <button
                  onClick={() => setPreviewing(null)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-white/60"
                >
                  <XIcon size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-ink-secondary">Subject</p>
                  <p className="text-sm font-medium text-ink">{previewing.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Recipient</p>
                  <p className="text-sm text-ink">
                    {previewing.candidateName} &lt;{previewing.candidateEmail}&gt;
                  </p>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-white/70 border border-gray-100 p-4 mb-5 overflow-y-auto">
                <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{previewing.body}</p>
              </div>

              {/* TODO: Backend Integration — send approved email via API */}

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewing(null)}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-ink hover:bg-white/60 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => updateStatus(previewing.id, "Rejected")}
                  disabled={previewing.status === "Rejected"}
                  className="flex-1 rounded-full border border-danger/30 bg-danger/5 text-danger px-4 py-2.5 text-sm font-medium hover:bg-danger/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateStatus(previewing.id, "Approved")}
                  disabled={previewing.status === "Approved"}
                  className="flex-1 rounded-full bg-ink text-white px-4 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}