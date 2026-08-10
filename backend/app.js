import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

/**
 * CORS Configuration
 */
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile clients, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked request from this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Body Parsing Middlewares
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * Health Check & API Status Endpoint
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PathAI MERN Backend API is healthy & operational!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      dashboard: "/api/dashboard",
      roadmaps: "/api/roadmaps",
      progress: "/api/progress",
      planner: "/api/planner",
      resources: "/api/resources",
      ai: "/api/ai",
    },
  });
});

/**
 * Mounting Application REST API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai", aiRoutes);


/**
 * Centralized Error Handling Pipeline
 */
app.use(notFound);
app.use(errorHandler);

export default app;
