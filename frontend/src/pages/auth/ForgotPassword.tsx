import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { AuthCard } from "../../components/ui/AuthCard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError(undefined);
    setIsLoading(true);

    // TODO:
    // Backend Integration — trigger password reset email via API.
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1200);
  }

  return (
    <AuthLayout>
      <AuthCard eyebrow="Account Recovery">
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-ink">Forgot your password?</h1>
              <p className="mt-1.5 text-sm text-ink-secondary">
                Enter the email associated with your account and we'll send a
                link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(undefined);
                  }}
                  status={error ? "error" : "default"}
                  hint={error}
                />

                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-ink"
              >
                <ArrowLeft size={15} />
                Back to login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto h-14 w-14 rounded-full bg-success/10 flex items-center justify-center"
              >
                <MailCheck size={26} className="text-success" />
              </motion.div>

              <h2 className="mt-4 text-lg font-bold text-ink">Check your inbox</h2>
              <p className="mt-1.5 text-sm text-ink-secondary">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>

              <Link to="/login" className="mt-6 inline-block">
                <Button variant="secondary">Back to login</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
}