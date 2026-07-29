import { getRecommendedResources } from "../services/resourceService.js";
import Resource from "../models/Resource.js";

/**
 * @desc    Get recommended learning resources for current user's goal
 * @route   GET /api/resources
 * @access  Private
 */
export const getResources = async (req, res, next) => {
  try {
    const targetRole = req.user ? req.user.targetGoal : "Backend Developer";
    const resourcesData = await getRecommendedResources(targetRole);

    res.status(200).json({
      success: true,
      resources: resourcesData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new learning resource
 * @route   POST /api/resources
 * @access  Private
 */
export const addResource = async (req, res, next) => {
  try {
    const { category, tag, title, author, views, duration, url, targetRole } = req.body;

    if (!category || !tag || !title || !author || !url) {
      res.status(400);
      throw new Error("Please provide category, tag, title, author, and url");
    }

    const resource = await Resource.create({
      category,
      tag,
      title,
      author,
      views: views || "1.0M views",
      duration: duration || "1:00:00",
      url,
      targetRole: targetRole || "Backend Developer",
    });

    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    next(error);
  }
};
