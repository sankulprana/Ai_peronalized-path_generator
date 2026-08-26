import { useState, useEffect } from "react";
import { Zap, Flame, CheckCircle2, RotateCcw } from "lucide-react";
import { useHeaderData } from "../context/HeaderContext";
import { getRoadmapForRole } from "../data/dummyData";
import { api } from "../services/api";

export default function GoalCard() {
  const { xp = 0, streak = 0, goalLabel = "Backend Developer", openGoalModal, setXPAbsolute } = useHeaderData();
  const [topicsStats, setTopicsStats] = useState(() => {
    const local = getRoadmapForRole(goalLabel);
    return { done: local.topicsDone || 0, total: local.topicsTotal || 12 };
  });

  useEffect(() => {
    const local = getRoadmapForRole(goalLabel);
    setTopicsStats({ done: local.topicsDone || 0, total: local.topicsTotal || 12 });

    if (setXPAbsolute) {
      setXPAbsolute(local.earnedXP || 0);
    }

    api.roadmaps
      .getAll()
      .then((res) => {
        if (res.roadmaps && res.roadmaps.length > 0) {
          const current = res.roadmaps.find((r) => r.isCurrent || r.targetRole?.toLowerCase() === goalLabel.toLowerCase()) || res.roadmaps[0];
          setTopicsStats({
            done: current.topicsCompleted !== undefined ? current.topicsCompleted : local.topicsDone || 0,
            total: current.topicsTotal || local.topicsTotal || 12,
          });
        }
      })
      .catch(() => {});
  }, [goalLabel]);

  const activePathDone = topicsStats.done || 0;
  const activePathTotal = topicsStats.total || 12;

  // Level progress directly driven by earned XP
  const level = Math.floor((xp || 0) / 300) + 1;
  const xpInCurrentLevel = (xp || 0) % 300;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 300) * 100)));
  const xpNeededForNext = 300 - xpInCurrentLevel;

  const stats = [
    { label: "Total XP", value: `${xp || 0}` },
    { label: "Day Streak", value: `${streak}` },
    { label: "Topics Done", value: `${activePathDone}/${activePathTotal}` },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300 border border-violet-400/30">
              Current Active Goal
            </span>
            <button
              onClick={openGoalModal}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              Change Goal
            </button>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-[28px]">
            Master {goalLabel}
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Keep pushing — you're making solid progress on your personalized AI path.
          </p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-200">Level {level} · {level >= 3 ? "Expert" : "Learner"}</span>
                <span className="font-bold text-violet-300">{progressPercent}%</span>
              </div>
            <div className="h-2.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Next Level: {xpNeededForNext} XP needed
            </p>
          </div>
        </div>

        {/* Mini stat tiles */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = i === 0 ? Zap : i === 1 ? Flame : CheckCircle2;
            return (
              <div
                key={stat.label}
                className="flex w-[90px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/5 p-4 text-center border border-white/10 backdrop-blur-xs sm:w-[105px]"
              >
                <Icon className="h-5 w-5 text-violet-400" strokeWidth={2} />
                <span className="text-lg font-extrabold text-white sm:text-xl">
                  {stat.value}
                </span>
                <span className="text-[11px] leading-tight text-slate-300">
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
