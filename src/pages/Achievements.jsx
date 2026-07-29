import { usePageHeader } from "../context/HeaderContext";
import { achievementsData } from "../data/dummyData";
import { Zap, CheckCircle2, Lock } from "lucide-react";

export default function Achievements() {
  usePageHeader({
    pageTitle: "Achievements",
    goalLabel: "Backend Developer",
  });

  const { currentLevel, levelProgression, badges } = achievementsData;

  const getLevelPillStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500 text-white shadow-xs";
      case "active":
        return "bg-sky-400 text-white shadow-md ring-4 ring-sky-100";
      default:
        return "bg-gray-100 text-gray-400";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {achievementsData.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {achievementsData.subtitle}
        </p>
      </div>

      {/* Main Level 3 Learner Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Lightning Icon Box */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-200/90 text-amber-500 shadow-inner">
              <Zap className="h-9 w-9 fill-amber-500" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                LEVEL {currentLevel.levelNum}
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-0.5">
                {currentLevel.levelName}
              </h3>
            </div>
          </div>

          {/* XP Progress */}
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>{currentLevel.xpNeeded} XP until {currentLevel.nextLevelName}</span>
              <span>
                {currentLevel.currentXP} / {currentLevel.maxXP} XP
              </span>
            </div>
            <div className="h-3 w-full bg-slate-500/50 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-500"
                style={{
                  width: `${(currentLevel.currentXP / currentLevel.maxXP) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Progression Timeline */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Level Progression</h3>

        <div className="flex items-center justify-between relative px-2 overflow-x-auto py-2">
          {/* Connector Line */}
          <div className="absolute left-6 right-6 top-7 h-0.5 bg-gray-100 -z-0" />

          {levelProgression.map((item) => (
            <div
              key={item.level}
              className="flex flex-col items-center gap-2 relative z-10 min-w-[70px]"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-transform ${getLevelPillStyle(
                  item.status
                )}`}
              >
                {item.level}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-bold ${
                    item.status === "active"
                      ? "text-gray-900"
                      : item.status === "completed"
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.xp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Badges</h3>
          <span className="text-xs font-semibold text-gray-400">
            {badges.earnedCount} / {badges.totalCount} earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.list.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-5 flex flex-col items-center text-center transition-all ${
                badge.earned
                  ? "bg-purple-50/50 border border-purple-100 hover:border-purple-200 shadow-2xs"
                  : "bg-gray-50/40 border border-gray-100 opacity-60"
              }`}
            >
              {/* Badge Icon */}
              <div className="text-3xl mb-3 flex items-center justify-center h-12 w-12 rounded-2xl bg-white shadow-xs">
                {badge.earned ? (
                  badge.icon
                ) : (
                  <Lock className="h-6 w-6 text-amber-400/80" />
                )}
              </div>

              <h4 className="text-sm font-bold text-gray-900">{badge.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>

              {badge.earned && (
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Earned
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
