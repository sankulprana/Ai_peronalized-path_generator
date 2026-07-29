import { RotateCcw } from "lucide-react";
import PhaseCard from "../components/PhaseCard";
import { roadmapMeta, roadmapPhases } from "../data/dummyData";
import { usePageHeader } from "../context/HeaderContext";

function phaseStatus(phases, phase) {
  const isComplete = phase.tasks.every((t) => t.completed);
  if (isComplete) return "done";
  const firstIncomplete = phases.find((p) =>
    p.tasks.some((t) => !t.completed)
  );
  return firstIncomplete?.id === phase.id ? "active" : "upcoming";
}

export default function Roadmap() {
  usePageHeader({
    pageTitle: "Roadmap",
    goalLabel: "Backend Developer",
    streak: 12,
    xp: 420,
    user: { name: "Alex Chen", title: "Learner · Lv.3", initial: "A" },
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {roadmapMeta.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Goal: {roadmapMeta.goalLabel} · {roadmapMeta.topicsDone}/
            {roadmapMeta.topicsTotal} topics done
          </p>
        </div>

        <button className="flex items-center gap-1.5 self-start rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-100 sm:self-auto">
          <RotateCcw className="h-4 w-4" />
          Regenerate
        </button>
      </div>

      <div className="relative">
        {/* Connecting timeline line */}
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gray-200" />

        <ol className="flex flex-col gap-6">
          {roadmapPhases.map((phase) => {
            const status = phaseStatus(roadmapPhases, phase);
            return (
              <li key={phase.id} className="relative flex gap-6 pl-0">
                {/* Timeline dot */}
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
                  <PhaseCard phase={phase} status={status} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
