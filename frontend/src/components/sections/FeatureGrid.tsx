import { motion } from "framer-motion";
import {
  ScanSearch,
  ClipboardCheck,
  ListOrdered,
  CalendarClock,
  BarChart3,
  MailCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: ScanSearch,
    title: "AI Resume Screening",
    description: "Automatically screens resumes using AI and ranks candidates instantly.",
  },
  {
    icon: ClipboardCheck,
    title: "Automated Assessments",
    description: "Generate coding tests and aptitude assessments automatically.",
  },
  {
    icon: ListOrdered,
    title: "Candidate Ranking",
    description: "Smart ranking using AI match scores and skill analysis.",
  },
  {
    icon: CalendarClock,
    title: "Interview Scheduling",
    description: "Automatically schedule interviews and notify candidates.",
  },
  {
    icon: BarChart3,
    title: "Recruitment Analytics",
    description: "Track hiring performance with beautiful dashboards and reports.",
  },
  {
    icon: MailCheck,
    title: "Email Approval",
    description: "Review AI-generated emails before sending them.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative glass-card p-6 overflow-hidden"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl text-white",
          "bg-gradient-to-br from-accent-blue to-accent-purple shadow-glass",
          "transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
        )}
      >
        <Icon size={20} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{description}</p>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent-blue opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Learn more
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      {/* Glow border on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 0 1px rgba(101,184,255,0.35), 0 16px 40px rgba(101,184,255,0.22), 0 4px 20px rgba(179,139,255,0.18)",
        }}
      />
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-ink text-center"
        >
          Everything HR needs, automated
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}