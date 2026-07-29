import {
  LayoutGrid,
  Map,
  CalendarDays,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Trophy,
  Brain,
  ClipboardList,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/" },
  { label: "Roadmap", icon: Map, path: "/roadmap" },
  { label: "Study Planner", icon: CalendarDays, path: "/study-planner" },
  { label: "Resources", icon: BookOpen, path: "/resources" },
  { label: "Doubt Solver", icon: MessageSquare, path: "/doubt-solver" },
  { label: "Progress", icon: TrendingUp, path: "/progress" },
  { label: "Achievements", icon: Trophy, path: "/achievements" },
];

export const user = {
  name: "Alex Chen",
  title: "Expert · Lv.5",
  initial: "A",
};

export const goal = {
  label: "Frontend Developer",
  heading: "Become a Frontend Developer",
  subtext: "Keep pushing — you're making solid progress on your path.",
  level: "Level 5 · Expert",
  progressPercent: 47,
  nextLevel: "Master",
  xpNeeded: 2000,
  stats: [
    { label: "Total XP", value: 1465 },
    { label: "Day Streak", value: 12 },
    { label: "Topics Done", value: "2/13" },
  ],
};

export const topStats = [
  { label: "Total XP Earned", value: "1465", icon: "bolt" },
  { label: "Day Streak", value: "12", icon: "flame" },
  { label: "Topics Completed", value: "2/13", icon: "check" },
  { label: "Current Level", value: "Lv. 5", icon: "star" },
];

export const roadmapItems = [
  { id: 1, title: "Flexbox & Grid Layout", xp: 60, active: true },
  { id: 2, title: "JavaScript Basics", xp: 70, active: false },
  { id: 3, title: "DOM Manipulation", xp: 65, active: false },
];

export const quickActions = [
  {
    icon: Brain,
    title: "Take Skill Quiz",
    subtitle: "Assess your current level",
    color: "purple",
  },
  {
    icon: Map,
    title: "View Roadmap",
    subtitle: "See your full learning path",
    color: "blue",
  },
  {
    icon: ClipboardList,
    title: "Study Planner",
    subtitle: "View scheduled sessions",
    color: "green",
  },
  {
    icon: BookOpen,
    title: "Browse Resources",
    subtitle: "Videos, docs & articles",
    color: "orange",
  },
  {
    icon: MessageSquare,
    title: "Ask AI Tutor",
    subtitle: "Get instant help on topics",
    color: "pink",
  },
];

export const roadmapMeta = {
  title: "Learning Roadmap",
  goalLabel: "Backend Developer",
  topicsDone: 2,
  topicsTotal: 15,
};

export const roadmapPhases = [
  {
    id: 1,
    phase: "PHASE 1",
    duration: "2 weeks",
    title: "Web Fundamentals",
    tasks: [
      { id: 1, title: "HTML & CSS Basics", xp: 50, completed: true },
      { id: 2, title: "JavaScript Essentials", xp: 80, completed: true },
      { id: 3, title: "Git & Version Control", xp: 40, completed: false },
    ],
  },
  {
    id: 2,
    phase: "PHASE 2",
    duration: "3 weeks",
    title: "Node.js & Express",
    tasks: [
      { id: 1, title: "Node.js Runtime", xp: 70, completed: false },
      { id: 2, title: "Express.js Framework", xp: 90, completed: false },
      { id: 3, title: "REST API Design", xp: 100, completed: false },
      { id: 4, title: "Middleware & Authentication", xp: 80, completed: false },
    ],
  },
  {
    id: 3,
    phase: "PHASE 3",
    duration: "3 weeks",
    title: "Databases",
    tasks: [
      { id: 1, title: "SQL with PostgreSQL", xp: 90, completed: false },
      { id: 2, title: "NoSQL with MongoDB", xp: 80, completed: false },
      { id: 3, title: "ORMs — Prisma & Sequelize", xp: 70, completed: false },
    ],
  },
  {
    id: 4,
    phase: "PHASE 4",
    duration: "4 weeks",
    title: "Advanced Backend",
    tasks: [
      { id: 1, title: "Docker & Containers", xp: 100, completed: false },
      { id: 2, title: "GraphQL APIs", xp: 90, completed: false },
      { id: 3, title: "Redis & Caching", xp: 80, completed: false },
      { id: 4, title: "WebSockets & Real-time", xp: 85, completed: false },
      { id: 5, title: "Security Best Practices", xp: 70, completed: false },
    ],
  },
];

