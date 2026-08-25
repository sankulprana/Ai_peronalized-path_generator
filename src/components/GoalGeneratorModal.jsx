import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, Target, BarChart2, Calendar, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { useHeaderData } from "../context/HeaderContext";

const SUGGESTED_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Fullstack Engineer",
  "AI Engineer",
  "Mobile Developer",
  "DevOps Specialist",
  "Cybersecurity",
  "Data Engineer",
  "Cloud Architect",
];

export default function GoalGeneratorModal({ isOpen, onClose }) {
  const [targetRole, setTargetRole] = useState("Backend Developer");
  const [customRole, setCustomRole] = useState("");
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [durationWeeks, setDurationWeeks] = useState("8");
  const [isGenerating, setIsGenerating] = useState(false);
  const { updateGoal } = useHeaderData();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chosenRole = customRole.trim() || targetRole;
    setIsGenerating(true);

    try {
      await api.roadmaps.generate({
        targetRole: chosenRole,
        skillLevel,
        durationWeeks: parseInt(durationWeeks, 10),
      });
      updateGoal(chosenRole);
      onClose();
      navigate("/roadmap");
    } catch (err) {
      console.warn("Generating path fallback:", err.message);
      updateGoal(chosenRole);
      onClose();
      navigate("/roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Create AI Learning Path
            </h3>
            <p className="text-xs text-gray-500">
              Generate a personalized step-by-step roadmap
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Target Role Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Target Career Role
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setTargetRole(role);
                    setCustomRole("");
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                    targetRole === role && !customRole
                      ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="relative">
              <Target className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Or type custom role (e.g. Cybersecurity Specialist)..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Skill Level & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="relative">
                <BarChart2 className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 bg-white"
                >
                  <option value="beginner">Beginner (Foundations)</option>
                  <option value="intermediate">Intermediate (Practitioner)</option>
                  <option value="advanced">Advanced (Mastery)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Target Timeframe
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 bg-white"
                >
                  <option value="4">4 Weeks (Sprint)</option>
                  <option value="8">8 Weeks (Standard)</option>
                  <option value="12">12 Weeks (Deep Dive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700 disabled:opacity-50 transition-all active:scale-98"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Generating Path...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Path
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
