import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeaderData } from "../context/HeaderContext";
import { domainTopics } from "../data/dummyData";

export default function RoadmapList() {
  const navigate = useNavigate();
  const { addXP, goalLabel } = useHeaderData();

  const getInitialItems = (goal) => {
    return domainTopics[goal] || domainTopics["Backend Developer"];
  };

  const [items, setItems] = useState(() => getInitialItems(goalLabel));

  useEffect(() => {
    setItems(getInitialItems(goalLabel));
  }, [goalLabel]);

  const toggleItem = (itemId) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextCompleted = !item.completed;
          if (nextCompleted) {
            addXP(item.xp);
          }
          return { ...item, completed: nextCompleted };
        }
        return item;
      })
    );
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Up Next on Your Roadmap
          </h3>
          <p className="text-xs text-gray-500">Click any topic to complete it and earn XP</p>
        </div>
        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition-all"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3.5 hover:bg-violet-50/50 hover:border-violet-200 transition-all select-none"
          >
            {item.completed ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" fill="currentColor" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-gray-300" strokeWidth={2} />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${
                  item.completed ? "text-gray-400 line-through" : "text-gray-900"
                }`}
              >
                {item.title}
              </p>
              <p
                className={`text-xs ${
                  item.completed ? "text-emerald-500 font-semibold" : "text-violet-600"
                }`}
              >
                {item.completed ? "Completed!" : `+${item.xp} XP on completion`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
