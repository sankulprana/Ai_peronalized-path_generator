import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected dashboard route
router.get("/", protect, getDashboardData);

export default router;
