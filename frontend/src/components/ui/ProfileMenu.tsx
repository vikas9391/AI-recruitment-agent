import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-white/60"
      >
        <span className="h-8 w-8 rounded-full bg-accent-blue/20 text-accent-blue font-semibold flex items-center justify-center text-xs">
          SK
        </span>
        <span className="hidden sm:block text-left">
          <span className="block text-xs font-semibold text-ink leading-tight">Sarah Khan</span>
          <span className="block text-[11px] text-ink-secondary leading-tight">HR Admin</span>
        </span>
        <ChevronDown size={14} className="text-ink-secondary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 glass-card p-2 z-50"
            >
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Settings" },
                { icon: LogOut, label: "Logout" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-ink-secondary hover:bg-white/60 hover:text-ink"
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}