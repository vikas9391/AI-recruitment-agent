import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
      aria-pressed={dark}
      className="h-9 w-9 rounded-full bg-white/60 border border-glass-border flex items-center justify-center hover:bg-white/80"
    >
      <motion.span
        key={dark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-ink-secondary"
      >
        {dark ? <Moon size={15} /> : <Sun size={15} />}
      </motion.span>
    </button>
  );
}