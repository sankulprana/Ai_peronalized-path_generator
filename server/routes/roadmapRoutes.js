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

router.use(protect);

router.post("/generate", generateRoadmap);
router.get("/", getUserRoadmaps);
router.get("/:id", getRoadmapById);
router.patch("/:id/tasks/:taskId", toggleTaskCompletion);
router.delete("/:id", deleteRoadmap);

export default router;
