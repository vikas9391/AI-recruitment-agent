import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

type InputStatus = "default" | "error" | "success";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  status?: InputStatus;
  hint?: string;
  isPassword?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, status = "default", hint, isPassword = false, icon, className = "", id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? props.name;

    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors",
              "focus:ring-2 focus:ring-accent-blue/40",
              "bg-white dark:bg-gray-900",
              icon && "pl-10",
              isPassword && "pr-10",
              status === "error"
                ? "border-red-400 focus:border-red-500"
                : status === "success"
                ? "border-green-400 focus:border-green-500"
                : "border-gray-200 focus:border-accent-blue dark:border-gray-700",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {hint && (
          <p className={cn("mt-1.5 text-xs", status === "error" ? "text-red-500" : "text-ink-secondary")}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";