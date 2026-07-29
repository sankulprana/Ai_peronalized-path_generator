import { useState } from "react";
import { ChevronUp, ChevronDown, CheckCircle2, Circle } from "lucide-react";

function TaskRow({ task }) {
  return (
    <li className="flex items-center gap-3.5 border-t border-gray-100 px-6 py-4 first:border-t-0">
      {task.completed ? (
        <CheckCircle2
          className="h-5 w-5 shrink-0 text-emerald-500"
          strokeWidth={2}
          fill="currentColor"
        />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-gray-300" strokeWidth={2} />
      )}

      <span
        className={[
          "flex-1 text-[15px]",
          task.completed ? "text-gray-400 line-through" : "text-gray-800",
        ].join(" ")}
      >
        {task.title}
      </span>

      <span
        className={[
          "text-sm font-semibold",
          task.completed ? "text-emerald-500" : "text-violet-500",
        ].join(" ")}
      >
        +{task.xp} XP
      </span>
    </li>
  );
}

export default function PhaseCard({ phase, status }) {
  const [open, setOpen] = useState(true);
  const done = phase.tasks.filter((t) => t.completed).length;
  const total = phase.tasks.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            {phase.phase} <span className="text-gray-400">· {phase.duration}</span>
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            {phase.title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {done}/{total}
            </p>
            <p className="text-xs text-gray-400">done</p>
          </div>

          <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-gray-100 sm:block">
            <div
              className={[
                "h-full rounded-full",
                percent > 0
                  ? "bg-gradient-to-r from-sky-400 to-violet-500"
                  : "bg-gray-200",
              ].join(" ")}
              style={{ width: `${percent}%` }}
            />
          </div>

          <span className="text-gray-400">
            {open ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </span>
        </div>
      </button>

      {open && (
        <ul className="border-t border-gray-100">
          {phase.tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