export const weeklyXP = [
  { week: "W1", value: 22 },
  { week: "W2", value: 45 },
  { week: "W3", value: 30 },
  { week: "W4", value: 68 },
  { week: "W5", value: 52 },
  { week: "W6", value: 72 },
  { week: "W7", value: 58 },
  { week: "W8", value: 85 },
];

export const studyPlannerData = {
  title: "Study Planner",
  weekRange: "Week of July 14–20, 2025",
  totalHours: "8.5 hours scheduled",
  todayDate: "Thursday, July 17",
  legend: [
    { label: "Theory", color: "purple", dotBg: "bg-purple-400" },
    { label: "Practice", color: "sky", dotBg: "bg-sky-400" },
    { label: "Review", color: "emerald", dotBg: "bg-emerald-400" },
    { label: "Project", color: "amber", dotBg: "bg-amber-400" },
  ],
  days: [
    {
      dayName: "Mon",
      dayNum: 14,
      isToday: false,
      sessions: [
        { title: "Node.js Runtime", time: "7:00 AM", duration: "60m", type: "theory" },
        { title: "Practice Exercises", time: "8:00 PM", duration: "30m", type: "practice" },
      ],
    },
    {
      dayName: "Tue",
      dayNum: 15,
      isToday: false,
      sessions: [
        { title: "Express.js Basics", time: "7:00 AM", duration: "45m", type: "theory" },
      ],
    },
    {
      dayName: "Wed",
      dayNum: 16,
      isToday: false,
      sessions: [
        { title: "Express.js Advanced", time: "7:00 AM", duration: "60m", type: "theory" },
        { title: "Code Review", time: "7:00 PM", duration: "30m", type: "review" },
      ],
    },
    {
      dayName: "Thu",
      dayNum: 17,
      isToday: true,
      sessions: [
        { title: "REST API Design", time: "7:00 AM", duration: "45m", type: "practice" },
      ],
    },
    {
      dayName: "Fri",
      dayNum: 18,
      isToday: false,
      sessions: [
        { title: "Project: Build an API", time: "7:00 AM", duration: "90m", type: "project" },
      ],
    },
    {
      dayName: "Sat",
      dayNum: 19,
      isToday: false,
      sessions: [
        { title: "Weekly Review", time: "10:00 AM", duration: "120m", type: "review" },
        { title: "GraphQL Intro", time: "2:00 PM", duration: "45m", type: "theory" },
      ],
    },
    {
      dayName: "Sun",
      dayNum: 20,
      isToday: false,
      isRest: true,
      sessions: [],
    },
  ],
  todayFocus: {
    title: "REST API Design",
    time: "7:00 AM",
    duration: "45 minutes",
    phase: "Phase 2",
    xpReward: 100,
    sessionsCount: 1,
    plannedMinutes: 45,
  },
};

