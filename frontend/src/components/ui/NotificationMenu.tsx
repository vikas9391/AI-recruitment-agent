import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, text: "New candidate applied for Product Designer", time: "5m ago" },
  { id: 2, text: "Assessment completed by Rahul Mehta", time: "1h ago" },
  { id: 3, text: "Interview reminder: Priya Singh at 11:00 AM", time: "3h ago" },
];

export function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative h-9 w-9 rounded-full bg-white/60 border border-glass-border flex items-center justify-center hover:bg-white/80"
      >
        <Bell size={16} className="text-ink-secondary" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
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
              className="absolute right-0 mt-2 w-72 glass-card p-3 z-50"
            >
              <p className="text-xs font-semibold text-ink-secondary px-1 mb-2">Notifications</p>
              <ul className="space-y-1">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="rounded-xl px-2 py-2 hover:bg-white/60">
                    <p className="text-sm text-ink">{n.text}</p>
                    <p className="text-xs text-ink-secondary mt-0.5">{n.time}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}