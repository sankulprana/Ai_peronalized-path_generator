import express from "express";
import {
  getUserProgress,
  logDailyActivity,
  updateSkillRatings,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce JWT authentication on all progress routes
router.use(protect);

/**
 * @route   GET /api/progress
 * @desc    Get skill radar, weekly XP growth, and 35-day activity log
 * @access  Private
 */
router.get("/", getUserProgress);

/**
 * @route   POST /api/progress/activity
 * @desc    Log daily study session and increment streak count
 * @access  Private
 */
router.post("/activity", logDailyActivity);

/**
 * @route   PATCH /api/progress/skills
 * @desc    Update skill radar evaluation scores and breakdown percentages
 * @access  Private
 */
router.patch("/skills", updateSkillRatings);

export default router;
