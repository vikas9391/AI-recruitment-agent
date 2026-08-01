import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { CountUp } from "../ui/CountUp";
import { HeroAnimation } from "./HeroAnimation";

const HEADING = "Your AI recruiter, working around the clock.";

const STATS = [
  { value: 12480, suffix: "+", label: "Resumes Screened" },
  { value: 94, suffix: "%", label: "AI Match Accuracy" },
  { value: 3210, suffix: "+", label: "Active Candidates" },
  { value: 500, suffix: "+", label: "Companies Hiring" },
];

const PARTICLES = [
  { top: "12%", left: "8%", size: 5, duration: 7, delay: 0 },
  { top: "22%", left: "24%", size: 3, duration: 9, delay: 0.6 },
  { top: "68%", left: "14%", size: 4, duration: 8, delay: 1.1 },
  { top: "78%", left: "30%", size: 3, duration: 6.5, delay: 0.3 },
  { top: "15%", left: "58%", size: 4, duration: 8.5, delay: 0.9 },
  { top: "35%", left: "70%", size: 3, duration: 7.5, delay: 1.4 },
  { top: "60%", left: "82%", size: 5, duration: 9.5, delay: 0.2 },
  { top: "85%", left: "62%", size: 3, duration: 6, delay: 1.7 },
];

export function Hero() {
  const words = HEADING.split(" ");

  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20">
      {/* Animated mesh gradient blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent-blue/30 blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, 12, 0], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-10 -right-16 h-[26rem] w-[26rem] rounded-full bg-accent-purple/30 blur-3xl"
        animate={{ y: [0, -22, 0], x: [0, -14, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-accent-blue/20 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, 16, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* Floating light particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-8">
          {/* Left column */}
          <div className="w-full lg:w-[55%] text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-secondary"
            >
              <Sparkles size={13} className="text-accent-purple" />
              AI Powered Recruitment Platform
            </motion.div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-tight text-ink">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-4 text-lg text-ink-secondary max-w-xl mx-auto lg:mx-0"
            >
              Resume screening, personalized assessments, and candidate ranking —
              automated, so HR only reviews and approves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/login">
                <Button variant="primary">Get Started</Button>
              </Link>
              <a href="#features">
                <Button variant="secondary">See Features</Button>
              </a>
            </motion.div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.85 + i * 0.1 }}
                >
                  <GlassCard hover={false} className="!p-4">
                    <p className="text-xl font-bold text-ink">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-ink-secondary mt-1">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column — Spline animation container */}
          <HeroAnimation />
        </div>
      </div>
    </section>
  );
}