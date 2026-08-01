import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  growth: number;
  icon: string;
  delay?: number;
}

export function StatCard({ label, value, growth, icon, delay }: StatCardProps) {
  const Icon = (Icons[icon as keyof typeof Icons] as LucideIcon) ?? Icons.Circle;
  const isPositive = growth >= 0;

  return (
    <GlassCard delay={delay} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="h-10 w-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
          <Icon size={18} />
        </span>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}
        >
          {isPositive ? "+" : ""}
          {growth}%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-ink">{value.toLocaleString()}</p>
        <p className="text-sm text-ink-secondary mt-0.5">{label}</p>
      </div>
    </GlassCard>
  );
}