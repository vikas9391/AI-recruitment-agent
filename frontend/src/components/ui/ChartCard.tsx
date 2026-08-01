import type { PropsWithChildren } from "react";
import { GlassCard } from "./GlassCard";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  delay?: number;
  className?: string;
}

export function ChartCard({ title, subtitle, delay, className, children }: PropsWithChildren<ChartCardProps>) {
  return (
    <GlassCard delay={delay} hover={false} className={className}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-secondary mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </GlassCard>
  );
}