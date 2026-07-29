import Progress from "../models/Progress.js";
import User from "../models/User.js";

// Initial default data generator for new users
const createDefaultProgressData = (userId) => {
  const defaultSkills = [
    { label: "JavaScript", value: 0.72, percent: 72, color: "bg-emerald-500" },
    { label: "Node.js", value: 0.35, percent: 35, color: "bg-slate-700" },
    { label: "Databases", value: 0.28, percent: 28, color: "bg-slate-700" },
    { label: "APIs", value: 0.45, percent: 45, color: "bg-violet-600" },
    { label: "DevOps", value: 0.15, percent: 15, color: "bg-slate-700" },
    { label: "Security", value: 0.2, percent: 20, color: "bg-slate-700" },
  ];

  const defaultWeeklyXP = [
    { week: "W1", xp: 120 },
    { week: "W2", xp: 280 },
    { week: "W3", xp: 190 },
    { week: "W4", xp: 420 },
    { week: "W5", xp: 350 },
    { week: "W6", xp: 510 },
    { week: "W7", xp: 480 },
    { week: "W8", xp: 630 },
  ];

  const activityLog = [];
  const todayStr = new Date().toISOString().split("T")[0];

  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    let status = "none";
    if (i === 0) {
      status = "today";
    } else if (i <= 12) {
      status = "studied";
    }

    activityLog.push({ date: dateStr, status });
  }

  return {
    user: userId,
    skillsRadar: defaultSkills.map((s) => ({ label: s.label, value: s.value })),
    weeklyXP: defaultWeeklyXP,
    skillsBreakdown: defaultSkills.map((s) => ({
      label: s.label,
      percent: s.percent,
      color: s.color,
    })),
    activityLog,
  };
};

/**
 * @desc    Get progress metrics for current user
 * @route   GET /api/progress
 * @access  Private
 */
export const getUserProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      const defaultData = createDefaultProgressData(req.user._id);
      progress = await Progress.create(defaultData);
    }

    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      progress: {
        title: "Progress Tracker",
        subtitle: "Skills, activity, and milestones overview",
        streak: {
          count: user ? user.streak : 12,
          totalDays: 35,
          days: progress.activityLog.map((a) => a.status),
        },
        skillsRadar: progress.skillsRadar,
        xpGrowth: progress.weeklyXP,
        skillsBreakdown: progress.skillsBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log daily study activity & increment streak
 * @route   POST /api/progress/activity
 * @access  Private
 */
export const logDailyActivity = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await Progress.create(createDefaultProgressData(req.user._id));
    }

    const todayEntry = progress.activityLog.find((a) => a.date === todayStr);
    if (todayEntry) {
      todayEntry.status = "studied";
    } else {
      progress.activityLog.push({ date: todayStr, status: "studied" });
    }

    await progress.save();

    // Increment streak on User model
    const user = await User.findById(req.user._id);
    if (user) {
      user.streak += 1;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: "Daily activity logged! Streak updated.",
      streak: user ? user.streak : 1,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update skill ratings & percentages
 * @route   PATCH /api/progress/skills
 * @access  Private
 */
export const updateSkillRatings = async (req, res, next) => {
  try {
    const { skillName, newPercent } = req.body;

    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create(createDefaultProgressData(req.user._id));
    }

    const radarSkill = progress.skillsRadar.find((s) => s.label === skillName);
    if (radarSkill) {
      radarSkill.value = Math.min(1, Math.max(0, newPercent / 100));
    }

    const breakdownSkill = progress.skillsBreakdown.find((s) => s.label === skillName);
    if (breakdownSkill) {
      breakdownSkill.percent = newPercent;
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: `Skill ${skillName} updated to ${newPercent}%`,
      skillsRadar: progress.skillsRadar,
      skillsBreakdown: progress.skillsBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
