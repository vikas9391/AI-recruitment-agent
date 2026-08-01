import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";

const FLOATING_STATS = [
  { label: "Resumes Screened", value: "12,480", tone: "bg-white/70" },
  { label: "AI Match Score", value: "94%", tone: "bg-accent-purple/10 text-accent-purple" },
  { label: "Active Candidates", value: "3,210", tone: "bg-white/70" },
];

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: illustration panel */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden p-12">
        <motion.div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent-blue/30 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-accent-purple/30 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold leading-tight"
          >
            Your AI recruiter, working around the clock.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-ink-secondary"
          >
            Resume screening, personalized assessments, and candidate
            ranking — automated, so HR only reviews and approves.
          </motion.p>

          <div className="mt-10 space-y-4">
            {FLOATING_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <Card hover={false} className={`!p-4 w-64 ${stat.tone}`}>
                  <p className="text-xs text-ink-secondary">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: auth card */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          className="absolute top-10 right-10 h-40 w-40 rounded-full bg-accent-blue/20 blur-3xl lg:hidden"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}