import express from "express";
import {
  getUserProgress,
  logDailyActivity,
  updateSkillRatings,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getUserProgress);
router.post("/activity", logDailyActivity);
router.patch("/skills", updateSkillRatings);

export default router;
