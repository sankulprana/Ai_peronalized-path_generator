import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "General",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: "Backend Developer",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    questions: [questionSchema],
    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.pre("save", function (next) {
  if (this.questions) {
    this.totalQuestions = this.questions.length;
  }
  next();
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
