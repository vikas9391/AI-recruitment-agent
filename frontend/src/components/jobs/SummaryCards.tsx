import { Briefcase, CheckCircle2, XCircle, FileEdit } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { AnimatedCounter } from "./AnimatedCounter";
import type { Job } from "../../types/job";

export function SummaryCards({ jobs }: { jobs: Job[] }) {
  const total = jobs.length;
  const open = jobs.filter((j) => j.status === "Open").length;
  const closed = jobs.filter((j) => j.status === "Closed").length;
  const draft = jobs.filter((j) => j.status === "Draft").length;

  const cards = [
    { label: "Total Jobs", value: total, icon: Briefcase, tone: "text-accent-blue bg-accent-blue/10" },
    { label: "Open Jobs", value: open, icon: CheckCircle2, tone: "text-success bg-success/10" },
    { label: "Closed Jobs", value: closed, icon: XCircle, tone: "text-danger bg-danger/10" },
    { label: "Draft Jobs", value: draft, icon: FileEdit, tone: "text-warning bg-warning/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <GlassCard key={card.label} delay={i * 0.05} className="flex flex-col gap-3">
          <span className={`h-10 w-10 rounded-2xl flex items-center justify-center ${card.tone}`}>
            <card.icon size={18} />
          </span>
          <div>
            <p className="text-2xl font-bold text-ink">
              <AnimatedCounter value={card.value} />
            </p>
            <p className="text-sm text-ink-secondary mt-0.5">{card.label}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}