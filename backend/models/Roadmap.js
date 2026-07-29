import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  xp: {
    type: Number,
    default: 50,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  type: {
    type: String,
    enum: ["theory", "practice", "review", "project"],
    default: "theory",
  },
  estimatedMinutes: {
    type: Number,
    default: 45,
  },
  resourceLink: {
    type: String,
    default: "",
  },
});

const phaseSchema = new mongoose.Schema({
  phaseNumber: {
    type: Number,
    required: true,
  },
  phaseName: {
    type: String,
    required: true, // e.g. "PHASE 1"
  },
  title: {
    type: String,
    required: true, // e.g. "Web Fundamentals"
  },
  duration: {
    type: String,
    default: "2 weeks",
  },
  description: {
    type: String,
    default: "",
  },
  tasks: [taskSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Roadmap title is required"],
      trim: true,
      default: "Personalized Learning Roadmap",
    },
    targetRole: {
      type: String,
      required: [true, "Target role is required"], // e.g. "Backend Developer"
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    phases: [phaseSchema],
    topicsCompleted: {
      type: Number,
      default: 0,
    },
    topicsTotal: {
      type: Number,
      default: 0,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Pre-save Hook: Calculate topicsTotal, topicsCompleted, and progressPercent automatically
roadmapSchema.pre("save", function (next) {
  let total = 0;
  let completed = 0;

  if (this.phases && this.phases.length > 0) {
    this.phases.forEach((phase) => {
      if (phase.tasks && phase.tasks.length > 0) {
        total += phase.tasks.length;
        completed += phase.tasks.filter((t) => t.completed).length;
      }
    });
  }

  this.topicsTotal = total;
  this.topicsCompleted = completed;
  this.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  next();
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
