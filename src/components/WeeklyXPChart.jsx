import { weeklyXP as fallbackWeeklyXP } from "../data/dummyData";

export default function WeeklyXPChart({ data }) {
  const chartData = data && data.length > 0 ? data : fallbackWeeklyXP;
  const max = Math.max(...chartData.map((w) => w.value || w.xp || 10), 10);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Weekly XP Activity</h3>
        <span className="text-sm text-gray-400">Last 8 weeks</span>
      </div>

      <div className="flex h-48 items-end justify-between gap-3 sm:gap-6">
        {chartData.map((w) => {
          const val = w.value !== undefined ? w.value : w.xp || 0;
          return (
            <div
              key={w.week}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full max-w-[38px] rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all"
                style={{ height: `${Math.max(5, (val / max) * 100)}%` }}
                role="img"
                aria-label={`${w.week}: ${val} XP`}
              />
              <span className="text-xs font-medium text-gray-400">
                {w.week}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
