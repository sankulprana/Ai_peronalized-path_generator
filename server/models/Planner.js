import mongoose from "mongoose";

const plannerSessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  time: { type: String, default: "7:00 AM" },
  duration: { type: String, default: "45m" },
  type: {
    type: String,
    enum: ["theory", "practice", "review", "project"],
    default: "theory",
  },
  completed: { type: Boolean, default: false },
});

const plannerDaySchema = new mongoose.Schema({
  dayName: { type: String, required: true },
  dayNum: { type: Number, required: true },
  isToday: { type: Boolean, default: false },
  isRest: { type: Boolean, default: false },
  sessions: [plannerSessionSchema],
});

const plannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    weekRange: { type: String, default: "Week of July 14–20, 2025" },
    totalHours: { type: String, default: "8.5 hours scheduled" },
    todayDate: { type: String, default: "Thursday, July 17" },
    days: [plannerDaySchema],
    todayFocus: {
      title: { type: String, default: "REST API Design" },
      time: { type: String, default: "7:00 AM" },
      duration: { type: String, default: "45 minutes" },
      phase: { type: String, default: "Phase 2" },
      xpReward: { type: Number, default: 100 },
      sessionsCount: { type: Number, default: 1 },
      plannedMinutes: { type: Number, default: 45 },
    },
  },
  {
    timestamps: true,
  }
);

const Planner = mongoose.model("Planner", plannerSchema);

export default Planner;
