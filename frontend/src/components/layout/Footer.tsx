import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { Logo } from "../ui/Logo";
import { cn } from "../../lib/utils";

// lucide-react removed brand/social icons in its latest major version,
// so these are small inline SVG marks instead (currentColor, 24x24 grid).
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.6v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H9z" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.3 6.84 9.65.5.1.68-.22.68-.48 0-.24-.01-1.02-.01-1.86-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6 6-6zm-1.2 18h1.9L6.4 3.9H4.4L17.7 20z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI Workflow", href: "#ai-workflow" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assessments", href: "/dashboard/assessments" },
      { label: "Analytics", href: "/dashboard/analytics" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Community", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Security", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

const SOCIALS = [
  { label: "LinkedIn", icon: LinkedInIcon, href: "https://linkedin.com" },
  { label: "GitHub", icon: GithubIcon, href: "https://github.com" },
  { label: "Twitter", icon: XIcon, href: "https://twitter.com" },
  { label: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
  { label: "Email", icon: Mail, href: "mailto:hello@crewsync.ai" },
];

function handleAnchorClick(e: React.MouseEvent, href: string) {
  if (href === "#" || !href.startsWith("#")) return;
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function FooterLinkItem({ href, label }: FooterLink) {
  const className =
    "group relative inline-flex text-sm text-ink-secondary transition-colors duration-200 hover:text-ink";

  const inner = (
    <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.18 }} className="relative inline-block">
      {label}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
    </motion.span>
  );

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {inner}
      </Link>
    );
  }

  if (href.startsWith("#") && href !== "#") {
    return (
      <a href={href} onClick={(e) => handleAnchorClick(e, href)} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={className}>
      {inner}
    </a>
  );
}

function SocialIcon({ label, icon: Icon, href }: (typeof SOCIALS)[number]) {
  const isExternal = href.startsWith("http");
  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      whileHover={{ scale: 1.12, rotate: -6 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass-card backdrop-blur-glass text-ink-secondary",
        "transition-colors duration-200 hover:text-ink hover:border-accent-blue/40",
        "hover:shadow-[0_0_18px_rgba(99,102,241,0.35)]"
      )}
    >
      <Icon size={16} />
    </motion.a>
  );
}

function MagneticSubscribeButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setOffset({ x, y });
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 14, mass: 0.4 }}
      disabled={isLoading}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-xl2 px-5 py-2.5 text-sm font-semibold text-white shrink-0",
        "bg-gradient-to-r from-accent-blue to-accent-purple bg-[length:200%_100%] bg-left",
        "transition-[background-position] duration-500 hover:bg-right",
        "shadow-[0_8px_24px_rgba(99,102,241,0.3)] disabled:opacity-70"
      )}
    >
      {isLoading ? "Subscribing..." : "Subscribe"}
      {!isLoading && <ArrowRight size={15} />}
    </motion.button>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (!email || subscribing) return;
    setSubscribing(true);
    // Static/mock — no backend wired yet.
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setEmail("");
    }, 900);
  }

  return (
    <footer className="px-4 pb-8 pt-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-6xl mx-auto glass-card px-6 sm:px-10 py-10 sm:py-12"
      >
        {/* Newsletter strip */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-10 mb-10 border-b border-glass-border"
        >
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-ink">Stay Updated</h3>
            <p className="mt-1 text-sm text-ink-secondary">
              Get product updates and AI recruitment insights.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubscribe();
            }}
            className="flex w-full max-w-md flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={cn(
                  "w-full rounded-xl2 border border-glass-border bg-glass-card backdrop-blur-glass px-4 py-2.5 text-sm text-ink placeholder:text-ink-secondary/70",
                  "outline-none transition-all duration-200 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
                )}
              />
            </div>
            <MagneticSubscribeButton onClick={handleSubscribe} isLoading={subscribing} />
          </form>
        </motion.div>

        {subscribed && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="-mt-6 mb-6 text-xs font-medium text-accent-blue"
          >
            You're subscribed — welcome aboard.
          </motion.p>
        )}

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-x-8 gap-y-10">
          <motion.div variants={fadeUp} className="col-span-2 sm:col-span-3 lg:col-span-4">
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-secondary">
              CrewSync is an AI-powered recruitment platform that helps HR teams automate hiring,
              resume screening, assessments, candidate ranking, and recruitment workflows.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </motion.div>

          {COLUMNS.map((col) => (
            <motion.div key={col.title} variants={fadeUp} className="col-span-1 sm:col-span-1 lg:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem {...link} />
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-10 pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary"
        >
          <p className="hover:text-ink transition-colors duration-200">
            © {new Date().getFullYear()} CrewSync. All rights reserved.
          </p>
          <motion.p
            whileHover={{ y: -2 }}
            className="flex items-center gap-1.5 hover:text-ink transition-colors duration-200"
          >
            Made with
            <motion.span
              whileHover={{ scale: 1.3 }}
              className="inline-flex text-danger"
            >
              <Heart size={12} fill="currentColor" />
            </motion.span>
            for smarter hiring · Version 1.0
          </motion.p>
        </motion.div>
      </motion.div>
    </footer>
  );
}