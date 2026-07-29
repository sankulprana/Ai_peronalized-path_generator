import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import RoadmapList from "../components/RoadmapList";
import QuickActions from "../components/QuickActions";
import WeeklyXPChart from "../components/WeeklyXPChart";
import { topStats } from "../data/dummyData";
import { usePageHeader } from "../context/HeaderContext";

export default function Dashboard() {
  usePageHeader({
    pageTitle: "Dashboard",
    goalLabel: "Frontend Developer",
    streak: 12,
    xp: 1465,
    user: { name: "Alex Chen", title: "Expert · Lv.5", initial: "A" },
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <GoalCard />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {topStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapList />
        </div>
        <QuickActions />
      </div>

      <WeeklyXPChart />
    </div>
  );
}
