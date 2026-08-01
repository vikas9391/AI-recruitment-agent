import { cn } from "../../lib/utils";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-accent-blue/10 text-accent-blue",
  neutral: "bg-ink/5 text-ink-secondary",
};

const STATUS_MAP: Record<string, BadgeTone> = {
  Confirmed: "success",
  Pending: "warning",
  Rescheduled: "danger",
  Shortlisted: "info",
  "In Review": "neutral",
};

export function Badge({ label, tone }: BadgeProps) {
  const resolvedTone = tone ?? STATUS_MAP[label] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", tones[resolvedTone])}>
      {label}
    </span>
  );
}