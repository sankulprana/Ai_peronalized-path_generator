import { Zap, Flame, CheckCircle2, Star } from "lucide-react";

const ICONS = {
  bolt: Zap,
  flame: Flame,
  check: CheckCircle2,
  star: Star,
};

const COLOR_MAP = {
  bolt: "bg-violet-100 text-violet-600",
  flame: "bg-amber-100 text-amber-500",
  check: "bg-emerald-100 text-emerald-600",
  star: "bg-sky-100 text-sky-500",
};

const FILLED = new Set(["bolt", "flame"]);

export default function StatCard({ label, value, icon }) {
  const Icon = ICONS[icon];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLOR_MAP[icon]}`}
      >
        <Icon
          className="h-5 w-5"
          strokeWidth={2}
          fill={FILLED.has(icon) ? "currentColor" : "none"}
        />
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-tight text-gray-900">
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
