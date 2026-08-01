import { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer select-none text-sm"
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={`h-4 w-4 rounded border-gray-300 text-accent-blue
            focus:ring-2 focus:ring-accent-blue/40
            dark:border-gray-700 dark:bg-gray-900
            ${className}`}
          {...props}
        />
        {label && <span className="text-ink-secondary">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";