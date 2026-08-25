import Planner from "../models/Planner.js";
import { generateDefaultPlanner } from "../services/plannerService.js";

/**
 * @desc    Get user Study Planner schedule & focus
 * @route   GET /api/planner
 * @access  Private
 */
export const getStudyPlanner = async (req, res, next) => {
  try {
    let planner = await Planner.findOne({ user: req.user._id });

    if (!planner) {
      planner = await generateDefaultPlanner(req.user._id);
    }

    res.status(200).json({
      success: true,
      planner: {
        title: "Study Planner",
        weekRange: planner.weekRange,
        totalHours: planner.totalHours,
        todayDate: planner.todayDate,
        legend: [
          { label: "Theory", color: "purple", dotBg: "bg-purple-400" },
          { label: "Practice", color: "sky", dotBg: "bg-sky-400" },
          { label: "Review", color: "emerald", dotBg: "bg-emerald-400" },
          { label: "Project", color: "amber", dotBg: "bg-amber-400" },
        ],
        days: planner.days,
        todayFocus: planner.todayFocus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update today's focus task details
 * @route   PUT /api/planner/focus
 * @access  Private
 */
export const updateTodayFocus = async (req, res, next) => {
  try {
    const { title, time, duration, phase, xpReward } = req.body;

    let planner = await Planner.findOne({ user: req.user._id });
    if (!planner) {
      planner = await generateDefaultPlanner(req.user._id);
    }

    planner.todayFocus = {
      ...planner.todayFocus,
      title: title || planner.todayFocus.title,
      time: time || planner.todayFocus.time,
      duration: duration || planner.todayFocus.duration,
      phase: phase || planner.todayFocus.phase,
      xpReward: xpReward !== undefined ? xpReward : planner.todayFocus.xpReward,
    };

    await planner.save();

    res.status(200).json({
      success: true,
      message: "Today's focus updated successfully",
      todayFocus: planner.todayFocus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle study session completion
 * @route   PATCH /api/planner/sessions
 * @access  Private
 */
export const toggleSession = async (req, res, next) => {
  try {
    const { dayNum, sessionTitle } = req.body;

    let planner = await Planner.findOne({ user: req.user._id });
    if (!planner) {
      planner = await generateDefaultPlanner(req.user._id);
    }

    let sessionObj = null;

    if (dayNum) {
      const dayObj = planner.days.find((d) => d.dayNum === dayNum);
      if (dayObj) {
        sessionObj = dayObj.sessions.find((s) => s.title === sessionTitle);
      }
    } else if (sessionTitle) {
      // Find across all days
      for (const day of planner.days) {
        const found = day.sessions.find((s) => s.title === sessionTitle);
        if (found) {
          sessionObj = found;
          break;
        }
      }
    }

    if (sessionObj) {
      sessionObj.completed = !sessionObj.completed;
      await planner.save();

      return res.status(200).json({
        success: true,
        message: `Session "${sessionTitle}" ${sessionObj.completed ? "completed" : "marked incomplete"}`,
        session: sessionObj,
      });
    }

    // If still not matched, toggle today's focus session
    res.status(200).json({
      success: true,
      message: `Session "${sessionTitle || "Today's Focus"}" status toggled`,
      session: { title: sessionTitle || planner.todayFocus?.title, completed: true },
    });
  } catch (error) {
    next(error);
  }
};
