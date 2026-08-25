import express from "express";
import { solveDoubtAI } from "../services/aiService.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/ai/doubt-solver
 * @desc    Solve student doubt with AI mentor
 * @access  Public / Private
 */
router.post("/doubt-solver", optionalAuth, async (req, res, next) => {
  try {
    const { query, contextGoal } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query string is required" });
    }

    const result = await solveDoubtAI({
      query,
      contextGoal: contextGoal || req.user?.targetGoal || "Backend Developer",
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
