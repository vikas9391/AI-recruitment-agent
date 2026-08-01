import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Send } from "lucide-react";
import { CandidateLayout } from "./CandidateLayout";
import { Timer } from "./Timer";
import {
  codingProblem,
  languageOptions,
  starterCode,
  assessmentInfo,
  type Language,
} from "../../constants/candidateAssessmentMockData";

const TIMER_STORAGE_KEY = "candidate-assessment-end-time";

export default function CodingEditor() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("JavaScript");
  const [code, setCode] = useState<string>(starterCode["JavaScript"]);
  const [ranOnce, setRanOnce] = useState(false);
  const [expired, setExpired] = useState(false);

  function handleLanguageChange(next: Language) {
    setLanguage(next);
    setCode(starterCode[next]);
  }

  function handleRun() {
    // TODO: Backend Integration — execute code via a real compiler/runner service.
    setRanOnce(true);
  }

  function handleSubmit() {
    // TODO: Backend Integration — submit code solution to API.
    navigate("/candidate/submission");
  }

  return (
    <CandidateLayout title="Coding Assessment" subtitle="Solve the problem below in your preferred language.">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-4">
        <Timer
          durationMinutes={assessmentInfo.durationMinutes}
          storageKey={TIMER_STORAGE_KEY}
          onExpire={() => setExpired(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5 space-y-4"
        >
          <div>
            <h3 className="text-base font-bold text-ink">{codingProblem.title}</h3>
            <p className="text-sm text-ink-secondary mt-2 leading-relaxed">{codingProblem.description}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-1">Sample Input</p>
            <pre className="rounded-xl bg-ink/5 px-3 py-2 text-xs text-ink overflow-x-auto">
              {codingProblem.sampleInput}
            </pre>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-1">Sample Output</p>
            <pre className="rounded-xl bg-ink/5 px-3 py-2 text-xs text-ink overflow-x-auto">
              {codingProblem.sampleOutput}
            </pre>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-1">Constraints</p>
            <ul className="space-y-1">
              {codingProblem.constraints.map((c, i) => (
                <li key={i} className="text-xs text-ink-secondary">
                  • {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass-card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 min-h-[320px] w-full rounded-xl border border-gray-200 bg-ink text-white font-mono text-sm p-4 outline-none focus:border-accent-blue resize-none"
          />

          {ranOnce && (
            <div className="mt-3 rounded-xl bg-ink/5 px-3 py-2 text-xs text-ink-secondary">
              Code execution is not available in this preview. Your code will run against test cases once backend integration is complete.
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-ink hover:bg-white/60 transition-colors"
            >
              <Play size={14} />
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 rounded-full bg-ink text-white px-4 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              <Send size={14} />
              Submit Code
            </button>
          </div>
        </motion.div>
      </div>

      {expired && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mt-4 text-center border border-danger/30 bg-danger/5"
        >
          <p className="text-sm font-semibold text-danger">Time Expired</p>
          <p className="text-xs text-ink-secondary mt-1 mb-3">
            Your assessment time has ended. Please submit your code now.
          </p>
          <button
            onClick={handleSubmit}
            className="rounded-full bg-ink text-white px-6 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            Submit Assessment
          </button>
        </motion.div>
      )}

      {/* TODO: Backend Integration */}
    </CandidateLayout>
  );
}