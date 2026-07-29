import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

const app = express();

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsing Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PathAI Server API is up and running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      dashboard: "/api/dashboard",
      roadmaps: "/api/roadmaps",
      progress: "/api/progress",
      quizzes: "/api/quizzes",
      planner: "/api/planner",
      resources: "/api/resources",
    },
  });
});

// Mounted REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/resources", resourceRoutes);

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
