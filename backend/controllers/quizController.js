import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

const sampleQuestions = {
  "Backend Developer": [
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
  ],
  "Frontend Developer": [
    {
      question: "What is the primary difference between `useEffect` and `useLayoutEffect` in React?",
      options: [
        "useEffect runs synchronously before DOM mutations",
        "useLayoutEffect runs synchronously after DOM mutations but before painting",
        "useEffect cannot perform async operations",
        "useLayoutEffect only runs on component unmount",
      ],
      correctOptionIndex: 1,
      explanation: "useLayoutEffect fires synchronously after all DOM mutations, before browser paint.",
      category: "React",
    },
    {
      question: "Which CSS property is used to create a flex container?",
      options: ["display: flex", "flex-direction: row", "align-items: center", "position: flex"],
      correctOptionIndex: 0,
      explanation: "Setting `display: flex` establishes a new flex formatting context.",
      category: "CSS",
    },
    {
      question: "What is the virtual DOM in React?",
      options: [
        "A direct copy of the browser DOM tree in C++",
        "An in-memory lightweight representation of the real DOM",
        "A browser plugin required for React",
        "A server-side database cache",
      ],
      correctOptionIndex: 1,
      explanation: "React keeps an in-memory virtual representation of the UI and syncs it with the real DOM.",
      category: "React",
    },
  ],
};

/**
 * @desc    Get skill assessment quiz
 * @route   GET /api/quizzes/assessment
 * @access  Public / Private
 */
export const getAssessmentQuiz = async (req, res, next) => {
  try {
    const role = req.query.role || req.user?.targetGoal || "Backend Developer";
    let quiz = await Quiz.findOne({ targetRole: role });

    if (!quiz) {
      const questionsForRole = sampleQuestions[role] || sampleQuestions["Backend Developer"];
      quiz = await Quiz.create({
        title: `${role} Skill Assessment`,
        targetRole: role,
        difficulty: "intermediate",
        questions: questionsForRole,
        totalQuestions: questionsForRole.length,
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
        questions: quiz.questions.map((q, idx) => ({
          _id: q._id,
          id: idx + 1,
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
    const { answers, targetRole } = req.body; // Array of { questionId, selectedIndex } or direct index mappings

    if (!answers || !Array.isArray(answers)) {
      res.status(400);
      throw new Error("Please provide answers array");
    }

    const role = targetRole || req.user?.targetGoal || "Backend Developer";
    let quiz = await Quiz.findOne({ targetRole: role });
    const questionsList = quiz?.questions || sampleQuestions[role] || sampleQuestions["Backend Developer"];

    let score = 0;
    const results = [];

    answers.forEach((ans, idx) => {
      const q = questionsList.find((item) => item._id?.toString() === ans.questionId) || questionsList[idx];
      if (q) {
        const selectedOption = ans.selectedIndex !== undefined ? ans.selectedIndex : ans;
        const isCorrect = q.correctOptionIndex === selectedOption;
        if (isCorrect) score += 1;
        results.push({
          question: q.question,
          isCorrect,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        });
      }
    });

    const scorePercentage = questionsList.length > 0 ? Math.round((score / questionsList.length) * 100) : 100;
    const earnedXP = 100;

    // Reward XP to authenticated user profile if logged in
    let userXP = 0;
    let userLevel = 1;
    if (req.user?._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp += earnedXP;
        user.level = Math.floor(user.xp / 300) + 1;
        user.title = `Learner · Lv.${user.level}`;
        await user.save({ validateBeforeSave: false });
        userXP = user.xp;
        userLevel = user.level;
      }
    }

    res.status(200).json({
      success: true,
      message: `Quiz completed! You scored ${score}/${questionsList.length} (${scorePercentage}%)`,
      score,
      totalQuestions: questionsList.length,
      scorePercentage,
      earnedXP,
      userXP,
      userLevel,
      results,
    });
  } catch (error) {
    next(error);
  }
};
