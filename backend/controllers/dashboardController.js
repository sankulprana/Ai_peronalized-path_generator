import User from "../models/User.js";
import Roadmap from "../models/Roadmap.js";
import Progress from "../models/Progress.js";

/**
 * @desc    Get aggregated dashboard data for authenticated user
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Fetch active roadmap
    const activeRoadmap = await Roadmap.findOne({
      user: req.user._id,
      isCurrent: true,
    });

    // Fetch progress metrics
    const progress = await Progress.findOne({ user: req.user._id });

    // Derive stats
    const topicsDone = activeRoadmap ? activeRoadmap.topicsCompleted : 2;
    const topicsTotal = activeRoadmap ? activeRoadmap.topicsTotal : 13;
    const progressPercent = activeRoadmap ? activeRoadmap.progressPercent : 47;

    const userSummary = {
      name: user.name,
      title: user.title || "Expert · Lv.5",
      initial: user.name.charAt(0).toUpperCase(),
    };

    const currentGoal = {
      label: user.targetGoal || "Backend Developer",
      heading: `Become a ${user.targetGoal || "Backend Developer"}`,
      subtext: "Keep pushing — you're making solid progress on your path.",
      level: `Level ${user.level} · ${user.title.split("·")[0] || "Learner"}`,
      progressPercent,
      nextLevel: "Master",
      xpNeeded: 2000,
      stats: [
        { label: "Total XP", value: user.xp || 1465 },
        { label: "Day Streak", value: user.streak || 12 },
        { label: "Topics Done", value: `${topicsDone}/${topicsTotal}` },
      ],
    };

    const topStats = [
      { label: "Total XP Earned", value: `${user.xp || 1465}`, icon: "bolt" },
      { label: "Day Streak", value: `${user.streak || 12}`, icon: "flame" },
      { label: "Topics Completed", value: `${topicsDone}/${topicsTotal}`, icon: "check" },
      { label: "Current Level", value: `Lv. ${user.level || 5}`, icon: "star" },
    ];

    // Extract active roadmap upcoming tasks
    let roadmapItems = [];
    if (activeRoadmap && activeRoadmap.phases.length > 0) {
      let count = 0;
      for (const phase of activeRoadmap.phases) {
        for (const task of phase.tasks) {
          if (count < 3) {
            roadmapItems.push({
              id: task._id,
              title: task.title,
              xp: task.xp,
              active: !task.completed && count === 0,
              completed: task.completed,
            });
            count++;
          }
        }
      }
    } else {
      roadmapItems = [
        { id: "1", title: "Flexbox & Grid Layout", xp: 60, active: true },
        { id: "2", title: "JavaScript Basics", xp: 70, active: false },
        { id: "3", title: "DOM Manipulation", xp: 65, active: false },
      ];
    }

    const weeklyXP = progress && progress.weeklyXP.length > 0
      ? progress.weeklyXP.map((w) => ({ week: w.week, value: w.xp }))
      : [
          { week: "W1", value: 22 },
          { week: "W2", value: 45 },
          { week: "W3", value: 30 },
          { week: "W4", value: 68 },
          { week: "W5", value: 52 },
          { week: "W6", value: 72 },
          { week: "W7", value: 58 },
          { week: "W8", value: 85 },
        ];

    res.status(200).json({
      success: true,
      stats: {
        activeGoals: activeRoadmap ? 1 : 0,
        completedMilestones: topicsDone,
        streakDays: user.streak || 0,
        userXP: user.xp || 0,
        currentLevel: user.level || 1,
      },
      topStats,
      currentGoal,
      roadmapItems,
      weeklyXP,
      dashboard: {
        pageTitle: "Dashboard",
        goalLabel: user.targetGoal || "Backend Developer",
        streak: user.streak || 0,
        xp: user.xp || 0,
        user: userSummary,
        currentGoal,
        topStats,
        roadmapItems,
        weeklyXP,
      },
    });
  } catch (error) {
    next(error);
  }
};
