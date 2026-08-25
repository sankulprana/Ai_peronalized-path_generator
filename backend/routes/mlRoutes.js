import express from "express";
import { predictPathML } from "../controllers/mlController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/ml/predict
 * @desc    Predict learning path metrics using integrated Machine Learning models
 * @access  Public / Private
 */
router.post("/predict", optionalAuth, predictPathML);

export default router;
