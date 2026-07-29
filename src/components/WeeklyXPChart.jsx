import { weeklyXP } from "../data/dummyData";

export default function WeeklyXPChart() {
  const max = Math.max(...weeklyXP.map((w) => w.value));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Weekly XP Activity</h3>
        <span className="text-sm text-gray-400">Last 8 weeks</span>
      </div>

      <div className="flex h-48 items-end justify-between gap-3 sm:gap-6">
        {weeklyXP.map((w) => (
          <div
            key={w.week}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className="w-full max-w-[38px] rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all"
              style={{ height: `${(w.value / max) * 100}%` }}
              role="img"
              aria-label={`${w.week}: ${w.value} XP`}
            />
            <span className="text-xs font-medium text-gray-400">
              {w.week}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
