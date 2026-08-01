import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { AuthCard } from "../../components/ui/AuthCard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { SectionDivider } from "../../components/ui/SectionDivider";
import { Logo } from "../../components/ui/Logo";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../lib/apiClient";

interface FormState {
  companyName: string;
  companyEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const initialForm: FormState = {
  companyName: "",
  companyEmail: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.companyName) next.companyName = "Company name is required";
    if (!form.companyEmail) next.companyEmail = "Company email is required";
    else if (!validateEmail(form.companyEmail)) next.companyEmail = "Enter a valid email address";

    if (!form.firstName) next.firstName = "First name is required";
    if (!form.lastName) next.lastName = "Last name is required";

    if (!form.email) next.email = "Email is required";
    else if (!validateEmail(form.email)) next.email = "Enter a valid email address";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Minimum 8 characters";

    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        company_name: form.companyName,
        company_email: form.companyEmail,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not create your account. Please check your details."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard eyebrow="Get Started">
        <div className="flex justify-center lg:justify-start">
          <Logo size="lg" className="mb-4" />
        </div>

        <h1 className="text-2xl font-bold text-ink">Create your company account</h1>
        <p className="mt-1.5 text-sm text-ink-secondary">
          Sets up your company and your first HR Admin login in one step.
        </p>

        {submitError && (
          <div className="mt-4">
            <Alert variant="error" message={submitError} onClose={() => setSubmitError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            label="Company name"
            placeholder="Acme Inc."
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            status={errors.companyName ? "error" : "default"}
            hint={errors.companyName}
          />

          <Input
            label="Company email"
            type="email"
            placeholder="hr@acme.com"
            value={form.companyEmail}
            onChange={(e) => handleChange("companyEmail", e.target.value)}
            status={errors.companyEmail ? "error" : "default"}
            hint={errors.companyEmail}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              placeholder="Vikas"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              status={errors.firstName ? "error" : "default"}
              hint={errors.firstName}
            />
            <Input
              label="Last name"
              placeholder="Kumar"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              status={errors.lastName ? "error" : "default"}
              hint={errors.lastName}
            />
          </div>

          <Input
            label="Your email"
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
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            status={errors.password ? "error" : "default"}
            hint={errors.password}
          />

          <Input
            label="Confirm password"
            isPassword
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            status={errors.confirmPassword ? "error" : "default"}
            hint={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <SectionDivider />

        <p className="text-center text-sm text-ink-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent-blue hover:underline">
            Sign in
          </Link>
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-secondary"
        >
          <ShieldCheck size={14} className="text-success" />
          Secure AI Recruitment Platform
        </motion.div>
      </AuthCard>
    </AuthLayout>
  );
}
