import { useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, BarChart3, ClipboardCheck, ListOrdered, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface Preview {
  icon: LucideIcon;
  title: string;
  tone: "blue" | "purple";
  content: React.ReactNode;
}

function MiniBar({ width, tone }: { width: string; tone: "blue" | "purple" }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-ink/5">
      <div
        className={cn("h-full rounded-full", tone === "blue" ? "bg-accent-blue" : "bg-accent-purple")}
        style={{ width }}
      />
    </div>
  );
}

const JobsPreview = (
  <div className="space-y-2.5">
    {[
      { role: "Frontend Engineer", status: "Open", tone: "blue" as const },
      { role: "Product Designer", status: "Open", tone: "purple" as const },
      { role: "Data Analyst", status: "Closed", tone: "blue" as const },
    ].map((job) => (
      <div key={job.role} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2">
        <span className="text-[11px] font-medium text-ink">{job.role}</span>
        <span
          className={cn(
            "text-[9px] font-semibold px-2 py-0.5 rounded-full",
            job.status === "Open" ? "bg-success/10 text-success" : "bg-ink/5 text-ink-secondary"
          )}
        >
          {job.status}
        </span>
      </div>
    ))}
  </div>
);

const CandidatesPreview = (
  <div className="space-y-2.5">
    {[
      { name: "Ayesha K.", score: "92%" },
      { name: "Marcus L.", score: "87%" },
      { name: "Priya R.", score: "81%" },
    ].map((c) => (
      <div key={c.name} className="flex items-center gap-2.5">
        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple" />
        <span className="flex-1 text-[11px] font-medium text-ink truncate">{c.name}</span>
        <span className="text-[10px] font-semibold text-accent-blue">{c.score}</span>
      </div>
    ))}
  </div>
);

const AnalyticsPreview = (
  <div className="flex items-end gap-2 h-16">
    {[40, 65, 50, 85, 60, 95, 70].map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-t-md bg-gradient-to-t from-accent-blue to-accent-purple"
        style={{ height: `${h}%`, opacity: 0.55 + (i / 7) * 0.4 }}
      />
    ))}
  </div>
);

const AssessmentsPreview = (
  <div className="space-y-2.5">
    {["Coding Test", "Aptitude Test", "System Design"].map((label, i) => (
      <div key={label} className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] text-white",
            i < 2 ? "bg-success" : "bg-ink/15 text-ink-secondary"
          )}
        >
          {i < 2 ? "✓" : ""}
        </div>
        <span className="text-[11px] font-medium text-ink">{label}</span>
      </div>
    ))}
  </div>
);

const RankingsPreview = (
  <div className="space-y-2.5">
    {[
      { rank: 1, name: "Ayesha K.", width: "92%" },
      { rank: 2, name: "Marcus L.", width: "83%" },
      { rank: 3, name: "Priya R.", width: "76%" },
    ].map((r) => (
      <div key={r.rank} className="flex items-center gap-2.5">
        <span className="text-[10px] font-bold text-ink-secondary w-3">{r.rank}</span>
        <span className="w-16 shrink-0 text-[11px] font-medium text-ink truncate">{r.name}</span>
        <MiniBar width={r.width} tone={r.rank === 2 ? "purple" : "blue"} />
      </div>
    ))}
  </div>
);

const PREVIEWS: Preview[] = [
  { icon: Briefcase, title: "Jobs", tone: "blue", content: JobsPreview },
  { icon: Users, title: "Candidates", tone: "purple", content: CandidatesPreview },
  { icon: BarChart3, title: "Analytics", tone: "blue", content: AnalyticsPreview },
  { icon: ClipboardCheck, title: "Assessments", tone: "purple", content: AssessmentsPreview },
  { icon: ListOrdered, title: "Rankings", tone: "blue", content: RankingsPreview },
];

// Fan layout for the overlapping desktop presentation.
const FAN = [
  { x: -220, y: 18, rotate: -10 },
  { x: -108, y: -6, rotate: -5 },
  { x: 0, y: -22, rotate: 0 },
  { x: 108, y: -6, rotate: 5 },
  { x: 220, y: 18, rotate: 10 },
];

function TiltCard({ preview, fan, index }: { preview: Preview; fan?: (typeof FAN)[number]; index: number }) {
  const Icon = preview.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -12, ry: px * 12 });
  }

  function handleMouseLeave() {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }

  const outerAnimate = fan
    ? {
        x: hovered ? 0 : fan.x,
        y: hovered ? -30 : fan.y,
        rotate: hovered ? 0 : fan.rotate,
        scale: hovered ? 1.08 : 1,
        zIndex: hovered ? 50 : 10 + (2 - Math.abs(2 - index)),
      }
    : { scale: hovered ? 1.04 : 1 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      animate={outerAnimate}
      style={fan ? { position: "absolute", left: "50%", top: "50%", marginLeft: -140, marginTop: -100 } : undefined}
      className={fan ? "w-[280px]" : "w-full"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        ref={cardRef}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
        className={cn(
          "glass-card p-4 select-none",
          hovered ? "shadow-[0_28px_70px_rgba(101,184,255,0.35)]" : "shadow-glass"
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-xl text-white",
              preview.tone === "blue" ? "bg-accent-blue" : "bg-accent-purple"
            )}
          >
            <Icon size={14} />
          </span>
          <span className="text-xs font-semibold text-ink">{preview.title}</span>
        </div>
        {preview.content}
      </motion.div>
    </motion.div>
  );
}

export function ProductShowcase() {
  return (
    <section id="ai-workflow" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">See CrewSync in Action</h2>
          <p className="mt-3 text-ink-secondary max-w-xl mx-auto">
            One workspace for every stage of hiring — jobs, candidates, assessments, rankings, and analytics.
          </p>
        </motion.div>

        {/* Desktop: overlapping fan, hover to tilt/lift */}
        <div className="hidden lg:block relative h-[420px] mt-16" style={{ perspective: 1200 }}>
          {PREVIEWS.map((preview, i) => (
            <TiltCard key={preview.title} preview={preview} fan={FAN[i]} index={i} />
          ))}
        </div>

        {/* Tablet / mobile: simple responsive grid */}
        <div className="lg:hidden mt-12 grid sm:grid-cols-2 gap-6" style={{ perspective: 1200 }}>
          {PREVIEWS.map((preview, i) => (
            <TiltCard key={preview.title} preview={preview} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}