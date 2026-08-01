import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { fetchRecentApplications } from "../../lib/dashboardApi";
import { formatRelativeTime } from "../../lib/utils";
import type { RecentApplicationItem } from "../../types/dashboard";

// The backend only tells us the current status of an application, not a
// typed "activity" feed — there's no event log to read "Interview
// Scheduled" or "Offer Approved" off of. This derives a reasonable icon
// and sentence from each application's current status instead of
// inventing an event type the backend doesn't track.
const STATUS_ICON: Record<string, LucideIcon> = {
  Applied: Icons.FileText,
  Processing: Icons.Loader,
  "Under Review": Icons.Search,
  Shortlisted: Icons.Star,
  Rejected: Icons.XCircle,
  Failed: Icons.AlertTriangle,
  Hired: Icons.UserCheck,
  Withdrawn: Icons.MinusCircle,
};

function describe(item: RecentApplicationItem): string {
  switch (item.status) {
    case "Shortlisted":
      return `${item.candidateName} was shortlisted for ${item.jobTitle}`;
    case "Hired":
      return `${item.candidateName} was hired for ${item.jobTitle}`;
    case "Rejected":
      return `${item.candidateName} was rejected for ${item.jobTitle}`;
    case "Under Review":
      return `${item.candidateName}'s application for ${item.jobTitle} is under review`;
    default:
      return `${item.candidateName} applied for ${item.jobTitle}`;
  }
}

export function ActivityCard() {
  const [items, setItems] = useState<RecentApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRecentApplications(8)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlassCard hover={false}>
      <h3 className="text-sm font-semibold text-ink mb-4">Recent Activity</h3>
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-ink/5 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink-secondary">No recent activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => {
            const Icon = STATUS_ICON[item.status] ?? Icons.Circle;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="h-8 w-8 shrink-0 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                  <Icon size={14} />
                </span>
                <div>
                  <p className="text-sm text-ink leading-snug">{describe(item)}</p>
                  <p className="text-xs text-ink-secondary mt-0.5">{formatRelativeTime(item.appliedAt)}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
