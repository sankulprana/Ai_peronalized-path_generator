import { useState, useEffect } from "react";
import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import RoadmapList from "../components/RoadmapList";
import QuickActions from "../components/QuickActions";
import WeeklyXPChart from "../components/WeeklyXPChart";
import GoalGeneratorModal from "../components/GoalGeneratorModal";
import SkillQuizModal from "../components/SkillQuizModal";
import OnboardingWizard from "../components/OnboardingWizard";
import { topStats as fallbackStats } from "../data/dummyData";
import { useHeaderData, usePageHeader } from "../context/HeaderContext";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    xp = 0,
    streak = 0,
    goalLabel = "Backend Developer",
    isOnboarded,
    isOnboardingOpen,
    closeOnboarding,
    completeOnboarding,
    isGoalModalOpen,
    closeGoalModal,
    isQuizModalOpen,
    closeQuizModal,
  } = useHeaderData();
  const [stats, setStats] = useState(fallbackStats);
  const [weeklyXPData, setWeeklyXPData] = useState(null);
  const [activeRoadmapTasks, setActiveRoadmapTasks] = useState(null);

  usePageHeader({
    pageTitle: "Dashboard",
    goalLabel: goalLabel || user?.targetGoal || "Backend Developer",
  });

  useEffect(() => {
    api.dashboard
      .getStats()
      .then((res) => {
        if (res.stats) {
          setStats([
            { label: "Active Goals", value: `${res.stats.activeGoals !== undefined ? res.stats.activeGoals : 1}`, icon: "star" },
            { label: "Completed", value: `${res.stats.completedMilestones || 0}`, icon: "check" },
            { label: "Current Streak", value: `${res.stats.streakDays || streak || 0} days`, icon: "flame" },
            { label: "Total XP", value: `${res.stats.userXP || xp || 0} XP`, icon: "bolt" },
          ]);
        } else if (res.topStats) {
          setStats(res.topStats);
        }

        if (res.weeklyXP || res.dashboard?.weeklyXP) {
          setWeeklyXPData(res.weeklyXP || res.dashboard?.weeklyXP);
        }

        if (res.roadmapItems || res.dashboard?.roadmapItems) {
          setActiveRoadmapTasks(res.roadmapItems || res.dashboard?.roadmapItems);
        }
      })
      .catch((err) => {
        console.warn("Using offline dashboard fallback:", err.message);
      });
  }, [xp, streak]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <GoalCard />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            value={stat.label === "Total XP" || stat.label === "Total XP Earned" ? `${xp || 0} XP` : stat.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapList roadmapItems={activeRoadmapTasks} />
        </div>
        <QuickActions />
      </div>

      <WeeklyXPChart data={weeklyXPData} />

      {/* Interactive Modals */}
      <GoalGeneratorModal isOpen={isGoalModalOpen} onClose={closeGoalModal} />
      <SkillQuizModal isOpen={isQuizModalOpen} onClose={closeQuizModal} />
      {(!isOnboarded || isOnboardingOpen) && (
        <OnboardingWizard onComplete={completeOnboarding} />
      )}
    </div>
  );
}
