import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";
import { CandidateLayout } from "./CandidateLayout";
import { assessmentInfo } from "../../constants/candidateAssessmentMockData";

function generateReferenceNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `REF-${random}`;
}

export default function Submission() {
  const navigate = useNavigate();
  const [submissionTime] = useState(() =>
    new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
  );
  const [referenceNumber] = useState(generateReferenceNumber);

  useEffect(() => {
    // Reset the shared timer so a future assessment attempt starts fresh.
    sessionStorage.removeItem("candidate-assessment-end-time");
  }, []);

  return (
    <CandidateLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card p-8 max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mb-4"
        >
          <CheckCircle2 size={28} className="text-success" />
        </motion.div>

        <h1 className="text-lg font-bold text-ink">Assessment Submitted Successfully</h1>
        <p className="text-sm text-ink-secondary mt-1.5">
          Thank you for completing your assessment. Our team will review your submission and get back to you soon.
        </p>

        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3 text-sm">
            <span className="text-ink-secondary">Submission Time</span>
            <span className="font-medium text-ink">{submissionTime}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3 text-sm">
            <span className="text-ink-secondary">Assessment ID</span>
            <span className="font-medium text-ink">{assessmentInfo.id}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3 text-sm">
            <span className="text-ink-secondary">Reference Number</span>
            <span className="font-medium text-ink">{referenceNumber}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          <Home size={15} />
          Back to Home
        </button>
      </motion.div>

      {/* TODO: Backend Integration */}
    </CandidateLayout>
  );
}