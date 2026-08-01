import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ hover = true, delay = 0, className, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      whileHover={hover ? { y: -3 } : undefined}
      className={cn("glass-card p-5", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}