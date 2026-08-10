import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, targetGoal } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email, and password");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      targetGoal: targetGoal || "Backend Developer",
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
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
      res.status(400);
      throw new Error("Invalid user data");
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

    // Validation
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    // Check for user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Update last active date
    user.lastActiveDate = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
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
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
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
    } else {
      res.status(404);
      throw new Error("User not found");
    }
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
    const user = await User.findById(req.user._id).select("+password");

    if (user) {
      user.name = req.body.name || user.name;

      if (req.body.email && req.body.email.toLowerCase() !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          res.status(400);
          throw new Error("Email is already registered by another account");
        }
        user.email = req.body.email.toLowerCase();
      }

      user.targetGoal = req.body.targetGoal || user.targetGoal;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const token = generateToken(updatedUser._id);

      res.status(200).json({
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
          targetGoal: user.targetGoal,
          avatar: user.avatar,
          isOnboarded: user.isOnboarded || false,
          interests: user.interests || [],
          skillLevel: user.skillLevel || "beginner",
          weeklyHours: user.weeklyHours || 5,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
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
    const user = await User.findById(req.user._id);

    if (user) {
      const { targetGoal, skillLevel, interests, weeklyHours } = req.body;
      user.targetGoal = targetGoal || user.targetGoal;
      user.skillLevel = skillLevel || user.skillLevel;
      user.interests = Array.isArray(interests) ? interests : user.interests;
      user.weeklyHours = weeklyHours || user.weeklyHours;
      user.isOnboarded = true;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "Onboarding completed successfully",
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
          avatar: updatedUser.avatar,
          isOnboarded: updatedUser.isOnboarded,
          interests: updatedUser.interests,
          skillLevel: updatedUser.skillLevel,
          weeklyHours: updatedUser.weeklyHours,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};
