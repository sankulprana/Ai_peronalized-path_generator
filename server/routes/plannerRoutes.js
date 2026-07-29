import express from "express";
import {
  getStudyPlanner,
  updateTodayFocus,
  toggleSession,
} from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getStudyPlanner);
router.put("/focus", updateTodayFocus);
router.patch("/sessions", toggleSession);

export default router;
