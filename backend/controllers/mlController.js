import { runMLPathPrediction } from "../ml/mlEngine.js";
import User from "../models/User.js";

/**
 * @desc    Predict user skill tier, completion velocity, and recommendations using ML engine
 * @route   POST /api/ml/predict
 * @access  Public / Private
 */
export const predictPathML = async (req, res, next) => {
  try {
    const {
      targetRole = "Backend Developer",
      quizAccuracy = 80,
      weeklyHours = 6,
      topicsTotal = 12,
    } = req.body;

    let userXP = 420;
    let streakDays = 5;

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        userXP = user.xp || userXP;
        streakDays = user.streak || streakDays;
      }
    }

    const mlResult = runMLPathPrediction({
      targetRole: targetRole || req.user?.targetGoal || "Backend Developer",
      quizAccuracy: parseInt(quizAccuracy, 10) || 80,
      streakDays,
      xp: userXP,
      weeklyHours: parseInt(weeklyHours, 10) || 6,
      topicsTotal: parseInt(topicsTotal, 10) || 12,
    });

    res.status(200).json({
      success: true,
      message: "Machine Learning prediction computed successfully",
      data: mlResult,
    });
  } catch (error) {
    next(error);
  }
};
