import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";

const sampleQuestions = [
  {
    question: "What is the primary role of the Event Loop in Node.js?",
    options: [
      "Multi-threading CPU execution",
      "Offloading non-blocking I/O operations",
      "Managing MongoDB connections",
      "Compiling TypeScript to JS",
    ],
    correctOptionIndex: 1,
    explanation:
      "The Event Loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel whenever possible.",
    category: "Node.js",
  },
  {
    question: "Which HTTP status code signifies a resource was successfully created?",
    options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
    correctOptionIndex: 1,
    explanation: "201 Created indicates that the request has succeeded and led to the creation of a resource.",
    category: "APIs",
  },
  {
    question: "How does `async/await` handle errors in JavaScript?",
    options: [
      "Using `try/catch` blocks",
      "Using `if/else` conditions",
      "Errors are automatically swallowed",
      "Using `.then().catch()` callbacks only",
    ],
    correctOptionIndex: 0,
    explanation: "Asynchronous code using `async/await` handles thrown promise rejections inside standard `try/catch` blocks.",
    category: "JavaScript",
  },
  {
    question: "In MongoDB, which method is used to define indexes on a collection schema in Mongoose?",
    options: ["schema.addIndex()", "schema.index()", "schema.createKey()", "schema.sort()"],
    correctOptionIndex: 1,
    explanation: "`schema.index({ field: 1 })` defines index paths for fast query optimization in Mongoose.",
    category: "Databases",
  },
  {
    question: "What is the purpose of JWT (JSON Web Token) in REST API authentication?",
    options: [
      "To encrypt database passwords",
      "Stateless authorization token transmitted in headers",
      "To speed up server caching",
      "To prevent CORS origin errors",
    ],
    correctOptionIndex: 1,
    explanation: "JWTs provide stateless authorization by securely transmitting user claims between client and server.",
    category: "Security",
  },
];

/**
 * @desc    Get skill assessment quiz
 * @route   GET /api/quizzes/assessment
 * @access  Private
 */
export const getAssessmentQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findOne({ targetRole: req.user.targetGoal || "Backend Developer" });

    if (!quiz) {
      quiz = await Quiz.create({
        title: `${req.user.targetGoal || "Backend Developer"} Skill Assessment`,
        targetRole: req.user.targetGoal || "Backend Developer",
        difficulty: "intermediate",
        questions: sampleQuestions,
        totalQuestions: sampleQuestions.length,
      });
    }

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        targetRole: quiz.targetRole,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          category: q.category,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assessment quiz answers & update XP
 * @route   POST /api/quizzes/submit
 * @access  Private
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedIndex }

    if (!answers || !Array.isArray(answers)) {
      res.status(400);
      throw new Error("Please provide answers array");
    }

    let quiz = await Quiz.findOne({ targetRole: req.user.targetGoal || "Backend Developer" });
    if (!quiz) {
      quiz = sampleQuestions;
    }

    const questionsList = quiz.questions || sampleQuestions;
    let score = 0;
    const results = [];

    answers.forEach((ans) => {
      const q = questionsList.find((item) => item._id?.toString() === ans.questionId) || questionsList[ans.questionIndex];
      if (q) {
        const isCorrect = q.correctOptionIndex === ans.selectedIndex;
        if (isCorrect) score += 1;
        results.push({
          question: q.question,
          isCorrect,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        });
      }
    });

    const scorePercentage = Math.round((score / questionsList.length) * 100);
    const earnedXP = score * 20;

    // Reward XP to user profile
    const user = await User.findById(req.user._id);
    if (user) {
      user.xp += earnedXP;
      user.level = Math.floor(user.xp / 300) + 1;
      user.title = `Learner · Lv.${user.level}`;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: `Quiz completed! You scored ${score}/${questionsList.length} (${scorePercentage}%)`,
      score,
      totalQuestions: questionsList.length,
      scorePercentage,
      earnedXP,
      results,
    });
  } catch (error) {
    next(error);
  }
};
