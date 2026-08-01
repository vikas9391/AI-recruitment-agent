import { motion } from "framer-motion";
import { Zap, Target, Sparkles, Bot, type LucideIcon } from "lucide-react";
import { CountUp } from "../ui/CountUp";
import { cn } from "../../lib/utils";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  description: string;
  isLive?: boolean;
}

const STATS: Stat[] = [
  {
    icon: Zap,
    value: 95,
    suffix: "%",
    label: "Faster Hiring",
    description: "Reduce manual hiring work with intelligent automation.",
  },
  {
    icon: Target,
    value: 94,
    suffix: "%",
    label: "AI Match Accuracy",
    description: "Find the best candidate faster.",
  },
  {
    icon: Sparkles,
    value: 80,
    suffix: "%",
    label: "Less Manual Work",
    description: "Automate resume screening and assessments.",
  },
  {
    icon: Bot,
    value: 24,
    suffix: "",
    label: "AI Recruiting Assistant",
    description: "Always available to help HR teams.",
    isLive: true,
  },
];

const FLOAT_DURATIONS = [5.5, 6.5, 6, 5];

function StatBadge({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      className="group relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          repeat: Infinity,
          duration: FLOAT_DURATIONS[index % FLOAT_DURATIONS.length],
          ease: "easeInOut",
          delay: index * 0.3,
        }}
        className={cn(
          "relative glass-card flex flex-col items-center gap-2 p-6 text-center h-full",
          "transition-shadow duration-300 group-hover:shadow-[0_16px_50px_rgba(101,184,255,0.3)]"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-white shadow-glass">
          <Icon size={20} />
        </div>

        <p className="mt-1 text-3xl sm:text-4xl font-extrabold text-ink">
          {stat.isLive ? (
            <>
              <CountUp value={stat.value} duration={1.2} />/7
            </>
          ) : (
            <CountUp value={stat.value} suffix={stat.suffix} />
          )}
        </p>
        <p className="text-sm font-semibold text-ink">{stat.label}</p>
        <p className="text-xs leading-snug text-ink-secondary">{stat.description}</p>
      </motion.div>
    </motion.div>
  );
}

export function WhyCrewSync() {
  return (
    <section id="why-crewsync" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">Why HR Teams Love CrewSync</h2>
          <p className="mt-3 text-ink-secondary max-w-xl mx-auto">
            Designed to save time, improve hiring quality and automate repetitive work.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {STATS.map((stat, i) => (
            <StatBadge key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}