export const resourcesData = {
  title: "Learning Resources",
  subtitle: "Hand-picked free resources for your Backend Developer path",
  categories: [
    { id: "youtube", label: "YouTube" },
    { id: "docs", label: "Documentation" },
    { id: "articles", label: "Articles" },
  ],
  items: {
    youtube: [
      {
        id: 1,
        tag: "Node.js",
        title: "Node.js Crash Course 2024",
        author: "Traversy Media",
        views: "4.2M views",
        duration: "1:30:22",
        url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
      },
      {
        id: 2,
        tag: "Express",
        title: "Express.js Full Course",
        author: "freeCodeCamp",
        views: "2.8M views",
        duration: "2:15:44",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      },
      {
        id: 3,
        tag: "SQL",
        title: "PostgreSQL Tutorial for Beginners",
        author: "TechWorld with Nana",
        views: "1.9M views",
        duration: "1:45:00",
        url: "https://www.youtube.com/watch?v=qw--VYLpxG4",
      },
      {
        id: 4,
        tag: "Docker",
        title: "Docker Tutorial for Beginners",
        author: "Programming with Mosh",
        views: "3.5M views",
        duration: "1:08:15",
        url: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
      },
      {
        id: 5,
        tag: "REST API",
        title: "REST APIs for Beginners - Full Course",
        author: "Academind",
        views: "1.4M views",
        duration: "1:12:00",
        url: "https://www.youtube.com/watch?v=-MTSQjw5DrM",
      },
      {
        id: 6,
        tag: "Redis",
        title: "Redis Crash Course",
        author: "Fireship",
        views: "850K views",
        duration: "12:45",
        url: "https://www.youtube.com/watch?v=G1rOthIU-uo",
      },
    ],
    docs: [
      {
        id: 101,
        tag: "Node.js",
        title: "Official Node.js Documentation & Guides",
        author: "nodejs.org",
        views: "Official Doc",
        duration: "15 min read",
        url: "https://nodejs.org/docs",
      },
      {
        id: 102,
        tag: "Express",
        title: "Express.js API Reference & Middleware",
        author: "expressjs.com",
        views: "Official Doc",
        duration: "20 min read",
        url: "https://expressjs.com",
      },
      {
        id: 103,
        tag: "PostgreSQL",
        title: "PostgreSQL Official Documentation Manual",
        author: "postgresql.org",
        views: "Official Doc",
        duration: "30 min read",
        url: "https://www.postgresql.org/docs/",
      },
    ],
    articles: [
      {
        id: 201,
        tag: "Architecture",
        title: "Understanding the Node.js Event Loop Architecture",
        author: "Medium · Engineering",
        views: "450K reads",
        duration: "8 min read",
        url: "https://medium.com",
      },
      {
        id: 202,
        tag: "Security",
        title: "JWT Authentication & Best Practices for REST APIs",
        author: "Dev.to",
        views: "320K reads",
        duration: "10 min read",
        url: "https://dev.to",
      },
      {
        id: 203,
        tag: "Database",
        title: "SQL vs NoSQL: How to Choose the Right Database",
        author: "DigitalOcean Tutorials",
        views: "610K reads",
        duration: "12 min read",
        url: "https://www.digitalocean.com/community/tutorials",
      },
    ],
  },
};

export const doubtSolverData = {
  title: "AI Doubt Solver",
  status: "Online · Ask me anything about your learning path",
  suggestedQuestions: [
    "Explain Node.js event loop",
    "How does async/await work?",
    "What is REST API?",
    "Explain Docker basics",
    "How to use Redis caching?",
  ],
  initialMessages: [
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm your AI learning assistant. Ask me anything about coding concepts, your learning path, or career advice. I'm here to help! 🤖",
      timestamp: "Just now",
    },
  ],
  presetAnswers: {
    "Explain Node.js event loop":
      "The Node.js Event Loop is single-threaded and allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel whenever possible.\n\nIt runs through 6 main phases:\n1. Timers: Executes callbacks scheduled by setTimeout()\n2. Pending Callbacks: Executes I/O callbacks deferred to the next loop iteration\n3. Idle, Prepare: Internal processing\n4. Poll: Retrieves new I/O events\n5. Check: Executes setImmediate() callbacks\n6. Close Callbacks: Executes socket close handlers",
    "How does async/await work?":
      "`async/await` is syntactic sugar built on top of JavaScript Promises.\n\n- `async` function declaration turns it into an asynchronous function returning a Promise.\n- `await` pauses execution until the Promise resolves, making asynchronous code look and behave like synchronous code.",
    "What is REST API?":
      "REST (Representational State Transfer) is an architectural style for network applications.\n\nCore principles:\n• Stateless request handling\n• Client-Server separation\n• Cacheable data responses\n• Standardized HTTP methods (GET, POST, PUT, DELETE)",
    "Explain Docker basics":
      "Docker packages software into isolated units called Containers.\n\n• Dockerfile: Script to build container images\n• Image: Read-only application snapshot\n• Container: Running instance of an image",
    "How to use Redis caching?":
      "Redis is an in-memory data store for caching fast key-value data.\n\nWorkflow:\n1. App receives data request\n2. Checks Redis cache first (Cache Hit -> return value)\n3. If missing (Cache Miss), queries main DB & writes to Redis with expiration time (TTL)",
  },
};

