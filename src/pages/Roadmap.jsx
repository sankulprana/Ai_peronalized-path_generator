import { useState, useEffect } from "react";
import { RotateCcw, Loader2, Sparkles, Target, Award, Compass, CheckCircle2, ChevronRight } from "lucide-react";
import PhaseCard from "../components/PhaseCard";
import { getRoadmapForRole } from "../data/dummyData";
import { useHeaderData, usePageHeader } from "../context/HeaderContext";
import { api } from "../services/api";

const QUICK_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Fullstack Engineer",
  "AI Engineer",
  "Mobile Developer",
  "DevOps Specialist",
  "Cybersecurity",
];

function phaseStatus(phases, phase) {
  const tasks = phase.tasks || [];
  const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);
  if (isComplete) return "done";
  const firstIncomplete = phases.find((p) =>
    (p.tasks || []).some((t) => !t.completed)
  );
  return firstIncomplete?.id === phase.id || firstIncomplete?.phaseNumber === phase.phaseNumber ? "active" : "upcoming";
}

export default function Roadmap() {
  const { goalLabel = "Backend Developer", addXP, setXPAbsolute, updateGoal, openGoalModal } = useHeaderData();

  // Instant optimistic initialization tailored to the active goal
  const initialData = getRoadmapForRole(goalLabel);
  const [meta, setMeta] = useState({
    title: initialData.title,
    goalLabel,
    topicsDone: initialData.topicsDone,
    topicsTotal: initialData.topicsTotal,
    durationWeeks: initialData.durationWeeks || 8,
  });
  const [phases, setPhases] = useState(initialData.phases);
  const [roadmapId, setRoadmapId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  usePageHeader({
    pageTitle: "Roadmap",
    goalLabel: meta.goalLabel || goalLabel || "Backend Developer",
  });

  const loadRoadmapForGoal = async (targetGoal) => {
    // 1. Immediately render client-synthesized AI path for the exact goal
    const localData = getRoadmapForRole(targetGoal);
    setMeta({
      title: localData.title,
      goalLabel: targetGoal,
      topicsDone: localData.topicsDone,
      topicsTotal: localData.topicsTotal,
      durationWeeks: localData.durationWeeks || 8,
    });
    setPhases(localData.phases);
    if (localData.topicsDone === 0) {
      setXPAbsolute(0);
    }

    // 2. Fetch saved roadmaps or request backend AI generation
    try {
      const res = await api.roadmaps.getAll(targetGoal);
      const matchingRoadmap = res.roadmaps?.find(
        (r) => r.targetRole?.toLowerCase() === targetGoal?.toLowerCase()
      );

      if (matchingRoadmap) {
        setRoadmapId(matchingRoadmap._id);
        setMeta({
          title: matchingRoadmap.title || localData.title,
          goalLabel: matchingRoadmap.targetRole || targetGoal,
          topicsDone: matchingRoadmap.topicsCompleted || 0,
          topicsTotal: matchingRoadmap.topicsTotal || localData.topicsTotal,
          durationWeeks: matchingRoadmap.durationWeeks || 8,
        });
        if (matchingRoadmap.phases && matchingRoadmap.phases.length > 0) {
          setPhases(matchingRoadmap.phases);
        }
      } else {
        // Generate a new AI roadmap for this path
        setIsGenerating(true);
        const genRes = await api.roadmaps.generate({
          targetRole: targetGoal,
          skillLevel: "intermediate",
          durationWeeks: 8,
        });
        if (genRes.roadmap) {
          setRoadmapId(genRes.roadmap._id);
          setMeta({
            title: genRes.roadmap.title,
            goalLabel: genRes.roadmap.targetRole,
            topicsDone: genRes.roadmap.topicsCompleted || 0,
            topicsTotal: genRes.roadmap.topicsTotal || localData.topicsTotal,
            durationWeeks: genRes.roadmap.durationWeeks || 8,
          });
          if (genRes.roadmap.phases) {
            setPhases(genRes.roadmap.phases);
          }
        }
      }
    } catch (err) {
      console.warn("Using offline AI curriculum generator:", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadRoadmapForGoal(goalLabel);
  }, [goalLabel]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.roadmaps.generate({
        targetRole: meta.goalLabel || goalLabel,
        skillLevel: "intermediate",
        durationWeeks: meta.durationWeeks || 8,
      });
      if (res.roadmap) {
        setRoadmapId(res.roadmap._id);
        setMeta({
          title: res.roadmap.title,
          goalLabel: res.roadmap.targetRole,
          topicsDone: res.roadmap.topicsCompleted || 0,
          topicsTotal: res.roadmap.topicsTotal || 12,
          durationWeeks: res.roadmap.durationWeeks || 8,
        });
        setPhases(res.roadmap.phases || getRoadmapForRole(meta.goalLabel).phases);
      }
    } catch (err) {
      console.warn("Regeneration offline fallback:", err.message);
      const fallback = getRoadmapForRole(meta.goalLabel);
      setPhases(fallback.phases);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    let toggledTask = null;
    let nextCompleted = false;

    // Optimistically toggle locally
    setPhases((prev) =>
      prev.map((phase) => {
        const tasks = phase.tasks || [];
        const nextTasks = tasks.map((t) => {
          if (t.id === taskId || t._id === taskId) {
            toggledTask = t;
            nextCompleted = !t.completed;
            return { ...t, completed: nextCompleted };
          }
          return t;
        });
        return { ...phase, tasks: nextTasks };
      })
    );

    // Update topics done count in meta
    setMeta((prev) => {
      const allTasks = phases.flatMap((p) => p.tasks || []);
      const newDone = allTasks.filter((t) => (t.id === taskId || t._id === taskId ? nextCompleted : t.completed)).length;
      return { ...prev, topicsDone: newDone };
    });

    // Persist task ID and Title in localStorage
    const savedIds = new Set(JSON.parse(localStorage.getItem("pathai_completed_tasks") || "[]"));
    const idStr = taskId?.toString();
    const titleStr = toggledTask?.title;
    if (nextCompleted) {
      if (idStr) savedIds.add(idStr);
      if (titleStr) savedIds.add(titleStr);
    } else {
      if (idStr) savedIds.delete(idStr);
      if (titleStr) savedIds.delete(titleStr);
    }
    localStorage.setItem("pathai_completed_tasks", JSON.stringify(Array.from(savedIds)));

    if (toggledTask) {
      if (nextCompleted) {
        addXP(toggledTask.xp || 60);
      } else {
        addXP(-(toggledTask.xp || 60));
      }
    }

    if (!roadmapId || roadmapId.toString().startsWith("guest_")) return;

    try {
      const res = await api.roadmaps.toggleTask(roadmapId, taskId);
      if (res.userXP !== undefined) {
        setXPAbsolute(res.userXP);
      }
      if (res.roadmapProgress) {
        setMeta((prev) => ({
          ...prev,
          topicsDone: res.roadmapProgress.topicsCompleted,
          topicsTotal: res.roadmapProgress.topicsTotal,
        }));
      }
    } catch (err) {
      console.error("Task toggle sync error:", err.message);
    }
  };

  const totalXP = phases.reduce(
    (acc, phase) => acc + (phase.tasks || []).reduce((tAcc, t) => tAcc + (t.xp || 50), 0),
    0
  );

  const doneCount = phases.reduce(
    (acc, phase) => acc + (phase.tasks || []).filter((t) => t.completed).length,
    0
  );

  const totalCount = phases.reduce(
    (acc, phase) => acc + (phase.tasks?.length || 0),
    0
  );

  const overallProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Path AI Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300 border border-violet-400/30">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                AI-Generated Curriculum
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                {meta.durationWeeks || 8} Weeks Duration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {meta.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tailored step-by-step learning progression crafted by PathAI. Complete milestones, gain real XP, and master production skills.
            </p>

            {/* Overall Progress Bar */}
            <div className="pt-2 max-w-md space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Curriculum Progress</span>
                <span className="text-violet-300 font-bold">{overallProgress}% ({doneCount}/{totalCount} topics)</span>
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Action Box & Stats */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Potential XP</p>
                <p className="text-lg font-bold text-white">+{totalXP} XP</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700 disabled:opacity-50 transition-all active:scale-98"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Regenerate AI"}
              </button>

              <button
                onClick={openGoalModal}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all active:scale-98"
              >
                <Target className="h-4 w-4" />
                <span>New Path</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Role Switcher Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-violet-600" />
            Switch Path / Explore Domain Paths
          </span>
          <button
            onClick={openGoalModal}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
          >
            + Custom Role...
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_ROLES.map((role) => {
            const isActive = goalLabel?.toLowerCase() === role.toLowerCase();
            return (
              <button
                key={role}
                onClick={() => updateGoal(role)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all border shrink-0 ${
                  isActive
                    ? "bg-violet-600 text-white border-violet-600 shadow-xs ring-2 ring-violet-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Generating Indicator Alert */}
      {isGenerating && (
        <div className="flex items-center gap-3 rounded-2xl bg-violet-50 border border-violet-200 p-4 text-violet-900 animate-pulse shadow-xs">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">PathAI is synthesizing a personalized curriculum for "{meta.goalLabel}"...</span>
            <p className="text-violet-700 text-xs mt-0.5">Structuring phases, estimated hours, and topic assessments.</p>
          </div>
        </div>
      )}

      {/* Timeline Phases List */}
      <div className="relative pt-2">
        <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-200" />

        <ol className="flex flex-col gap-6">
          {phases.map((phase, idx) => {
            const status = phaseStatus(phases, phase);
            return (
              <li key={phase._id || phase.id || idx} className="relative flex gap-5 sm:gap-6 pl-0">
                <span className="relative z-10 mt-7 flex h-6 w-6 shrink-0 items-center justify-center">
                  <span
                    className={[
                      "block rounded-full transition-all",
                      status === "done"
                        ? "h-4 w-4 bg-emerald-500 ring-4 ring-emerald-100"
                        : status === "active"
                        ? "h-4 w-4 bg-violet-600 ring-4 ring-violet-100 animate-pulse"
                        : "h-3.5 w-3.5 border-2 border-gray-300 bg-white",
                    ].join(" ")}
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <PhaseCard phase={phase} status={status} onToggleTask={handleToggleTask} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
