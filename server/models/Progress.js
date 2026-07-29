import mongoose from "mongoose";

const skillRadarSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: Number, default: 0, min: 0, max: 1 },
});

const weeklyXPSchema = new mongoose.Schema({
  week: { type: String, required: true, trim: true },
  xp: { type: Number, default: 0, min: 0 },
});

const skillBreakdownSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  percent: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: "bg-slate-700" },
});

const activityLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ["none", "studied", "today"],
    default: "none",
  },
});

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
