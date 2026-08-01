import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface CandidateLayoutProps {
  title?: string;
  subtitle?: string;
}

export function CandidateLayout({ title, subtitle, children }: PropsWithChildren<CandidateLayoutProps>) {
  return (
    <div className="min-h-screen p-4 lg:p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-bold text-ink">
          <span className="h-7 w-7 rounded-full bg-ink shrink-0" />
          Recruit AI — Candidate Portal
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-ink-secondary">
          <ShieldCheck size={14} className="text-success" />
          Secure Assessment Session
        </div>
      </header>

      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          {title && <h1 className="text-xl font-bold text-ink">{title}</h1>}
          {subtitle && <p className="text-sm text-ink-secondary mt-0.5">{subtitle}</p>}
        </motion.div>
      )}

      <main>{children}</main>
    </div>
  );
}