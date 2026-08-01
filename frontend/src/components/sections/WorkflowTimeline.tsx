import { motion } from "framer-motion";
import {
  Briefcase,
  ScanSearch,
  ListOrdered,
  ClipboardCheck,
  CalendarClock,
  MailCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { icon: Briefcase, title: "Create Job", description: "Post a role and set requirements in minutes." },
  { icon: ScanSearch, title: "AI Resume Screening", description: "AI reads and ranks every resume against the job." },
  { icon: ListOrdered, title: "Candidate Ranking", description: "Top-fit candidates are surfaced automatically." },
  { icon: ClipboardCheck, title: "AI Assessment", description: "Tailored coding & aptitude tests go out instantly." },
  { icon: CalendarClock, title: "Interview Scheduling", description: "Interviews get booked without the back-and-forth." },
  { icon: MailCheck, title: "Email Approval", description: "HR reviews AI-drafted emails before they send." },
  { icon: CheckCircle2, title: "Hiring Complete", description: "The best candidate gets the offer, faster." },
];

function StepNode({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.04 }}
      className="group relative flex flex-col items-center text-center w-full"
    >
      <div className="relative">
        <div
          className={cn(
            "relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-white",
            "bg-gradient-to-br from-accent-blue to-accent-purple shadow-glass",
            "transition-shadow duration-300 group-hover:shadow-[0_0_0_6px_rgba(101,184,255,0.18),0_12px_32px_rgba(179,139,255,0.35)]"
          )}
        >
          <Icon size={20} />
        </div>
        <span className="absolute -top-1.5 -right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-glass-border bg-white text-[10px] font-bold text-ink shadow-glass">
          {index + 1}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
      <p className="mt-1 text-xs leading-snug text-ink-secondary max-w-[10rem]">{step.description}</p>
    </motion.div>
  );
}

export function WorkflowTimeline() {
  return (
    <section id="how-it-works" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">How CrewSync Works</h2>
          <p className="mt-3 text-ink-secondary max-w-xl mx-auto">
            From job creation to successful hiring, AI automates every step.
          </p>
        </motion.div>

        {/* Desktop / laptop: horizontal timeline */}
        <div className="hidden lg:block relative mt-16">
          <div className="absolute left-0 right-0 top-7 h-px overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="h-px w-full origin-left bg-gradient-to-r from-accent-blue via-accent-purple to-accent-blue"
            />
          </div>
          <div className="relative grid grid-cols-7 gap-4">
            {STEPS.map((step, i) => (
              <StepNode key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Tablet: 3-4 column wrap, no connecting line */}
        <div className="hidden sm:grid lg:hidden mt-14 grid-cols-4 gap-x-6 gap-y-12">
          {STEPS.map((step, i) => (
            <StepNode key={step.title} step={step} index={i} />
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="sm:hidden relative mt-12 pl-8">
          <div className="absolute left-[27px] top-2 bottom-2 w-px overflow-hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-px h-full origin-top bg-gradient-to-b from-accent-blue via-accent-purple to-accent-blue"
            />
          </div>
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative flex items-start gap-4"
                >
                  <div className="relative -ml-8 shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-white shadow-glass">
                      <Icon size={17} />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-glass-border bg-white text-[10px] font-bold text-ink shadow-glass">
                      {i + 1}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                    <p className="mt-0.5 text-xs leading-snug text-ink-secondary">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}