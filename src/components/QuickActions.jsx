import { useNavigate } from "react-router-dom";
import { useHeaderData } from "../context/HeaderContext";
import { Brain, Map, Calendar, HelpCircle, BookOpen } from "lucide-react";

const ACTIONS = [
  {
    title: "Take Skill Quiz",
    subtitle: "Assess your level & earn +100 XP",
    icon: Brain,
    color: "bg-violet-100 text-violet-600",
    action: "quiz",
  },
  {
    title: "View Roadmap",
    subtitle: "See full personalized learning path",
    icon: Map,
    color: "bg-sky-100 text-sky-600",
    path: "/roadmap",
  },
  {
    title: "Study Planner",
    subtitle: "View & track daily sessions",
    icon: Calendar,
    color: "bg-emerald-100 text-emerald-600",
    path: "/study-planner",
  },
  {
    title: "Ask AI Doubt",
    subtitle: "Instant doubt resolution mentor",
    icon: HelpCircle,
    color: "bg-amber-100 text-amber-600",
    path: "/doubt-solver",
  },
  {
    title: "View Resources",
    subtitle: "Curated videos, docs & guides",
    icon: BookOpen,
    color: "bg-pink-100 text-pink-600",
    path: "/resources",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { openQuizModal } = useHeaderData();

  const handleAction = (item) => {
    if (item.action === "quiz") {
      openQuizModal();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>

      <ul className="flex flex-col gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.title}>
              <button
                onClick={() => handleAction(action)}
                className="flex w-full items-center gap-3.5 rounded-2xl p-2.5 text-left transition-all hover:bg-violet-50/60 active:scale-98"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${action.color}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {action.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
