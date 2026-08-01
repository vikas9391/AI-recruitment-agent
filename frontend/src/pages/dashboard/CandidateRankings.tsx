import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
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

function ProgressBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-success" : value >= 75 ? "bg-accent-blue" : "bg-warning";
  return (
    <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}

const RANK_ACCENT = ["border-warning/50 bg-warning/5", "border-gray-300 bg-white/60", "border-orange-300 bg-orange-50/60"];

export default function CandidateRankings() {
  const navigate = useNavigate();
  const ranked = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
  const topThree = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <DashboardLayout pageTitle="Candidate Rankings">
      <div className="space-y-6">
        {/* Top 3 highlighted */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => navigate(`/dashboard/resume-viewer?id=${c.id}`)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className={cn("glass-card p-5 text-left border-2", RANK_ACCENT[i])}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
                  <Trophy size={14} className={i === 0 ? "text-warning" : "text-ink-secondary"} />
                  Rank #{i + 1}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    STATUS_STYLES[c.status]
                  )}
                >
                  {c.status}
                </span>
              </div>

              <div className="h-10 w-10 rounded-full bg-ink text-white flex items-center justify-center text-sm font-semibold mb-3">
                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>

              <p className="font-semibold text-ink">{c.name}</p>
              <p className="text-xs text-ink-secondary mb-3">{c.appliedJob}</p>

              <div className="flex items-center justify-between text-xs text-ink-secondary mb-1.5">
                <span>AI Match</span>
                <span className="font-semibold text-ink">{c.matchScore}%</span>
              </div>
              <ProgressBar value={c.matchScore} />
            </motion.button>
          ))}
        </div>

        {/* Remaining candidates */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Applied Job</th>
                  <th className="px-4 py-3 font-medium w-[180px]">Match %</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onClick={() => navigate(`/dashboard/resume-viewer?id=${c.id}`)}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-ink-secondary">#{i + 4}</td>
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{c.appliedJob}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 shrink-0">
                          <ProgressBar value={c.matchScore} />
                        </div>
                        <span className="text-xs font-semibold text-ink">{c.matchScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{c.experienceLabel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                          STATUS_STYLES[c.status]
                        )}
                      >
                        {c.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}