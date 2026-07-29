import { Zap, Flame, CheckCircle2 } from "lucide-react";
import { goal } from "../data/dummyData";

const statIcons = [Zap, Flame, CheckCircle2];

export default function GoalCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-200 via-slate-400 to-slate-600 p-6 sm:p-8">
      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-100">
            Current Goal
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-[28px]">
            {goal.heading}
          </h2>
          <p className="mt-2 text-sm text-slate-200">{goal.subtext}</p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{goal.level}</span>
              <span className="font-semibold text-slate-950">
                {goal.progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-violet-200/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400"
                style={{ width: `${goal.progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-200">
              Next: {goal.nextLevel} · {goal.xpNeeded.toLocaleString()} XP needed
            </p>
          </div>
        </div>

        {/* Mini stat tiles */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {goal.stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <div
                key={stat.label}
                className="flex w-[90px] flex-col items-center justify-center gap-1 rounded-2xl bg-slate-950/20 px-3 py-4 text-center shadow-sm sm:w-[100px]"
              >
                <Icon className="h-5 w-5 text-violet-300" strokeWidth={2} />
                <span className="text-lg font-extrabold text-violet-100 sm:text-xl">
                  {stat.value}
                </span>
                <span className="text-[11px] leading-tight text-violet-200">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
