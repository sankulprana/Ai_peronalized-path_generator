import { useState, useEffect } from "react";
import { usePageHeader } from "../context/HeaderContext";
import { progressData as fallbackProgress } from "../data/dummyData";
import { Flame } from "lucide-react";
import { api } from "../services/api";

export default function Progress() {
  usePageHeader({
    pageTitle: "Progress",
    goalLabel: "Backend Developer",
  });

  const [data, setData] = useState(fallbackProgress);

  useEffect(() => {
    api.progress
      .getAnalytics()
      .then((res) => {
        if (res.progress) {
          setData({
            ...fallbackProgress,
            streak: {
              ...fallbackProgress.streak,
              count: res.progress.streakDays || fallbackProgress.streak.count,
            },
            xpGrowth: res.progress.weeklyXP || fallbackProgress.xpGrowth,
          });
        }
      })
      .catch((err) => {
        console.warn("Using offline progress fallback:", err.message);
      });
  }, []);

  // SVG Radar Chart Math calculations
  const cx = 160;
  const cy = 160;
  const radius = 100;
  const skills = data.skillsRadar;
  const totalAxes = skills.length;

  const getCoordinates = (index, valueScale = 1) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const x = cx + radius * valueScale * Math.cos(angle);
    const y = cy + radius * valueScale * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = skills
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, skill.value);
      return `${x},${y}`;
    })
    .join(" ");

  const xpPoints = data.xpGrowth;
  const chartWidth = 400;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getLineCoords = (index, xp) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / Math.max(1, xpPoints.length - 1);
    const y = chartHeight - paddingY - (xp / 800) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const lineCoords = xpPoints.map((item, i) => getLineCoords(i, item.xp));

  const pathD = lineCoords.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, "");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {data.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Skill Radar</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Based on your completed topics & quiz results
            </p>
          </div>

          <div className="flex items-center justify-center my-4">
            <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible">
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, levelIdx) => {
                const levelPoints = skills
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, scale);
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <polygon
                    key={levelIdx}
                    points={levelPoints}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                  />
                );
              })}

              {skills.map((_, i) => {
                const { x, y } = getCoordinates(i, 1);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                  />
                );
              })}

              <polygon
                points={polygonPoints}
                fill="rgba(168, 85, 247, 0.25)"
                stroke="#a855f7"
                strokeWidth="2"
              />

              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, skill.value);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                );
              })}

              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, 1.22);
                let textAnchor = "middle";
                if (x > cx + 10) textAnchor = "start";
                if (x < cx - 10) textAnchor = "end";

                return (
                  <text
                    key={i}
                    x={x}
                    y={y + 4}
                    textAnchor={textAnchor}
                    className="text-[12px] font-semibold fill-gray-700 font-sans"
                  >
                    {skill.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">XP Growth</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              XP earned each week over the past 8 weeks
            </p>
          </div>

          <div className="w-full flex items-center justify-center my-4 overflow-x-auto">
            <svg width="400" height="240" viewBox="0 0 400 240" className="overflow-visible">
              {[0, 200, 400, 600, 800].map((val) => {
                const y = chartHeight - paddingY - (val / 800) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-gray-400 font-medium"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              <path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {lineCoords.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-sm"
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    className="text-[11px] fill-gray-500 font-medium"
                  >
                    {xpPoints[i]?.week}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Skill Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {data.skillsBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-900">{item.label}</span>
                <span className="text-gray-500">{item.percent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Study Streak</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Last {data.streak.totalDays} days of activity
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Flame className="h-4 w-4 fill-amber-500" />
            <span>{data.streak.count} day streak</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {data.streak.days.map((status, idx) => (
            <div
              key={idx}
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl transition-transform hover:scale-110 ${
                status === "studied"
                  ? "bg-violet-400"
                  : status === "today"
                  ? "bg-amber-400 shadow-sm ring-2 ring-amber-200"
                  : "bg-gray-100"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-500 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span>No activity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
            <span>Studied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
