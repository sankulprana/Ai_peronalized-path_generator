import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// In-Memory fallback user store when MongoDB is offline
const memoryUsers = [];

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, targetGoal } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email, and password");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        targetGoal: targetGoal || "Backend Developer",
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          targetGoal: user.targetGoal,
          avatar: user.avatar,
        },
      });
    } else {
      // Memory Fallback Mode
      const userExists = memoryUsers.find((u) => u.email === cleanEmail);
      if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const memUser = {
        _id: "mem_" + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        targetGoal: targetGoal || "Backend Developer",
        role: "user",
        title: "Apprentice · Lv.1",
        level: 1,
        xp: 100,
        streak: 1,
        avatar: "",
      };

      memoryUsers.push(memUser);
      const token = generateToken(memUser._id);

      return res.status(201).json({
        success: true,
        message: "User registered successfully (In-Memory Mode)",
        token,
        user: {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          title: memUser.title,
          level: memUser.level,
          xp: memUser.xp,
          streak: memUser.streak,
          targetGoal: memUser.targetGoal,
          avatar: memUser.avatar,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select("+password");

      if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      user.lastActiveDate = Date.now();
      await user.save({ validateBeforeSave: false });

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          targetGoal: user.targetGoal,
          avatar: user.avatar,
        },
      });
    } else {
      // Memory Fallback Mode
      const user = memoryUsers.find((u) => u.email === cleanEmail);

      if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully (In-Memory Mode)",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          targetGoal: user.targetGoal,
          avatar: user.avatar,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            title: user.title,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            targetGoal: user.targetGoal,
            avatar: user.avatar,
            lastActiveDate: user.lastActiveDate,
            createdAt: user.createdAt,
          },
        });
      }
    }

    const memUser = memoryUsers.find((u) => u._id === req.user._id);
    if (memUser) {
      return res.status(200).json({
        success: true,
        user: {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          title: memUser.title,
          level: memUser.level,
          xp: memUser.xp,
          streak: memUser.streak,
          targetGoal: memUser.targetGoal,
          avatar: memUser.avatar,
        },
      });
    }

    res.status(404);
    throw new Error("User not found");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user._id).select("+password");
      if (user) {
        user.name = req.body.name || user.name;
        user.targetGoal = req.body.targetGoal || user.targetGoal;
        if (req.body.password) {
          user.password = req.body.password;
        }
        const updatedUser = await user.save();
        const token = generateToken(updatedUser._id);
        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          token,
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            title: updatedUser.title,
            level: updatedUser.level,
            xp: updatedUser.xp,
            streak: updatedUser.streak,
            targetGoal: updatedUser.targetGoal,
          },
        });
      }
    }

    const memUser = memoryUsers.find((u) => u._id === req.user._id);
    if (memUser) {
      memUser.name = req.body.name || memUser.name;
      memUser.targetGoal = req.body.targetGoal || memUser.targetGoal;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        memUser.password = await bcrypt.hash(req.body.password, salt);
      }
      const token = generateToken(memUser._id);
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        token,
        user: {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          title: memUser.title,
          level: memUser.level,
          xp: memUser.xp,
          streak: memUser.streak,
          targetGoal: memUser.targetGoal,
        },
      });
    }

    res.status(404);
    throw new Error("User not found");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save onboarding preferences
 * @route   POST /api/auth/onboarding
 * @access  Private
 */
export const completeOnboarding = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.targetGoal = req.body.targetGoal || user.targetGoal;
        user.isOnboarded = true;
        const updatedUser = await user.save();
        return res.status(200).json({
          success: true,
          message: "Onboarding completed successfully",
          user: updatedUser,
        });
      }
    }

    const memUser = memoryUsers.find((u) => u._id === req.user._id);
    if (memUser) {
      memUser.targetGoal = req.body.targetGoal || memUser.targetGoal;
      memUser.isOnboarded = true;
      return res.status(200).json({
        success: true,
        message: "Onboarding completed successfully",
        user: memUser,
      });
    }

    res.status(404);
    throw new Error("User not found");
  } catch (error) {
    next(error);
  }
};
