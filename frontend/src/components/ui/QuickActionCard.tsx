import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon: Icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card p-5 text-left w-full focus-visible:ring-2 focus-visible:ring-accent-blue"
    >
      <span className="h-10 w-10 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
        <Icon size={18} />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
      <p className="text-xs text-ink-secondary mt-1">{description}</p>
    </motion.button>
  );
}