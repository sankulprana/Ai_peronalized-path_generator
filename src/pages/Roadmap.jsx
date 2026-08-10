import { useState, useEffect } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import PhaseCard from "../components/PhaseCard";
import { roadmapMeta as fallbackMeta, roadmapPhases as fallbackPhases } from "../data/dummyData";
import { useHeaderData, usePageHeader } from "../context/HeaderContext";
import { api } from "../services/api";

function phaseStatus(phases, phase) {
  const isComplete = phase.tasks.every((t) => t.completed);
  if (isComplete) return "done";
  const firstIncomplete = phases.find((p) =>
    p.tasks.some((t) => !t.completed)
  );
  return firstIncomplete?.id === phase.id || firstIncomplete?.phaseNumber === phase.phaseNumber ? "active" : "upcoming";
}

export default function Roadmap() {
  const { goalLabel = "Backend Developer" } = useHeaderData();
  const [meta, setMeta] = useState({ ...fallbackMeta, goalLabel });
  const [phases, setPhases] = useState(fallbackPhases);
  const [roadmapId, setRoadmapId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  usePageHeader({
    pageTitle: "Roadmap",
    goalLabel: meta.goalLabel || goalLabel || "Backend Developer",
  });

  const loadRoadmap = async () => {
    try {
      const res = await api.roadmaps.getAll();
      if (res.roadmaps && res.roadmaps.length > 0) {
        const current = res.roadmaps.find((r) => r.isCurrent) || res.roadmaps[0];
        setRoadmapId(current._id);
        setMeta({
          title: current.title,
          goalLabel: current.targetRole,
          topicsDone: current.topicsCompleted || 0,
          topicsTotal: current.topicsTotal || 12,
        });
        if (current.phases) {
          setPhases(current.phases);
        }
      }
    } catch (err) {
      console.warn("Using offline fallback roadmap data:", err.message);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.roadmaps.generate({
        targetRole: meta.goalLabel || "Backend Developer",
        skillLevel: "intermediate",
        durationWeeks: 8,
      });
      if (res.roadmap) {
        setRoadmapId(res.roadmap._id);
        setMeta({
          title: res.roadmap.title,
          goalLabel: res.roadmap.targetRole,
          topicsDone: res.roadmap.topicsCompleted || 0,
          topicsTotal: res.roadmap.topicsTotal || 12,
        });
        setPhases(res.roadmap.phases || fallbackPhases);
      }
    } catch (err) {
      console.error("Regeneration error:", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!roadmapId) {
      // Offline local toggle
      setPhases((prev) =>
        prev.map((phase) => ({
          ...phase,
          tasks: phase.tasks.map((t) =>
            t.id === taskId || t._id === taskId ? { ...t, completed: !t.completed } : t
          ),
        }))
      );
      return;
    }
    try {
      const res = await api.roadmaps.toggleTask(roadmapId, taskId);
      if (res.task) {
        loadRoadmap();
      }
    } catch (err) {
      console.error("Task toggle error:", err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {meta.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Goal: {meta.goalLabel} · {meta.topicsDone}/
            {meta.topicsTotal} topics done
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 self-start rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-100 disabled:opacity-50 sm:self-auto transition-all"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          {isGenerating ? "Generating AI Path..." : "Regenerate"}
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gray-200" />

        <ol className="flex flex-col gap-6">
          {phases.map((phase, idx) => {
            const status = phaseStatus(phases, phase);
            return (
              <li key={phase._id || phase.id || idx} className="relative flex gap-6 pl-0">
                <span className="relative z-10 mt-7 flex h-5 w-5 shrink-0 items-center justify-center">
                  <span
                    className={[
                      "block h-3.5 w-3.5 rounded-full",
                      status === "upcoming"
                        ? "border-2 border-gray-300 bg-white"
                        : "bg-violet-600",
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
