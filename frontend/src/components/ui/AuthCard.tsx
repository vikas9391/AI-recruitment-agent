import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  eyebrow?: string;
}

export function AuthCard({ eyebrow, children }: PropsWithChildren<AuthCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card p-8"
    >
      {eyebrow && (
        <p className="text-xs font-medium text-accent-blue uppercase tracking-wide mb-2">
          {eyebrow}
        </p>
      )}
      {children}
    </motion.div>
  );
}