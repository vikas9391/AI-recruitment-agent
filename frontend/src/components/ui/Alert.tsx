import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
}

const config: Record<AlertVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "bg-success/10 border-success/30 text-success" },
  error: { icon: XCircle, classes: "bg-danger/10 border-danger/30 text-danger" },
  warning: { icon: AlertTriangle, classes: "bg-warning/10 border-warning/30 text-warning" },
  info: { icon: Info, classes: "bg-accent-blue/10 border-accent-blue/30 text-accent-blue" },
};

export function Alert({ variant, title, message, onClose }: AlertProps) {
  const { icon: Icon, classes } = config[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("flex items-start gap-3 rounded-2xl border px-4 py-3", classes)}
        role="alert"
      >
        <Icon size={18} className="mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <p className="text-sm text-ink/80">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Dismiss alert" className="shrink-0 opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}