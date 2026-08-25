import { useState, useEffect } from "react";
import { Sparkles, X, CheckCircle2, Award, Loader2 } from "lucide-react";
import { useHeaderData } from "../context/HeaderContext";
import { api } from "../services/api";

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary function of HTTP Middleware in web development?",
    options: [
      "Rendering CSS styles in the browser",
      "Intercepting and processing incoming HTTP requests and responses",
      "Compressing database backups on disk",
      "Compiling TypeScript into JavaScript",
    ],
    answer: 1,
  },
  {
    id: 2,
    question: "Which data structure provides O(1) average lookup time?",
    options: ["Binary Search Tree", "Linked List", "Hash Table / Map", "Array"],
    answer: 2,
  },
  {
    id: 3,
    question: "What does JWT stand for in user authentication?",
    options: [
      "Java Web Transfer",
      "JSON Web Token",
      "JS Window Technology",
      "Joint Workplace Verification",
    ],
    answer: 1,
  },
];

export default function SkillQuizModal({ isOpen, onClose }) {
  const { addXP, setXPAbsolute, goalLabel = "Backend Developer" } = useHeaderData();
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.quizzes
        .getAssessment(goalLabel)
        .then((res) => {
          if (res.quiz?.questions && res.quiz.questions.length > 0) {
            setQuestions(res.quiz.questions);
          }
        })
        .catch(() => {
          setQuestions(FALLBACK_QUESTIONS);
        });
    }
  }, [isOpen, goalLabel]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || FALLBACK_QUESTIONS[0];

  const handleOptionSelect = (optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      const answersArray = questions.map((q, idx) => ({
        questionId: q._id || q.id,
        questionIndex: idx,
        selectedIndex: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : 0,
      }));

      try {
        const res = await api.quizzes.submit(answersArray, goalLabel);
        setScoreResult(res.score !== undefined ? res.score : calculateScore());
        if (res.userXP) {
          setXPAbsolute(res.userXP);
        } else {
          addXP(res.earnedXP || 100);
        }
      } catch (err) {
        console.warn("Quiz submission fallback active:", err.message);
        setScoreResult(calculateScore());
        addXP(100);
      } finally {
        setIsSubmitting(false);
        setIsCompleted(true);
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      const correct = q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.answer;
      if (selectedAnswers[idx] === correct) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setScoreResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 sm:p-8">
        <button
          onClick={handleReset}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {!isCompleted ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Skill Assessment Quiz
                </h3>
                <p className="text-xs text-gray-500">
                  Question {currentIdx + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-gray-900 leading-snug">
                {currentQ.question}
              </h4>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`w-full text-left rounded-2xl p-4 text-sm font-medium border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-violet-50 border-violet-500 text-violet-900 font-semibold shadow-xs"
                          : "bg-gray-50/70 border-gray-200 text-gray-800 hover:bg-violet-50/40"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-violet-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">
                Answer to earn +100 XP
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={selectedAnswers[currentIdx] === undefined || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700 disabled:opacity-40 transition-all active:scale-98"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                {currentIdx < questions.length - 1 ? "Next Question" : isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Award className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900">Quiz Completed!</h3>
            <p className="text-sm text-gray-600">
              You scored <span className="font-bold text-violet-600">{scoreResult !== null ? scoreResult : calculateScore()}</span> out of {questions.length} questions correctly.
            </p>

            <div className="inline-block rounded-2xl bg-amber-50 px-6 py-3 border border-amber-200 text-amber-700 font-bold text-sm">
              🎉 +100 XP Added to Your Profile!
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition-all active:scale-98"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