export const progressData = {
  title: "Progress Tracker",
  subtitle: "Skills, activity, and milestones overview",
  skillsRadar: [
    { label: "JavaScript", value: 0.72 },
    { label: "Node.js", value: 0.35 },
    { label: "Databases", value: 0.28 },
    { label: "APIs", value: 0.45 },
    { label: "DevOps", value: 0.15 },
    { label: "Security", value: 0.2 },
  ],
  xpGrowth: [
    { week: "W1", xp: 120 },
    { week: "W2", xp: 280 },
    { week: "W3", xp: 190 },
    { week: "W4", xp: 420 },
    { week: "W5", xp: 350 },
    { week: "W6", xp: 510 },
    { week: "W7", xp: 480 },
    { week: "W8", xp: 630 },
  ],
  skillsBreakdown: [
    { label: "JavaScript", percent: 72, color: "bg-emerald-500" },
    { label: "Node.js", percent: 35, color: "bg-slate-700" },
    { label: "Databases", percent: 28, color: "bg-slate-700" },
    { label: "APIs", percent: 45, color: "bg-violet-600" },
    { label: "DevOps", percent: 15, color: "bg-slate-700" },
    { label: "Security", percent: 20, color: "bg-slate-700" },
  ],
  streak: {
    count: 12,
    totalDays: 35,
    days: [
      "none", "none", "none", "none", "none", "none", "none",
      "none", "none", "none", "none", "none", "none", "none",
      "none", "none", "none", "none", "none", "none", "none",
      "studied", "studied", "studied", "studied", "studied", "studied", "studied",
      "studied", "studied", "studied", "studied", "studied", "studied", "today"
    ],
  },
};

export const achievementsData = {
  title: "Achievements",
  subtitle: "Your XP, levels, and earned badges",
  currentLevel: {
    levelNum: 3,
    levelName: "Learner",
    currentXP: 420,
    maxXP: 600,
    xpNeeded: 180,
    nextLevelName: "Developer",
  },
  levelProgression: [
    { level: 1, name: "Apprentice", xp: "0 XP", status: "completed" },
    { level: 2, name: "Novice", xp: "100 XP", status: "completed" },
    { level: 3, name: "Learner", xp: "300 XP", status: "active" },
    { level: 4, name: "Developer", xp: "600 XP", status: "locked" },
    { level: 5, name: "Expert", xp: "1000 XP", status: "locked" },
    { level: 6, name: "Master", xp: "2000 XP", status: "locked" },
  ],
  badges: {
    earnedCount: 3,
    totalCount: 8,
    list: [
      {
        id: 1,
        title: "First Step",
        desc: "Complete your first topic",
        icon: "🌱",
        earned: true,
      },
      {
        id: 2,
        title: "Week Warrior",
        desc: "7-day study streak",
        icon: "🔥",
        earned: true,
      },
      {
        id: 3,
        title: "Quiz Ace",
        desc: "Score 80%+ on skill assessment",
        icon: "🧠",
        earned: true,
      },
      {
        id: 4,
        title: "Phase 1 Clear",
        desc: "Complete Phase 1 of roadmap",
        icon: "🔒",
        earned: false,
      },
      {
        id: 5,
        title: "API Builder",
        desc: "Complete all API topics",
        icon: "🔒",
        earned: false,
      },
      {
        id: 6,
        title: "DB Master",
        desc: "Complete all database topics",
        icon: "🔒",
        earned: false,
      },
      {
        id: 7,
        title: "Streak Legend",
        desc: "30-day study streak",
        icon: "🔒",
        earned: false,
      },
      {
        id: 8,
        title: "Roadmap Complete",
        desc: "Finish the entire roadmap",
        icon: "🔒",
        earned: false,
      },
    ],
  },
};


