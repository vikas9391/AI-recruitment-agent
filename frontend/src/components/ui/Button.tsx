import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary: "glass text-ink hover:bg-white/80",
  ghost: "bg-transparent text-ink hover:bg-white/40",
};

export function Button({
  variant = "primary",
  isLoading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      disabled={disabled || isLoading}
      className={cn(
        "px-6 py-3 rounded-full font-medium text-sm transition-colors",
        "focus-visible:ring-2 focus-visible:ring-accent-blue",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "inline-flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && <LoadingSpinner size={16} />}
      {children}
    </motion.button>
  );
}