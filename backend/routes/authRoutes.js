import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  completeOnboarding,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post("/register", validateRegister, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post("/login", validateLogin, loginUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current authenticated user profile
 * @access  Private (Requires Bearer token)
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user profile information
 * @access  Private (Requires Bearer token)
 */
router.put("/profile", protect, validateProfileUpdate, updateUserProfile);

/**
 * @route   POST /api/auth/onboarding
 * @desc    Save onboarding preferences
 * @access  Private
 */
router.post("/onboarding", protect, completeOnboarding);

export default router;

