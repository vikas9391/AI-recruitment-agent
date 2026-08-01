import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, UserRound } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { candidates, type CandidateStatus } from "../../constants/candidatesMockData";
import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  Applied: "bg-ink/5 text-ink-secondary border-ink/10",
  Shortlisted: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  "Interview Scheduled": "bg-warning/10 text-warning border-warning/30",
  Hired: "bg-success/10 text-success border-success/30",
  Rejected: "bg-danger/10 text-danger border-danger/30",
};

function StatusBadge({ status }: { status: CandidateStatus }) {
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

function MatchScore({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-success" : score >= 75 ? "text-accent-blue" : "text-warning";
  return <span className={cn("font-semibold", color)}>{score}%</span>;
}

const EXPERIENCE_FILTERS = [
  { label: "All experience", value: "all" },
  { label: "0–2 years", value: "0-2" },
  { label: "3–5 years", value: "3-5" },
  { label: "6+ years", value: "6+" },
];

const MATCH_FILTERS = [
  { label: "All match scores", value: "all" },
  { label: "90%+", value: "90" },
  { label: "75–89%", value: "75" },
  { label: "Below 75%", value: "below75" },
];

const STATUS_FILTERS: (CandidateStatus | "all")[] = [
  "all",
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Hired",
  "Rejected",
];

export default function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [matchFilter, setMatchFilter] = useState("all");

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.appliedJob.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;

      const matchesExperience =
        experienceFilter === "all" ||
        (experienceFilter === "0-2" && c.experienceYears <= 2) ||
        (experienceFilter === "3-5" && c.experienceYears >= 3 && c.experienceYears <= 5) ||
        (experienceFilter === "6+" && c.experienceYears >= 6);

      const matchesScore =
        matchFilter === "all" ||
        (matchFilter === "90" && c.matchScore >= 90) ||
        (matchFilter === "75" && c.matchScore >= 75 && c.matchScore < 90) ||
        (matchFilter === "below75" && c.matchScore < 75);

      return matchesSearch && matchesStatus && matchesExperience && matchesScore;
    });
  }, [search, statusFilter, experienceFilter, matchFilter]);

  return (
    <DashboardLayout pageTitle="Candidates">
      <div className="space-y-4">
        {/* Search + filters */}
        <div className="glass-card p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or job..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {EXPERIENCE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {MATCH_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Profile</th>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Applied Job</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Skills</th>
                  <th className="px-4 py-3 font-medium">AI Match</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="h-9 w-9 rounded-full bg-ink/90 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{c.appliedJob}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{c.experienceLabel}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {c.skills.slice(0, 2).map((s) => (
                          <span key={s} className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink-secondary whitespace-nowrap">
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 2 && (
                          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink-secondary">
                            +{c.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <MatchScore score={c.matchScore} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/resume-viewer?id=${c.id}`)}
                          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-ink hover:bg-white transition-colors"
                        >
                          <FileText size={13} />
                          Resume
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/resume-viewer?id=${c.id}`)}
                          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-ink hover:bg-white transition-colors"
                        >
                          <UserRound size={13} />
                          Profile
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-ink-secondary">
                      No candidates match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}