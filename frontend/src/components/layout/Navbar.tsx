import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Workflow", href: "#ai-workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#top");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(href: string) {
    setMobileOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header id="top" className="sticky top-0 z-50 px-4 pt-4">
      <motion.div
        animate={{
          boxShadow: scrolled
            ? "0 8px 32px rgba(31, 38, 135, 0.14)"
            : "0 8px 32px rgba(31, 38, 135, 0.06)",
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-xl3 border transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-glass-border"
            : "bg-glass-card backdrop-blur-glass border-glass-border"
        )}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#top");
          }}
          className="flex items-center shrink-0"
        >
          <Logo size="md" />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="relative px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink transition-colors group"
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-ink origin-left transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link to="/login">
            <Button variant="ghost" className="!px-4 !py-2 text-sm">
              Log In
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" className="!px-5 !py-2 text-sm">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white/50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden max-w-6xl mx-auto mt-2 glass-card overflow-hidden"
          >
            <nav className="flex flex-col p-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    activeHash === link.href
                      ? "bg-ink text-white"
                      : "text-ink-secondary hover:bg-white/60 hover:text-ink"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 mt-2 pt-3 border-t border-glass-border">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full !py-2 text-sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full !py-2 text-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}