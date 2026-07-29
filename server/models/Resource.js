import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["youtube", "docs", "articles"],
      required: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    views: {
      type: String,
      default: "1.0M views",
    },
    duration: {
      type: String,
      default: "1:30:00",
    },
    url: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      default: "Backend Developer",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
