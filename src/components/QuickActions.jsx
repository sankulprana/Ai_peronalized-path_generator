import { quickActions } from "../data/dummyData";

const COLOR_MAP = {
  purple: "bg-violet-100 text-violet-600",
  blue: "bg-sky-100 text-sky-500",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-amber-100 text-amber-500",
  pink: "bg-pink-100 text-pink-500",
};

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>

      <ul className="flex flex-col gap-1.5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.title}>
              <button className="flex w-full items-center gap-3.5 rounded-xl px-1.5 py-2.5 text-left transition-colors hover:bg-gray-50">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLOR_MAP[action.color]}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
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
