import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 18, className }: LoadingSpinnerProps) {
  return (
    <motion.span
      className={cn("inline-block rounded-full border-2 border-white/30 border-t-white", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
      aria-label="Loading"
      role="status"
    />
  );
}