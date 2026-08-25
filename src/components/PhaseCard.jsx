import { useState } from "react";
import { ChevronUp, ChevronDown, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";

function TaskTypeBadge({ type }) {
  if (!type) return null;
  const styleMap = {
    theory: "bg-purple-100/80 text-purple-700 border-purple-200/60",
    practice: "bg-sky-100/80 text-sky-700 border-sky-200/60",
    project: "bg-amber-100/80 text-amber-700 border-amber-200/60",
    review: "bg-emerald-100/80 text-emerald-700 border-emerald-200/60",
  };
  const labelMap = {
    theory: "Theory",
    practice: "Practice",
    project: "Project",
    review: "Review",
  };
  const cls = styleMap[type.toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
  const label = labelMap[type.toLowerCase()] || type;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
}

function TaskRow({ task, onToggle }) {
  const taskId = task._id || task.id;
  const minutes = task.estimatedMinutes;

  return (
    <li
      onClick={() => onToggle && onToggle(taskId)}
      className="flex cursor-pointer items-center justify-between gap-3.5 border-t border-gray-100 px-6 py-4 first:border-t-0 hover:bg-violet-50/40 transition-all select-none group"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {task.completed ? (
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-emerald-500"
            strokeWidth={2.2}
          />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-violet-400 transition-colors" strokeWidth={2} />
        )}

        <div className="min-w-0 flex-1">
          <span
            className={[
              "text-sm font-medium transition-colors block",
              task.completed ? "text-gray-400 line-through" : "text-gray-800 group-hover:text-violet-950 font-semibold",
            ].join(" ")}
          >
            {task.title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <TaskTypeBadge type={task.type} />

        {minutes && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <Clock className="h-3 w-3" />
            {minutes}m
          </span>
        )}

        <span
          className={[
            "text-xs font-bold px-2.5 py-1 rounded-full border transition-all",
            task.completed
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-violet-50 text-violet-600 border-violet-200/70 group-hover:bg-violet-600 group-hover:text-white",
          ].join(" ")}
        >
          +{task.xp || 50} XP
        </span>
      </div>
    </li>
  );
}

export default function PhaseCard({ phase, status, onToggleTask }) {
  const [open, setOpen] = useState(true);
  const tasks = phase.tasks || [];
  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left bg-gradient-to-r from-white via-white to-gray-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600">
              {phase.phaseName || phase.phase || `PHASE ${phase.phaseNumber || 1}`}
            </span>
            <span className="text-xs font-semibold text-gray-400">·</span>
            <span className="text-xs font-medium text-gray-500">{phase.duration}</span>
            {status === "done" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Completed
              </span>
            )}
          </div>

          <h3 className="mt-1 text-lg font-extrabold text-gray-900 leading-snug">
            {phase.title}
          </h3>

          {phase.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {phase.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0 pt-1">
          <div className="text-right leading-tight">
            <p className="text-sm font-bold text-gray-900">
              {done}/{total}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">topics done</p>
          </div>

          <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-gray-100 sm:block">
            <div
              className={[
                "h-full rounded-full transition-all duration-500",
                percent === 100
                  ? "bg-emerald-500"
                  : percent > 0
                  ? "bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-600"
                  : "bg-gray-200",
              ].join(" ")}
              style={{ width: `${percent}%` }}
            />
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>

      {open && (
        <ul className="border-t border-gray-100 bg-white">
          {tasks.map((task, idx) => (
            <TaskRow key={task._id || task.id || idx} task={task} onToggle={onToggleTask} />
          ))}
        </ul>
      )}
    </div>
  );
}
