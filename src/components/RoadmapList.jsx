import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeaderData } from "../context/HeaderContext";
import { getRoadmapForRole } from "../data/dummyData";
import { api } from "../services/api";

export default function RoadmapList({ roadmapItems: customItems, activeRoadmapId }) {
  const navigate = useNavigate();
  const { addXP, goalLabel = "Backend Developer" } = useHeaderData();

  const getInitialItems = (goal) => {
    const roadmap = getRoadmapForRole(goal);
    const tasks = [];
    for (const phase of roadmap.phases || []) {
      for (const task of phase.tasks || []) {
        tasks.push({
          id: task._id || task.id,
          title: task.title,
          xp: task.xp,
          completed: task.completed || false,
        });
        if (tasks.length >= 5) break;
      }
      if (tasks.length >= 5) break;
    }
    return tasks;
  };

  const [items, setItems] = useState(() => customItems || getInitialItems(goalLabel));
  const [currentRoadmapId, setCurrentRoadmapId] = useState(activeRoadmapId || null);

  useEffect(() => {
    if (customItems && customItems.length > 0) {
      setItems(customItems);
      return;
    }

    // Try fetching active roadmap tasks from backend
    api.roadmaps
      .getAll()
      .then((res) => {
        if (res.roadmaps && res.roadmaps.length > 0) {
          const current = res.roadmaps.find((r) => r.isCurrent) || res.roadmaps[0];
          setCurrentRoadmapId(current._id);
          const tasks = [];
          for (const phase of current.phases || []) {
            for (const task of phase.tasks || []) {
              tasks.push({
                id: task._id || task.id,
                title: task.title,
                xp: task.xp,
                completed: task.completed,
              });
              if (tasks.length >= 5) break;
            }
            if (tasks.length >= 5) break;
          }
          if (tasks.length > 0) {
            setItems(tasks);
          }
        } else {
          setItems(getInitialItems(goalLabel));
        }
      })
      .catch(() => {
        setItems(getInitialItems(goalLabel));
      });
  }, [goalLabel, customItems]);

  const toggleItem = async (itemId) => {
    const targetItem = items.find((it) => it.id === itemId || it._id === itemId);
    const nextCompleted = !targetItem?.completed;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId || item._id === itemId) {
          return { ...item, completed: nextCompleted };
        }
        return item;
      })
    );

    // Persist completed task ID locally
    const savedIds = new Set(JSON.parse(localStorage.getItem("pathai_completed_tasks") || "[]"));
    const idStr = (itemId || targetItem?.id || targetItem?._id)?.toString();
    if (idStr) {
      if (nextCompleted) {
        savedIds.add(idStr);
      } else {
        savedIds.delete(idStr);
      }
      localStorage.setItem("pathai_completed_tasks", JSON.stringify(Array.from(savedIds)));
    }

    if (targetItem) {
      if (nextCompleted) {
        addXP(targetItem.xp || 50);
      } else {
        addXP(-(targetItem.xp || 50));
      }
    }

    if (currentRoadmapId) {
      try {
        await api.roadmaps.toggleTask(currentRoadmapId, itemId);
      } catch (err) {
        console.warn("Backend task toggle fallback:", err.message);
      }
    }
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
