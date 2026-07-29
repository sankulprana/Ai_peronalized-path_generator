import express from "express";
import {
  getStudyPlanner,
  updateTodayFocus,
  toggleSession,
} from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce JWT authentication on all planner routes
router.use(protect);

/**
 * @route   GET /api/planner
 * @desc    Get user 7-day study planner & today's focus
 * @access  Private
 */
router.get("/", getStudyPlanner);

/**
 * @route   PUT /api/planner/focus
 * @desc    Update today's focus target task
 * @access  Private
 */
router.put("/focus", updateTodayFocus);

/**
 * @route   PATCH /api/planner/sessions
 * @desc    Toggle study session completion status
 * @access  Private
 */
router.patch("/sessions", toggleSession);

export default router;
