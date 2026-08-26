import { useState, useEffect } from "react";
import { usePageHeader, useHeaderData } from "../context/HeaderContext";
import { getRoadmapForRole } from "../data/dummyData";
import { Calendar, Clock, PlayCircle, PauseCircle, CheckCircle2, Sparkles, RotateCcw, Plus, Trophy } from "lucide-react";
import { api } from "../services/api";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calculates current week's 7 days (Monday - Sunday) dynamically using native JS Date
 */
function getDynamicWeekData(goalLabel = "Backend Developer") {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon, etc.
  
  // Calculate offset to get Monday (if Sunday, offset is -6)
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Week range string: e.g. "Week of August 24–30, 2026"
  const startMonth = MONTH_NAMES[monday.getMonth()];
  const endMonth = MONTH_NAMES[sunday.getMonth()];
  const monthStr = startMonth === endMonth ? startMonth : `${startMonth}–${endMonth}`;
  const weekRange = `Week of ${monthStr} ${monday.getDate()}–${sunday.getDate()}, ${today.getFullYear()}`;

  // Today's formatted string: e.g. "Wednesday, August 26, 2026"
  const todayDateStr = `${today.toLocaleDateString("en-US", { weekday: "long" })}, ${MONTH_NAMES[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  // Pull active roadmap tasks for dynamic session assignment
  const roadmap = getRoadmapForRole(goalLabel);
  const tasks = roadmap.phases?.flatMap((p) => p.tasks || []) || [];

  const days = [];
  let totalHours = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const isToday = d.toDateString() === today.toDateString();
    const dayName = DAY_NAMES[d.getDay()];
    const dayNum = d.getDate();
    const isRest = d.getDay() === 0; // Sunday rest day

    let sessions = [];
    if (!isRest) {
      const task1 = tasks[i % tasks.length] || { title: `${goalLabel} Core Concept`, xp: 60, type: "theory", estimatedMinutes: 45 };
      const task2 = tasks[(i + 3) % tasks.length] || { title: "Practice Exercises", xp: 50, type: "practice", estimatedMinutes: 30 };

      sessions = [
        {
          title: task1.title,
          time: i % 2 === 0 ? "7:00 AM" : "8:00 AM",
          duration: `${task1.estimatedMinutes || 45}m`,
          type: task1.type || "practice",
          xp: task1.xp || 60,
        },
        {
          title: task2.title,
          time: i % 2 === 0 ? "7:30 PM" : "8:00 PM",
          duration: `${task2.estimatedMinutes || 30}m`,
          type: task2.type || "practice",
          xp: task2.xp || 50,
        },
      ];
      totalHours += 1.25;
    }

    days.push({
      dayName,
      dayNum,
      dateObj: d,
      isToday,
      isRest,
      sessions,
    });
  }

  // Today's Focus task
  const todayTask = tasks[0] || { title: `${goalLabel} Architecture`, xp: 80, estimatedMinutes: 45 };

  return {
    weekRange,
    totalHours: `${totalHours.toFixed(1)} hours scheduled`,
    todayDate: todayDateStr,
    days,
    todayFocus: {
      title: todayTask.title,
      time: "7:00 AM",
      duration: `${todayTask.estimatedMinutes || 45} minutes`,
      phase: "Phase 1",
      xpReward: todayTask.xp || 80,
      plannedMinutes: todayTask.estimatedMinutes || 45,
      sessionsCount: 2,
    },
    legend: [
      { label: "Theory", dotBg: "bg-purple-500" },
      { label: "Practice", dotBg: "bg-sky-500" },
      { label: "Review", dotBg: "bg-emerald-500" },
      { label: "Project", dotBg: "bg-amber-500" },
    ],
  };
}

export default function StudyPlanner() {
  const { goalLabel = "Backend Developer", addXP } = useHeaderData();

  usePageHeader({
    pageTitle: "Study Planner",
    goalLabel: goalLabel || "Backend Developer",
  });

  const [plannerData, setPlannerData] = useState(() => getDynamicWeekData(goalLabel));
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Recalculate dynamic week schedule when goal changes
  useEffect(() => {
    setPlannerData(getDynamicWeekData(goalLabel));
  }, [goalLabel]);

  // Live Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPauseTimer = () => {
    if (sessionCompleted) return;
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(plannerData.todayFocus.plannedMinutes * 60);
    setSessionCompleted(false);
  };

  const handleCompleteSession = async () => {
    if (sessionCompleted) return;
    setIsTimerRunning(false);
    setSessionCompleted(true);
    addXP(plannerData.todayFocus.xpReward || 80);

    try {
      await api.planner.toggleSession({
        sessionTitle: plannerData.todayFocus.title,
      });
      await api.progress.logDailyActivity();
    } catch (err) {
      console.warn("Session logging fallback active:", err.message);
    }
  };

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
          <p className="text-sm font-medium text-violet-600 mt-0.5">
            {plannerData.weekRange} · {plannerData.totalHours}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
          {plannerData.legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dotBg}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Days Dynamic Real-Time Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {plannerData.days.map((day) => (
          <div
            key={day.dayNum}
            className={`rounded-2xl border p-3 flex flex-col min-h-[220px] transition-all ${
              day.isToday
                ? "bg-purple-50/70 border-violet-300 ring-2 ring-violet-500/30 shadow-md"
                : "bg-white border-gray-100 hover:border-gray-200 shadow-2xs"
            }`}
          >
            {/* Date header */}
            <div className="text-center pb-3 border-b border-gray-100/80 mb-3">
              <p className="text-xs font-medium text-gray-500">{day.dayName}</p>
              <p
                className={`text-lg font-extrabold ${
                  day.isToday ? "text-violet-600" : "text-gray-900"
                }`}
              >
                {day.dayNum}
              </p>
              {day.isToday && (
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100/80 px-2 py-0.5 rounded-md">
                  TODAY
                </span>
              )}
            </div>

            {/* Sessions list */}
            <div className="flex-1 flex flex-col gap-2">
              {day.isRest ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-400">
                    Rest day ☕
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
                    <p className="font-semibold leading-tight truncate">{session.title}</p>
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

      {/* Today's Focus & Live Focus Timer Section */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900">
            Today's Focus — <span className="text-violet-600">{plannerData.todayDate}</span>
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
            Real-Time Calendar Sync
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Focus & Pomodoro Card */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-400/30 uppercase tracking-wider">
                  Active Study Session
                </span>
                <span className="text-xs text-slate-400">
                  {plannerData.todayFocus.time} · {plannerData.todayFocus.phase}
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-white leading-snug">
                {plannerData.todayFocus.title}
              </h4>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-violet-300 font-bold">+{plannerData.todayFocus.xpReward} XP</span> awarded on timer completion
              </p>
            </div>

            {/* Interactive Live Timer Controls */}
            <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs shrink-0 self-stretch sm:self-auto justify-center">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-violet-300 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartPauseTimer}
                  disabled={sessionCompleted}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                    sessionCompleted
                      ? "bg-emerald-500 text-white opacity-90 cursor-default"
                      : isTimerRunning
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  }`}
                >
                  {sessionCompleted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Completed!
                    </>
                  ) : isTimerRunning ? (
                    <>
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Start
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  title="Reset Timer"
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats summary cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <div className="flex-1 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs text-violet-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Daily Target</p>
                <p className="text-sm font-bold text-gray-900">
                  {plannerData.todayFocus.sessionsCount} Sessions today
                </p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs text-sky-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Planned Time</p>
                <p className="text-sm font-bold text-gray-900">
                  {plannerData.todayFocus.plannedMinutes} Minutes planned
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
