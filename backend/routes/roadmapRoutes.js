import express from "express";
import {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  toggleTaskCompletion,
  deleteRoadmap,
} from "../controllers/roadmapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All roadmap routes are protected (Requires JWT Bearer token)
router.use(protect);

/**
 * @route   POST /api/roadmaps/generate
 * @desc    Generate a new AI-powered personalized learning roadmap
 * @access  Private
 */
router.post("/generate", generateRoadmap);

/**
 * @route   GET /api/roadmaps
 * @desc    Get all saved roadmaps for the logged-in user
 * @access  Private
 */
router.get("/", getUserRoadmaps);

/**
 * @route   GET /api/roadmaps/:id
 * @desc    Get detailed roadmap by ID
 * @access  Private
 */
router.get("/:id", getRoadmapById);

/**
 * @route   PATCH /api/roadmaps/:id/tasks/:taskId
 * @desc    Toggle task completion status & claim XP rewards
 * @access  Private
 */
router.patch("/:id/tasks/:taskId", toggleTaskCompletion);

/**
 * @route   DELETE /api/roadmaps/:id
 * @desc    Delete a roadmap by ID
 * @access  Private
 */
router.delete("/:id", deleteRoadmap);

export default router;
