import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { recentActivity } from "../../constants/mockData";

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  job_created: Icons.Briefcase,
  shortlisted: Icons.Star,
  assessment: Icons.ClipboardCheck,
  interview: Icons.CalendarClock,
  offer: Icons.Send,
};

export function ActivityCard() {
  return (
    <GlassCard hover={false}>
      <h3 className="text-sm font-semibold text-ink mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {recentActivity.map((item, i) => {
          const Icon = ACTIVITY_ICON[item.type] ?? Icons.Circle;
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
                <p className="text-sm text-ink leading-snug">{item.text}</p>
                <p className="text-xs text-ink-secondary mt-0.5">{item.time}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </GlassCard>
  );
}