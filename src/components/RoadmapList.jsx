import { ArrowRight } from "lucide-react";
import { roadmapItems } from "../data/dummyData";

export default function RoadmapList() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Up Next on Your Roadmap
        </h3>
        <button className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {roadmapItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-xl bg-gray-50 px-4 py-3.5"
          >
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                item.active
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 text-gray-500",
              ].join(" ")}
            >
              {item.id}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {item.title}
              </p>
              <p className="text-xs text-gray-500">
                +{item.xp} XP on completion
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
