import express from "express";
import { getAssessmentQuiz, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

/**
 * @route   GET /api/quizzes/assessment
 * @desc    Get skill assessment quiz
 * @access  Private
 */
router.get("/assessment", getAssessmentQuiz);

/**
 * @route   POST /api/quizzes/submit
 * @desc    Submit assessment quiz answers & earn XP
 * @access  Private
 */
router.post("/submit", submitQuiz);

export default router;
