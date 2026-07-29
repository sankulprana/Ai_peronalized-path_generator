import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import { generateAIRoadmap } from "../services/aiService.js";

/**
 * @desc    Generate a new AI personalized roadmap for user
 * @route   POST /api/roadmaps/generate
 * @access  Private
 */
export const generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole, skillLevel, durationWeeks } = req.body;
    const role = targetRole || req.user.targetGoal || "Backend Developer";

    const generatedData = await generateAIRoadmap({
      targetRole: role,
      skillLevel: skillLevel || "intermediate",
      durationWeeks: durationWeeks || 8,
    });

    await Roadmap.updateMany({ user: req.user._id }, { isCurrent: false });

    const roadmap = new Roadmap({
      user: req.user._id,
      title: generatedData.title,
      targetRole: generatedData.targetRole,
      difficulty: generatedData.difficulty,
      phases: generatedData.phases,
      isCurrent: true,
    });

    await roadmap.save();
    await User.findByIdAndUpdate(req.user._id, { targetGoal: role });

    res.status(201).json({
      success: true,
      message: "AI Roadmap generated successfully",
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all roadmaps for logged-in user
 * @route   GET /api/roadmaps
 * @access  Private
 */
export const getUserRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single roadmap by ID
 * @route   GET /api/roadmaps/:id
 * @access  Private
 */
export const getRoadmapById = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!roadmap) {
      res.status(404);
      throw new Error("Roadmap not found");
    }

    res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task completion & reward user XP
 * @route   PATCH /api/roadmaps/:id/tasks/:taskId
 * @access  Private
 */
export const toggleTaskCompletion = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;

    const roadmap = await Roadmap.findOne({ _id: id, user: req.user._id });
    if (!roadmap) {
      res.status(404);
      throw new Error("Roadmap not found");
    }

    let targetTask = null;

    for (const phase of roadmap.phases) {
      const task = phase.tasks.find(
        (t) => t._id?.toString() === taskId || t.id === taskId
      );
      if (task) {
        targetTask = task;
        break;
      }
    }

    if (!targetTask) {
      res.status(404);
      throw new Error("Task not found in roadmap");
    }

    const previousState = targetTask.completed;
    targetTask.completed = !previousState;
    targetTask.completedAt = targetTask.completed ? new Date() : null;

    await roadmap.save();

    const user = await User.findById(req.user._id);
    if (user) {
      if (!previousState && targetTask.completed) {
        user.xp += targetTask.xp;
        user.level = Math.floor(user.xp / 300) + 1;
        user.title = `Learner · Lv.${user.level}`;
      } else if (previousState && !targetTask.completed) {
        user.xp = Math.max(0, user.xp - targetTask.xp);
        user.level = Math.floor(user.xp / 300) + 1;
        user.title = `Learner · Lv.${user.level}`;
      }
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: targetTask.completed
        ? `Completed task! +${targetTask.xp} XP earned`
        : "Task marked incomplete",
      task: targetTask,
      roadmapProgress: {
        topicsCompleted: roadmap.topicsCompleted,
        topicsTotal: roadmap.topicsTotal,
        progressPercent: roadmap.progressPercent,
      },
      userXP: user ? user.xp : 0,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a roadmap
 * @route   DELETE /api/roadmaps/:id
 * @access  Private
 */
export const deleteRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!roadmap) {
      res.status(404);
      throw new Error("Roadmap not found");
    }

    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
