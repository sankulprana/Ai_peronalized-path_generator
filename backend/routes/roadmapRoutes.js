import express from "express";
import {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  toggleTaskCompletion,
  deleteRoadmap,
} from "../controllers/roadmapController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/roadmaps/generate
 * @desc    Generate a new AI-powered personalized learning roadmap
 * @access  Public / Private
 */
router.post("/generate", optionalAuth, generateRoadmap);

/**
 * @route   GET /api/roadmaps
 * @desc    Get all saved roadmaps for the logged-in user
 * @access  Public / Private
 */
router.get("/", optionalAuth, getUserRoadmaps);

/**
 * @route   GET /api/roadmaps/:id
 * @desc    Get detailed roadmap by ID
 * @access  Public / Private
 */
router.get("/:id", optionalAuth, getRoadmapById);

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
