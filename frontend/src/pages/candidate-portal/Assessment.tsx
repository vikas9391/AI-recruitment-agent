import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Clock3, Target, User, Briefcase } from "lucide-react";
import { CandidateLayout } from "./CandidateLayout";
import { Timer } from "./Timer";
import { candidateInfo, assessmentInfo, mcqQuestions } from "../../constants/candidateAssessmentMockData";
import { cn } from "../../lib/utils";

const TIMER_STORAGE_KEY = "candidate-assessment-end-time";

export default function Assessment() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expired, setExpired] = useState(false);

  const totalQuestions = mcqQuestions.length;
  const answeredCount = Object.keys(saved).filter((k) => saved[k]).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const currentQuestion = mcqQuestions[currentIndex];
  const allAnswered = answeredCount === totalQuestions;

  function selectOption(optionId: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  function saveAnswer() {
    if (!answers[currentQuestion.id]) return;
    setSaved((prev) => ({ ...prev, [currentQuestion.id]: true }));
  }

  function goTo(index: number) {
    setCurrentIndex(index);
  }

  function handleSubmitAssessment() {
    // TODO: Backend Integration — submit MCQ answers to API.
    navigate("/candidate/coding");
  }

  function handleExpiredSubmit() {
    // TODO: Backend Integration — auto-submit assessment on timer expiry.
    navigate("/candidate/submission");
  }

  return (
    <CandidateLayout title="Assessment" subtitle="Complete your assigned assessment.">
      {!started ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <User size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Candidate</p>
                <p className="font-medium text-ink">{candidateInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <Briefcase size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Applied Job</p>
                <p className="font-medium text-ink">{candidateInfo.appliedJob}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <ClipboardList size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Assessment</p>
                <p className="font-medium text-ink">{assessmentInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <Clock3 size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Duration</p>
                <p className="font-medium text-ink">{assessmentInfo.durationMinutes} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <ClipboardList size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Total Questions</p>
                <p className="font-medium text-ink">{assessmentInfo.totalQuestions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <Target size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Passing Score</p>
                <p className="font-medium text-ink">{assessmentInfo.passingScore}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink mb-2">Instructions</h3>
            <ul className="space-y-1.5">
              {assessmentInfo.instructions.map((line, i) => (
                <li key={i} className="text-sm text-ink-secondary flex gap-2">
                  <span className="text-ink-secondary">•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto rounded-full bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            Start Assessment
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-ink-secondary mb-1.5">
                <span>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span>
                  {answeredCount}/{totalQuestions} answered
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-accent-blue"
                />
              </div>
            </div>
            <Timer
              durationMinutes={assessmentInfo.durationMinutes}
              storageKey={TIMER_STORAGE_KEY}
              onExpire={() => setExpired(true)}
            />
          </div>

          <AnimatePresence mode="wait">
            {expired ? (
              <motion.div
                key="expired"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-6 text-center space-y-3"
              >
                <p className="text-lg font-bold text-danger">Time Expired</p>
                <p className="text-sm text-ink-secondary">
                  Your assessment time has ended. Please submit your responses now.
                </p>
                <button
                  onClick={handleExpiredSubmit}
                  className="rounded-full bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
                >
                  Submit Assessment
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-6"
              >
                <p className="text-sm font-semibold text-ink mb-4">{currentQuestion.text}</p>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors",
                          isSelected
                            ? "border-accent-blue bg-accent-blue/5 text-ink"
                            : "border-gray-200 text-ink-secondary hover:bg-white/60"
                        )}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          checked={isSelected}
                          onChange={() => selectOption(opt.id)}
                          className="h-4 w-4 text-accent-blue"
                        />
                        {opt.text}
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-5">
                  <button
                    onClick={saveAnswer}
                    disabled={!answers[currentQuestion.id]}
                    className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saved[currentQuestion.id] ? "Answer Saved" : "Save Answer"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goTo(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => goTo(Math.min(totalQuestions - 1, currentIndex + 1))}
                      disabled={currentIndex === totalQuestions - 1}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!expired && (
            <div className="glass-card p-4">
              <p className="text-xs text-ink-secondary mb-2">Question Navigator</p>
              <div className="flex flex-wrap gap-2">
                {mcqQuestions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-9 w-9 rounded-full text-xs font-semibold flex items-center justify-center border transition-colors",
                      i === currentIndex
                        ? "bg-ink text-white border-ink"
                        : saved[q.id]
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-white text-ink-secondary border-gray-200 hover:bg-white/80"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitAssessment}
                disabled={!allAnswered}
                className="mt-4 w-full sm:w-auto rounded-full bg-ink text-white px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Assessment
              </button>
              {!allAnswered && (
                <p className="text-xs text-ink-secondary mt-2">
                  Save an answer for all {totalQuestions} questions to submit.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TODO: Backend Integration */}
    </CandidateLayout>
  );
}