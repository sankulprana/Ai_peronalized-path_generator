# 🚀 PathAI - AI-Powered Personalized Career Roadmap Generator

PathAI is a full-stack **MERN** application equipped with an integrated **Random Forest Machine Learning Engine** and **Google Gemini Generative AI** (`gemini-1.5-flash`). It generates bespoke, interactive learning roadmaps tailored specifically to a user's chosen career role (*Backend Developer, Frontend Developer, Fullstack Engineer, AI Engineer, Mobile Developer, DevOps, Cybersecurity, or any custom role*), skill level (*Beginner, Intermediate, Advanced*), and target timeframe (*4, 8, or 12 weeks*).

---

## 🌟 Key Features

- 🎯 **Dynamic AI & ML Roadmap Engine**:
  - Automatically synthesizes tailored 4-phase structured curricula for preset or custom career roles.
  - Adapts phase density, task types (`theory`, `practice`, `project`, `review`), and estimated minutes based on experience level and duration.
- 🌲 **Single Integrated Random Forest ML Model**:
  - Uses an ensemble of Decision Trees to classify skill tiers, calculate pacing multipliers, and predict completion velocity.
- ⚡ **Interactive XP & Level Progress System**:
  - Real-time XP gain on topic completion and synchronized XP deduction on topic deselection.
  - Dynamically calculates Level progression (`300 XP` per level) with visual progress bars.
- 🔐 **Secure JWT Authentication**:
  - Encrypted password storage using **Bcrypt** hashing and **JSON Web Tokens** (JWT).
  - Resilient backend fail-safe mode supporting offline memory storage if local MongoDB is disconnected.
- 📅 **Study Planner & Focus Tracker**:
  - Interactive weekly schedule, focus session toggles, and study streak tracking.
- 💡 **AI Doubt Solver & Mentor**:
  - Context-aware technical Q&A powered by generative AI.
- 📝 **Skill Quizzes**:
  - Interactive domain-specific assessments with instant scoring and XP rewards.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Context API |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT (`jsonwebtoken`), Bcrypt.js |
| **Database** | MongoDB (Local Community Server / MongoDB Atlas) |
| **AI & ML** | Google Gemini API (`gemini-1.5-flash`), Custom Random Forest ML Engine |

---

## 📁 Project Architecture

```
Ai_peronalized-path_generator/
├── backend/
│   ├── config/             # DB Connection & Resilience Handler
│   ├── controllers/        # REST API Controllers (Auth, Roadmap, ML, Quiz, etc.)
│   ├── middleware/         # Auth Guard & Error Middleware
│   ├── ml/                 # Random Forest ML Engine & Predictions
│   ├── models/             # Mongoose Schemas (User, Roadmap, Progress, etc.)
│   ├── routes/             # Express REST Routes
│   ├── services/           # AI Service & Gemini Integration
│   └── server.js           # Server Entrypoint (Port 5000)
├── src/
│   ├── components/         # Reusable UI Components (PhaseCard, GoalCard, Topbar, Sidebar, etc.)
│   ├── context/            # AuthContext & HeaderContext (Global XP & User State)
│   ├── data/               # Domain Templates & Curriculum Synthesizer
│   ├── pages/              # Main App Views (Dashboard, Roadmap, StudyPlanner, Resources, etc.)
│   └── services/           # Axios/Fetch API Client Layer
├── public/                 # Static Assets
├── README.md               # Documentation
└── package.json            # Dependencies & Scripts
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas Cloud URI)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (backend/.env)
# Add the following configuration:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pathai
JWT_SECRET=pathai_super_secret_jwt_key_2024
GEMINI_API_KEY=your_optional_gemini_api_key_here

# Start backend server
npm run dev
```
*Backend runs at:* `http://localhost:5000/api`

### 3. Frontend Setup
```bash
# Open root directory
cd ..

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 📡 REST API Documentation Summary

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Log in user & receive JWT token | Public |
| `GET` | `/api/auth/profile` | Get logged-in user profile | Protected |
| `POST` | `/api/roadmaps/generate` | Generate AI/ML personalized roadmap | Optional |
| `GET` | `/api/roadmaps` | Get active user roadmaps | Optional |
| `PATCH` | `/api/roadmaps/:id/tasks/:taskId` | Toggle task status & update XP | Optional |
| `POST` | `/api/ml/predict` | Predict skill tier, velocity & RF roadmap | Public |
| `POST` | `/api/ai/doubt-solver` | Ask technical questions to AI mentor | Public |

---

## 📄 License

Distributed under the **MIT License**. Feel free to customize and expand!
