import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
  category: { type: String, default: "JavaScript" },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Skill Assessment Quiz" },
    targetRole: { type: String, default: "Backend Developer" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    questions: [questionSchema],
    totalQuestions: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
