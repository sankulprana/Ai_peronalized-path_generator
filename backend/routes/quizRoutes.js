import express from "express";
import { getAssessmentQuiz, submitQuiz } from "../controllers/quizController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public or optional auth for quiz retrieval
router.get("/assessment", optionalAuth, getAssessmentQuiz);

// Submit quiz answers (optional auth to support guest/logged in users)
router.post("/submit", optionalAuth, submitQuiz);

export default router;
