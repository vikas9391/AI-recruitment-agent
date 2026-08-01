import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { AuthCard } from "../../components/ui/AuthCard";
import { Input } from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { SectionDivider } from "../../components/ui/SectionDivider";
import { Logo } from "../../components/ui/Logo";
import { ShieldCheck } from "lucide-react";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    else if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email address";

    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) nextErrors.password = "Minimum 6 characters";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);

    // TODO:
    // Backend Integration — connect to auth API, handle JWT, store tokens.
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1200);
  }

  return (
    <AuthLayout>
      <AuthCard eyebrow="Welcome Back">
        <div className="flex justify-center lg:justify-start">
          <Logo size="lg" className="mb-4" />
        </div>

        <h1 className="text-2xl font-bold text-ink">Sign in to your account</h1>
        <p className="mt-1.5 text-sm text-ink-secondary">
          Enter your credentials to access the recruitment dashboard.
        </p>

        {submitError && (
          <div className="mt-4">
            <Alert variant="error" message={submitError} onClose={() => setSubmitError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            status={errors.email ? "error" : "default"}
            hint={errors.email}
          />

          <Input
            label="Password"
            isPassword
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            status={errors.password ? "error" : "default"}
            hint={errors.password}
          />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-accent-blue hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <SectionDivider />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-xs text-ink-secondary"
        >
          <ShieldCheck size={14} className="text-success" />
          Secure AI Recruitment Platform
        </motion.div>
      </AuthCard>
    </AuthLayout>
  );
}