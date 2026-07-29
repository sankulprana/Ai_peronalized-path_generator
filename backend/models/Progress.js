import mongoose from "mongoose";

/**
 * Skill Radar Entry Schema
 */
const skillRadarSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: Number, default: 0, min: 0, max: 1 }, // Normalized scale 0.0 to 1.0
});

/**
 * Weekly XP History Schema
 */
const weeklyXPSchema = new mongoose.Schema({
  week: { type: String, required: true, trim: true }, // e.g. "W1", "W2", ..., "W8"
  xp: { type: Number, default: 0, min: 0 },
});

/**
 * Skill Percentage Breakdown Schema
 */
const skillBreakdownSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  percent: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: "bg-slate-700" },
});

/**
 * Daily Activity Streak Log Schema
 */
const activityLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: {
    type: String,
    enum: ["none", "studied", "today"],
    default: "none",
  },
});

/**
 * Main User Progress Tracker Mongoose Schema
 */
const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    skillsRadar: [skillRadarSchema],
    weeklyXP: [weeklyXPSchema],
    skillsBreakdown: [skillBreakdownSchema],
    activityLog: [activityLogSchema],
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
