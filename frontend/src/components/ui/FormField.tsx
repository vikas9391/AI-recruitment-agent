import type { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return <div className={className}>{children}</div>;
}