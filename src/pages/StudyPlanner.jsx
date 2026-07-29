import { useState } from "react";
import { usePageHeader } from "../context/HeaderContext";
import { studyPlannerData } from "../data/dummyData";
import { Calendar, Clock, PlayCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function StudyPlanner() {
  usePageHeader({
    pageTitle: "Study Planner",
    goalLabel: "Backend Developer",
  });

  const [sessionStarted, setSessionStarted] = useState(false);

  const getPillStyle = (type) => {
    switch (type) {
      case "theory":
        return "bg-purple-100/80 text-purple-700 border-purple-200/70";
      case "practice":
        return "bg-sky-100/80 text-sky-700 border-sky-200/70";
      case "review":
        return "bg-emerald-100/80 text-emerald-700 border-emerald-200/70";
      case "project":
        return "bg-amber-100/80 text-amber-700 border-amber-200/70";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Planner</h2>
          <p className="text-sm text-gray-500 mt-1">
            {studyPlannerData.weekRange} · {studyPlannerData.totalHours}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
          {studyPlannerData.legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dotBg}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Days Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {studyPlannerData.days.map((day) => (
          <div
            key={day.dayNum}
            className={`rounded-2xl border p-3 flex flex-col min-h-[220px] transition-all ${
              day.isToday
                ? "bg-purple-50/50 border-purple-200 ring-2 ring-violet-500/20 shadow-sm"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            {/* Date header */}
            <div className="text-center pb-3 border-b border-gray-100/80 mb-3">
              <p className="text-xs font-medium text-gray-500">{day.dayName}</p>
              <p
                className={`text-lg font-bold ${
                  day.isToday ? "text-violet-600" : "text-gray-900"
                }`}
              >
                {day.dayNum}
              </p>
              {day.isToday && (
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100/80 px-1.5 py-0.5 rounded-md">
                  Today
                </span>
              )}
            </div>

            {/* Sessions list */}
            <div className="flex-1 flex flex-col gap-2">
              {day.isRest ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-400">
                    Rest day
                  </span>
                </div>
              ) : (
                day.sessions.map((session, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2 text-left text-xs transition-all hover:scale-[1.02] ${getPillStyle(
                      session.type
                    )}`}
                  >
                    <p className="font-semibold leading-tight">{session.title}</p>
                    <p className="text-[10px] opacity-80 mt-1">
                      {session.time} · {session.duration}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Focus Section */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Today's Focus — {studyPlannerData.todayDate}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Focus Card */}
          <div className="lg:col-span-2 rounded-2xl bg-purple-50/70 border border-purple-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600">
                <PlayCircle className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">
                  {studyPlannerData.todayFocus.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {studyPlannerData.todayFocus.time} · {studyPlannerData.todayFocus.duration} · {studyPlannerData.todayFocus.phase}
                </p>
                <p className="text-xs font-semibold text-violet-600 mt-1.5 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  +{studyPlannerData.todayFocus.xpReward} XP on completion
                </p>
              </div>
            </div>

            <button
              onClick={() => setSessionStarted(!sessionStarted)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                sessionStarted
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {sessionStarted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  In Progress
                </>
              ) : (
                "Start"
              )}
            </button>
          </div>

          {/* Stats summary cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <div className="flex-1 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-gray-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {studyPlannerData.todayFocus.sessionsCount} Sessions today
                </p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-gray-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {studyPlannerData.todayFocus.plannedMinutes} Minutes planned
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
