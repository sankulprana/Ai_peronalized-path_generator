import express from "express";
import { getResources, addResource } from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce JWT authentication
router.use(protect);

/**
 * @route   GET /api/resources
 * @desc    Get recommended learning resources (YouTube, Documentation, Articles)
 * @access  Private
 */
router.get("/", getResources);

/**
 * @route   POST /api/resources
 * @desc    Add a new learning resource
 * @access  Private
 */
router.post("/", addResource);

export default router;
