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
  { label: "Total XP Earned", value: "0 XP", icon: "bolt" },
  { label: "Day Streak", value: "0 days", icon: "flame" },
  { label: "Topics Completed", value: "0/12", icon: "check" },
  { label: "Current Level", value: "Lv. 1", icon: "star" },
];

export const domainTopics = {
  "Backend Developer": [
    { id: "1", title: "Node.js Architecture & Event Loop Fundamentals", xp: 60, completed: false, active: true },
    { id: "2", title: "Express.js Routing & Middleware Pipeline", xp: 70, completed: false },
    { id: "3", title: "RESTful API Specs & JSON Payload Validation", xp: 65, completed: false },
    { id: "4", title: "MongoDB Schema Modeling & Mongoose Queries", xp: 85, completed: false },
    { id: "5", title: "Authentication with JWT & Password Hashing", xp: 90, completed: false },
  ],
  "Frontend Developer": [
    { id: "1", title: "HTML5 Semantic Architecture & Accessibility", xp: 50, completed: false, active: true },
    { id: "2", title: "CSS Flexbox & Responsive Grid Layouts", xp: 60, completed: false },
    { id: "3", title: "Modern JavaScript ES6+ Async/Await Control", xp: 75, completed: false },
    { id: "4", title: "React Component Lifecycle & Custom Hooks", xp: 85, completed: false },
    { id: "5", title: "Tailwind CSS Design Tokens & Micro-Animations", xp: 65, completed: false },
  ],
  "AI & Data Science": [
    { id: "1", title: "Python Data Structures & NumPy Vectorization", xp: 60, completed: false, active: true },
    { id: "2", title: "Pandas Data Cleaning & Feature Engineering", xp: 70, completed: false },
    { id: "3", title: "Supervised Learning Models with Scikit-Learn", xp: 85, completed: false },
    { id: "4", title: "Neural Networks & PyTorch Tensors Fundamentals", xp: 95, completed: false },
    { id: "5", title: "Large Language Models & Prompt Engineering", xp: 100, completed: false },
  ],
  "Fullstack Engineer": [
    { id: "1", title: "Fullstack App Architecture & Project Structuring", xp: 65, completed: false, active: true },
    { id: "2", title: "React Frontend with Express REST Backend Integration", xp: 80, completed: false },
    { id: "3", title: "PostgreSQL Relational Design & Prisma ORM", xp: 85, completed: false },
    { id: "4", title: "Containerization with Docker & Environment Config", xp: 90, completed: false },
  ],
  "Mobile Developer": [
    { id: "1", title: "React Native Mobile Component Basics & State", xp: 60, completed: false, active: true },
    { id: "2", title: "Mobile Navigation & Stack Screen Routing", xp: 70, completed: false },
    { id: "3", title: "AsyncStorage & Local Offline Persistence", xp: 75, completed: false },
    { id: "4", title: "Native Device API Integration (Camera/Location)", xp: 90, completed: false },
  ],
  "DevOps & Cloud": [
    { id: "1", title: "Linux Shell Scripting & CLI Fundamentals", xp: 60, completed: false, active: true },
    { id: "2", title: "Docker Containerization & Multi-stage Builds", xp: 80, completed: false },
    { id: "3", title: "Kubernetes Cluster Pods & Deployment Services", xp: 95, completed: false },
    { id: "4", title: "CI/CD Pipeline Automation with GitHub Actions", xp: 85, completed: false },
  ],
  "Cybersecurity": [
    { id: "1", title: "Networking Protocols TCP/IP & HTTP Security", xp: 65, completed: false, active: true },
    { id: "2", title: "OWASP Top 10 Web Vulnerabilities & Prevention", xp: 85, completed: false },
    { id: "3", title: "Symmetric & Asymmetric Cryptography Basics", xp: 80, completed: false },
  ],
};

export const roadmapItems = domainTopics["Backend Developer"];

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

export const domainPhases = {
  "Backend Developer": [
    {
      id: "b1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Web & Network Fundamentals",
      description: "Master HTTP/HTTPS, REST principles, Git workflows, and asynchronous JS mechanics.",
      tasks: [
        { id: "b1_1", title: "HTML5 & CSS3 Core Architecture", xp: 50, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "b1_2", title: "JavaScript ES6+ & Asynchronous Event Loop", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "b1_3", title: "Git & GitHub Team Workflows", xp: 40, type: "practice", estimatedMinutes: 30, completed: false },
        { id: "b1_4", title: "HTTP Protocol, Methods & Status Codes", xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "b2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "Node.js & Express Framework",
      description: "Build robust backend servers with Express, controllers, routing, and request validation.",
      tasks: [
        { id: "b2_1", title: "Node.js Core Modules & Non-blocking I/O", xp: 70, type: "theory", estimatedMinutes: 60, completed: false },
        { id: "b2_2", title: "Express.js Architecture & Middleware", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "b2_3", title: "RESTful API Design & Payload Validation", xp: 100, type: "practice", estimatedMinutes: 90, completed: false },
        { id: "b2_4", title: "Middleware Pipeline & JWT Authentication", xp: 85, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
    {
      id: "b3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Database Engineering (SQL & NoSQL)",
      description: "Design relational schemas, MongoDB documents, indexing, and ORM pipelines.",
      tasks: [
        { id: "b3_1", title: "Relational Modeling with PostgreSQL & SQL", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "b3_2", title: "NoSQL Modeling with MongoDB & Mongoose", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "b3_3", title: "Database Indexing & Query Optimization", xp: 75, type: "review", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "b4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "4 weeks",
      title: "Advanced Architecture & Cloud Security",
      description: "Containerize microservices with Docker, add Redis caching, and enforce OWASP security.",
      tasks: [
        { id: "b4_1", title: "Docker Containerization & Multi-Stage Builds", xp: 100, type: "practice", estimatedMinutes: 90, completed: false },
        { id: "b4_2", title: "Redis In-Memory Caching & Session Store", xp: 80, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "b4_3", title: "GraphQL API Construction & Resolvers", xp: 90, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "b4_4", title: "API Security, Rate Limiting & OWASP Defense", xp: 70, type: "review", estimatedMinutes: 60, completed: false },
      ],
    },
  ],

  "Frontend Developer": [
    {
      id: "f1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Modern HTML, CSS & Responsive Systems",
      description: "Build responsive, accessible, pixel-perfect user interfaces with modern CSS and Tailwind.",
      tasks: [
        { id: "f1_1", title: "Semantic HTML5 & Web Accessibility (a11y)", xp: 50, type: "theory", estimatedMinutes: 40, completed: false },
        { id: "f1_2", title: "CSS Flexbox & Responsive Grid Layouts", xp: 60, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "f1_3", title: "Tailwind CSS Utility Design System", xp: 70, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "f1_4", title: "Modern JavaScript ES6+, DOM & Fetch API", xp: 80, type: "practice", estimatedMinutes: 50, completed: false },
      ],
    },
    {
      id: "f2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "React Core & State Architecture",
      description: "Master React component trees, custom hooks, state lifecycles, and client-side routing.",
      tasks: [
        { id: "f2_1", title: "JSX, Component Props & Composition Patterns", xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "f2_2", title: "State Management with useState & useReducer", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "f2_3", title: "Custom Hooks & useEffect Dependencies", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "f2_4", title: "Client-Side Routing with React Router v6", xp: 70, type: "practice", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "f3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Fullstack React & Next.js Ecosystem",
      description: "Leverage Next.js App Router, Server Components, SSR/SSG caching, and global state.",
      tasks: [
        { id: "f3_1", title: "Global State with Zustand & Redux Toolkit", xp: 95, type: "project", estimatedMinutes: 90, completed: false },
        { id: "f3_2", title: "Next.js App Router, Server Actions & SSR", xp: 110, type: "project", estimatedMinutes: 120, completed: false },
        { id: "f3_3", title: "Frontend Performance & Lighthouse Audits", xp: 80, type: "review", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "f4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "2 weeks",
      title: "UI Testing, CI/CD & Production Ship",
      description: "Write unit and e2e tests, optimize bundle sizes, and deploy with continuous integration.",
      tasks: [
        { id: "f4_1", title: "Unit Testing with Vitest & RTL", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "f4_2", title: "End-to-End Testing with Playwright", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "f4_3", title: "CI/CD Deployment & Web Vitals Optimization", xp: 75, type: "project", estimatedMinutes: 60, completed: false },
      ],
    },
  ],

  "Fullstack Engineer": [
    {
      id: "fs1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "3 weeks",
      title: "Frontend Foundations & Modern React",
      description: "Master TypeScript, component composition, and responsive client layouts.",
      tasks: [
        { id: "fs1_1", title: "TypeScript Core Types & Generics for React", xp: 70, type: "theory", estimatedMinutes: 50, completed: false },
        { id: "fs1_2", title: "React Custom Hooks & Tailwind UI Patterns", xp: 85, type: "practice", estimatedMinutes: 70, completed: false },
        { id: "fs1_3", title: "Client Asynchronous State & React Query", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: "fs2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "Backend API Engineering & Auth Systems",
      description: "Build robust REST APIs, JWT authentication with refresh tokens, and relational models.",
      tasks: [
        { id: "fs2_1", title: "Express.js REST Architecture & Routing Pipelines", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "fs2_2", title: "Secure User Auth with JWT & Refresh Tokens", xp: 95, type: "project", estimatedMinutes: 90, completed: false },
        { id: "fs2_3", title: "PostgreSQL Database Schema & Prisma ORM", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
      ],
    },
    {
      id: "fs3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Fullstack Synchronization & WebSockets",
      description: "Implement real-time bidirectional messaging, optimistic UI, and Redis caching.",
      tasks: [
        { id: "fs3_1", title: "End-to-End Fullstack Data Synchronization", xp: 100, type: "project", estimatedMinutes: 100, completed: false },
        { id: "fs3_2", title: "Real-time Communication with WebSockets", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "fs3_3", title: "Redis Caching & Session Storage", xp: 80, type: "theory", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "fs4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "3 weeks",
      title: "DevOps, Containerization & Production Cloud",
      description: "Dockerize fullstack services, set up GitHub Actions CI/CD, and deploy on AWS.",
      tasks: [
        { id: "fs4_1", title: "Docker Containerization for Fullstack Stacks", xp: 100, type: "practice", estimatedMinutes: 90, completed: false },
        { id: "fs4_2", title: "GitHub Actions CI/CD Automation", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "fs4_3", title: "Production Cloud Deployment & Monitoring", xp: 110, type: "project", estimatedMinutes: 120, completed: false },
      ],
    },
  ],

  "AI Engineer": [
    {
      id: "ai1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Python, Math & Data Engineering",
      description: "Master Python data structures, Linear Algebra, NumPy vectorization, and Pandas dataframes.",
      tasks: [
        { id: "ai1_1", title: "Python Advanced Syntax, OOP & Functional Paradigms", xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "ai1_2", title: "NumPy Matrix Computations & Vectorization", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "ai1_3", title: "Pandas Data Cleaning & Feature Engineering", xp: 85, type: "practice", estimatedMinutes: 70, completed: false },
        { id: "ai1_4", title: "Applied Mathematics: Calculus & Linear Algebra", xp: 70, type: "theory", estimatedMinutes: 50, completed: false },
      ],
    },
    {
      id: "ai2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "Machine Learning Core (Scikit-Learn)",
      description: "Build supervised and unsupervised ML models, loss functions, and evaluation metrics.",
      tasks: [
        { id: "ai2_1", title: "Supervised Learning: Regression, Trees & SVMs", xp: 85, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "ai2_2", title: "Unsupervised Clustering (K-Means, PCA)", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "ai2_3", title: "Cross-Validation, Hyperparameter Tuning & ROC/AUC", xp: 75, type: "review", estimatedMinutes: 45, completed: false },
        { id: "ai2_4", title: "Building an End-to-End ML Prediction Pipeline", xp: 100, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
    {
      id: "ai3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Deep Learning & Neural Networks (PyTorch)",
      description: "Design convolutional, recurrent, and transformer architectures in PyTorch.",
      tasks: [
        { id: "ai3_1", title: "Neural Network Forward/Backward Pass & PyTorch Tensors", xp: 90, type: "theory", estimatedMinutes: 60, completed: false },
        { id: "ai3_2", title: "Convolutional Neural Networks (CNNs) for Vision", xp: 95, type: "practice", estimatedMinutes: 80, completed: false },
        { id: "ai3_3", title: "Transformer Architecture & Self-Attention Mechanisms", xp: 100, type: "theory", estimatedMinutes: 90, completed: false },
      ],
    },
    {
      id: "ai4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "4 weeks",
      title: "LLMs, LangChain, RAG & AI Agent Workflows",
      description: "Deploy Large Language Models, Vector Databases, Retrieval-Augmented Generation, and AI APIs.",
      tasks: [
        { id: "ai4_1", title: "OpenAI, Gemini & Anthropic API Orchestration", xp: 90, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "ai4_2", title: "Vector Embeddings & Pinecone/Chroma Vector DBs", xp: 95, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "ai4_3", title: "Retrieval-Augmented Generation (RAG) with LangChain", xp: 110, type: "project", estimatedMinutes: 120, completed: false },
        { id: "ai4_4", title: "Autonomous AI Agent Workflows & Tool Calling", xp: 100, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
  ],

  "Mobile Developer": [
    {
      id: "m1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Mobile Architecture & React Native Core",
      description: "Build cross-platform mobile UI components, styling, and navigation.",
      tasks: [
        { id: "m1_1", title: "React Native Core Components & StyleSheet API", xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "m1_2", title: "Flexbox Layout for iOS & Android Screen Form Factors", xp: 75, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "m1_3", title: "Stack & Bottom Tab Navigation with React Navigation", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: "m2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "State, Offline Storage & Native Device APIs",
      description: "Integrate device cameras, GPS location, push notifications, and offline caching.",
      tasks: [
        { id: "m2_1", title: "AsyncStorage & SQLite Local Offline Persistence", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "m2_2", title: "Native Sensors, Camera & Geolocation APIs", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "m2_3", title: "Push Notifications with Firebase Cloud Messaging", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: "m3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Backend Sync, Biometric Auth & Security",
      description: "Connect mobile apps to REST/GraphQL backends with biometric security.",
      tasks: [
        { id: "m3_1", title: "Biometric Authentication (FaceID / Fingerprint)", xp: 90, type: "project", estimatedMinutes: 75, completed: false },
        { id: "m3_2", title: "Optimistic UI Updates & Offline-first Syncing", xp: 95, type: "project", estimatedMinutes: 90, completed: false },
        { id: "m3_3", title: "Mobile Profiling & Memory Leak Optimization", xp: 75, type: "review", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "m4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "2 weeks",
      title: "App Store Publishing & Fastlane CI/CD",
      description: "Prepare production release builds for Apple App Store and Google Play Store.",
      tasks: [
        { id: "m4_1", title: "App Signing, Keystores & Provisioning Profiles", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "m4_2", title: "Fastlane Mobile CI/CD Automation", xp: 95, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "m4_3", title: "Publishing to Apple App Store & Google Play", xp: 100, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
  ],

  "DevOps Specialist": [
    {
      id: "d1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Linux Systems, Shell & Networking",
      description: "Master Linux system administration, Bash automation, and TCP/IP networking.",
      tasks: [
        { id: "d1_1", title: "Linux CLI Mastery, Permissions & Systemd", xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
        { id: "d1_2", title: "Bash Shell Scripting & Automation Pipelines", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "d1_3", title: "Networking Protocols: DNS, TLS/SSL, Load Balancing", xp: 70, type: "theory", estimatedMinutes: 50, completed: false },
      ],
    },
    {
      id: "d2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "Docker Containerization & Image Optimization",
      description: "Create lightweight, secure Docker containers and multi-container Compose stacks.",
      tasks: [
        { id: "d2_1", title: "Dockerfile Optimization & Alpine Base Images", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "d2_2", title: "Multi-container Networking with Docker Compose", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "d2_3", title: "Container Security Auditing & Vulnerability Scans", xp: 75, type: "review", estimatedMinutes: 45, completed: false },
      ],
    },
    {
      id: "d3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "Kubernetes Orchestration & Helm Charts",
      description: "Deploy and manage resilient Kubernetes clusters, pods, services, and ingress.",
      tasks: [
        { id: "d3_1", title: "Kubernetes Architecture (Pods, Deployments, Services)", xp: 100, type: "practice", estimatedMinutes: 90, completed: false },
        { id: "d3_2", title: "ConfigMaps, Secrets & Ingress Controller Routing", xp: 95, type: "practice", estimatedMinutes: 80, completed: false },
        { id: "d3_3", title: "Package Management with Helm Charts", xp: 90, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: "d4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "4 weeks",
      title: "Infrastructure as Code & CI/CD Pipelines",
      description: "Automate cloud infrastructure with Terraform and continuous delivery pipelines.",
      tasks: [
        { id: "d4_1", title: "Terraform Infrastructure as Code (IaC) on AWS", xp: 110, type: "project", estimatedMinutes: 100, completed: false },
        { id: "d4_2", title: "GitHub Actions & GitLab CI/CD Automation", xp: 95, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "d4_3", title: "Observability: Prometheus, Grafana & ELK Stack", xp: 85, type: "review", estimatedMinutes: 60, completed: false },
      ],
    },
  ],

  "Cybersecurity": [
    {
      id: "c1",
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: "2 weeks",
      title: "Security Foundations & Cryptography",
      description: "Master network security, packet analysis, ciphers, and public key cryptography.",
      tasks: [
        { id: "c1_1", title: "TCP/IP Packet Analysis with Wireshark", xp: 70, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "c1_2", title: "Symmetric & Asymmetric Cryptography (AES, RSA, ECC)", xp: 80, type: "theory", estimatedMinutes: 60, completed: false },
        { id: "c1_3", title: "Authentication, PKI & TLS/SSL Handshakes", xp: 75, type: "theory", estimatedMinutes: 50, completed: false },
      ],
    },
    {
      id: "c2",
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: "3 weeks",
      title: "Web Application Security & OWASP Top 10",
      description: "Identify and patch critical vulnerabilities like SQLi, XSS, CSRF, and SSRF.",
      tasks: [
        { id: "c2_1", title: "SQL Injection & Cross-Site Scripting (XSS)", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "c2_2", title: "Cross-Site Request Forgery (CSRF) & CORS Headers", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: "c2_3", title: "Burp Suite Web Penetration Testing Suite", xp: 100, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
    {
      id: "c3",
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: "3 weeks",
      title: "System & Cloud Infrastructure Defense",
      description: "Harden Linux/Windows servers, configure firewalls, and secure cloud workloads.",
      tasks: [
        { id: "c3_1", title: "Linux Server Hardening & IPTables Firewalls", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "c3_2", title: "Cloud Security: AWS IAM, VPCs & Security Groups", xp: 95, type: "practice", estimatedMinutes: 80, completed: false },
        { id: "c3_3", title: "Vulnerability Scanning with Nmap & OpenVAS", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: "c4",
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: "3 weeks",
      title: "Incident Response & Ethical Hacking",
      description: "Perform penetration testing, forensic log analysis, and threat hunting.",
      tasks: [
        { id: "c4_1", title: "Metasploit Framework & Privilege Escalation", xp: 100, type: "project", estimatedMinutes: 90, completed: false },
        { id: "c4_2", title: "SIEM Log Analysis with Splunk & Incident Response", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: "c4_3", title: "Ethical Hacking Capstone & Security Audit Report", xp: 110, type: "project", estimatedMinutes: 120, completed: false },
      ],
    },
  ],
};

domainPhases["AI & Data Science"] = domainPhases["AI Engineer"];
domainPhases["Machine Learning Engineer"] = domainPhases["AI Engineer"];
domainPhases["DevOps & Cloud"] = domainPhases["DevOps Specialist"];
domainPhases["Cybersecurity Specialist"] = domainPhases["Cybersecurity"];
domainPhases["Mobile App Development"] = domainPhases["Mobile Developer"];

/**
 * Synthesizes a bespoke 4-phase learning path for ANY custom role
 */
export const synthesizeCustomRolePhases = (roleName = "Software Engineer", durationWeeks = 8) => {
  const weeksPerPhase = Math.max(1, Math.floor(durationWeeks / 4));
  const cleanRole = roleName.trim();
  const prefix = cleanRole.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 5);

  return [
    {
      id: `${prefix}_p1`,
      phaseNumber: 1,
      phase: "PHASE 1",
      duration: `${weeksPerPhase} weeks`,
      title: `${cleanRole} Core Fundamentals & Tooling`,
      description: `Master foundational principles, development environment setup, and primary tools for ${cleanRole}.`,
      tasks: [
        { id: `${prefix}_1_1`, title: `${cleanRole} Architecture & Core Concepts`, xp: 60, type: "theory", estimatedMinutes: 45, completed: false },
        { id: `${prefix}_1_2`, title: "Essential Programming & Environment Setup", xp: 75, type: "practice", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_1_3`, title: `Version Control & Best Practices in ${cleanRole}`, xp: 65, type: "practice", estimatedMinutes: 45, completed: false },
        { id: `${prefix}_1_4`, title: "Foundational Practical Exercises", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
      ],
    },
    {
      id: `${prefix}_p2`,
      phaseNumber: 2,
      phase: "PHASE 2",
      duration: `${weeksPerPhase} weeks`,
      title: "Applied Techniques & Intermediate Engineering",
      description: `Build functional modules, handle data flow, error handling, and standard patterns in ${cleanRole}.`,
      tasks: [
        { id: `${prefix}_2_1`, title: `Component & Module Design in ${cleanRole}`, xp: 85, type: "theory", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_2_2`, title: "Implementing Core Features & Data Processing", xp: 90, type: "practice", estimatedMinutes: 75, completed: false },
        { id: `${prefix}_2_3`, title: "Debugging & Asynchronous Execution", xp: 80, type: "practice", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_2_4`, title: `Hands-on Project: ${cleanRole} Prototype`, xp: 100, type: "project", estimatedMinutes: 90, completed: false },
      ],
    },
    {
      id: `${prefix}_p3`,
      phaseNumber: 3,
      phase: "PHASE 3",
      duration: `${weeksPerPhase} weeks`,
      title: "Advanced Architecture, Performance & Scalability",
      description: "Implement production-grade architecture, caching, security safeguards, and system scaling.",
      tasks: [
        { id: `${prefix}_3_1`, title: "Design Patterns & Clean Code Architecture", xp: 90, type: "theory", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_3_2`, title: "Performance Profiling & Bottleneck Optimization", xp: 95, type: "practice", estimatedMinutes: 75, completed: false },
        { id: `${prefix}_3_3`, title: "Security Hardening & Industry Best Practices", xp: 85, type: "review", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_3_4`, title: "Integration with Cloud & External APIs", xp: 100, type: "practice", estimatedMinutes: 80, completed: false },
      ],
    },
    {
      id: `${prefix}_p4`,
      phaseNumber: 4,
      phase: "PHASE 4",
      duration: `${weeksPerPhase} weeks`,
      title: "Production Deployment & Capstone Project",
      description: `Ship an enterprise-ready ${cleanRole} capstone portfolio project with automated CI/CD and testing.`,
      tasks: [
        { id: `${prefix}_4_1`, title: "Automated Testing & Quality Assurance", xp: 85, type: "practice", estimatedMinutes: 60, completed: false },
        { id: `${prefix}_4_2`, title: "CI/CD Deployment & Cloud Hosting", xp: 95, type: "practice", estimatedMinutes: 75, completed: false },
        { id: `${prefix}_4_3`, title: `Full-scale ${cleanRole} Capstone Portfolio Project`, xp: 120, type: "project", estimatedMinutes: 120, completed: false },
      ],
    },
  ];
};

/**
 * Returns dynamic roadmap metadata and phases tailored to the specified role
 */
export const getRoadmapForRole = (targetRole = "Backend Developer", skillLevel = "intermediate", durationWeeks = 8) => {
  const weeksPerPhase = Math.max(1, Math.round((parseInt(durationWeeks, 10) || 8) / 4));
  const isBeginner = skillLevel.toLowerCase() === "beginner";
  const isAdvanced = skillLevel.toLowerCase() === "advanced";
  const cleanRole = targetRole.trim();
  const prefix = cleanRole.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 5);

  let phases = [];

  if (isBeginner) {
    phases = [
      {
        id: `${prefix}_p1`,
        phaseNumber: 1,
        phase: "PHASE 1",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: `${cleanRole} Fundamentals & Setup`,
        description: `Introduction to foundational concepts, tools, and syntax for ${cleanRole}.`,
        tasks: [
          { id: `${prefix}_1_1`, title: `${cleanRole} Environment & Tooling Setup`, xp: 50, type: "theory", estimatedMinutes: 40, completed: false },
          { id: `${prefix}_1_2`, title: "Variables, Data Types & Basic Logic", xp: 60, type: "practice", estimatedMinutes: 45, completed: false },
          { id: `${prefix}_1_3`, title: "Git & Version Control Step-by-Step", xp: 45, type: "practice", estimatedMinutes: 30, completed: false },
          { id: `${prefix}_1_4`, title: "Guided Exercises: First Code Script", xp: 65, type: "practice", estimatedMinutes: 60, completed: false },
        ],
      },
      {
        id: `${prefix}_p2`,
        phaseNumber: 2,
        phase: "PHASE 2",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Building Blocks & Key Libraries",
        description: `Learn essential packages, control structures, and simple data processing.`,
        tasks: [
          { id: `${prefix}_2_1`, title: "Functions, Scope & Error Handling", xp: 70, type: "theory", estimatedMinutes: 50, completed: false },
          { id: `${prefix}_2_2`, title: "Working with Arrays, Objects & JSON Data", xp: 75, type: "practice", estimatedMinutes: 60, completed: false },
          { id: `${prefix}_2_3`, title: "Building Your First Mini-Module", xp: 85, type: "project", estimatedMinutes: 75, completed: false },
        ],
      },
      {
        id: `${prefix}_p3`,
        phaseNumber: 3,
        phase: "PHASE 3",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Database & API Integration",
        description: "Connect code modules to databases and external data services.",
        tasks: [
          { id: `${prefix}_3_1`, title: "Introduction to Databases & Simple Queries", xp: 75, type: "practice", estimatedMinutes: 60, completed: false },
          { id: `${prefix}_3_2`, title: "Connecting Application Code to Database", xp: 80, type: "practice", estimatedMinutes: 65, completed: false },
          { id: `${prefix}_3_3`, title: "Fetching & Processing External API Data", xp: 70, type: "review", estimatedMinutes: 45, completed: false },
        ],
      },
      {
        id: `${prefix}_p4`,
        phaseNumber: 4,
        phase: "PHASE 4",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Beginner Capstone & Deployment",
        description: `Package and deploy your completed beginner ${cleanRole} application online.`,
        tasks: [
          { id: `${prefix}_4_1`, title: "Code Refactoring & Clean Formatting", xp: 60, type: "review", estimatedMinutes: 45, completed: false },
          { id: `${prefix}_4_2`, title: `Deploying ${cleanRole} Application Online`, xp: 90, type: "project", estimatedMinutes: 80, completed: false },
          { id: `${prefix}_4_3`, title: "Portfolio Documentation & GitHub Publish", xp: 80, type: "project", estimatedMinutes: 60, completed: false },
        ],
      },
    ];
  } else if (isAdvanced) {
    phases = [
      {
        id: `${prefix}_p1`,
        phaseNumber: 1,
        phase: "PHASE 1",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: `${cleanRole} High-Performance Architecture`,
        description: `Advanced design patterns, concurrency models, and enterprise structure.`,
        tasks: [
          { id: `${prefix}_1_1`, title: "Enterprise System Architecture & DDD", xp: 90, type: "theory", estimatedMinutes: 60, completed: false },
          { id: `${prefix}_1_2`, title: "Asynchronous Concurrency & Thread Optimization", xp: 100, type: "practice", estimatedMinutes: 80, completed: false },
          { id: `${prefix}_1_3`, title: "Memory Profiling & Performance Tuning", xp: 95, type: "review", estimatedMinutes: 60, completed: false },
        ],
      },
      {
        id: `${prefix}_p2`,
        phaseNumber: 2,
        phase: "PHASE 2",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Microservices & Distributed Systems",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        description: "Deconstruct monoliths, build event-driven microservices, and message queues.",
        tasks: [
          { id: `${prefix}_2_1`, title: "Event-Driven Messaging with Kafka / RabbitMQ", xp: 110, type: "practice", estimatedMinutes: 90, completed: false },
          { id: `${prefix}_2_2`, title: "Distributed Caching & Redis Cluster Strategies", xp: 100, type: "practice", estimatedMinutes: 75, completed: false },
          { id: `${prefix}_2_3`, title: "gRPC & High-Throughput Service Communication", xp: 105, type: "project", estimatedMinutes: 90, completed: false },
        ],
      },
      {
        id: `${prefix}_p3`,
        phaseNumber: 3,
        phase: "PHASE 3",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Zero-Trust Security & Cloud Hardening",
        description: "Enforce OAuth2/OIDC, mTLS encryption, rate limiting, and OWASP compliance.",
        tasks: [
          { id: `${prefix}_3_1`, title: "OAuth2, OpenID Connect & Token Revocation", xp: 100, type: "theory", estimatedMinutes: 60, completed: false },
          { id: `${prefix}_3_2`, title: "Cloud Security: VPC Peering, IAM & Vault", xp: 110, type: "practice", estimatedMinutes: 85, completed: false },
          { id: `${prefix}_3_3`, title: "Penetration Testing & Security Auditing", xp: 95, type: "review", estimatedMinutes: 60, completed: false },
        ],
      },
      {
        id: `${prefix}_p4`,
        phaseNumber: 4,
        phase: "PHASE 4",
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
        title: "Kubernetes, CI/CD & Production Capstone",
        description: `Deploy resilient Kubernetes clusters with auto-scaling and Prometheus monitoring.`,
        tasks: [
          { id: `${prefix}_4_1`, title: "Kubernetes Cluster Auto-scaling & Ingress", xp: 120, type: "project", estimatedMinutes: 100, completed: false },
          { id: `${prefix}_4_2`, title: "Prometheus & Grafana Observability Pipelines", xp: 95, type: "practice", estimatedMinutes: 70, completed: false },
          { id: `${prefix}_4_3`, title: `Enterprise ${cleanRole} Capstone Architecture`, xp: 130, type: "project", estimatedMinutes: 120, completed: false },
        ],
      },
    ];
  } else {
    // Intermediate (Default)
    const basePhases = domainPhases[targetRole];
    if (basePhases && basePhases.length > 0) {
      phases = basePhases.map((p) => ({
        ...p,
        duration: `${weeksPerPhase} ${weeksPerPhase === 1 ? 'week' : 'weeks'}`,
      }));
    } else {
      phases = synthesizeCustomRolePhases(targetRole, durationWeeks);
    }
  }

  const completedTaskIds = JSON.parse(localStorage.getItem("pathai_completed_tasks") || "[]");

  const updatedPhases = phases.map((p) => ({
    ...p,
    tasks: (p.tasks || []).map((t) => {
      const taskId = t.id || t._id;
      const isDone = t.completed || (taskId && completedTaskIds.includes(taskId.toString()));
      return {
        ...t,
        completed: isDone,
      };
    }),
  }));

  const totalTopics = updatedPhases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedTopics = updatedPhases.reduce((acc, p) => acc + (p.tasks?.filter((t) => t.completed).length || 0), 0);

  return {
    title: `Random Forest Predicted ${skillLevel.toUpperCase()} ${cleanRole} Roadmap`,
    goalLabel: cleanRole,
    difficulty: skillLevel,
    durationWeeks: parseInt(durationWeeks, 10) || 8,
    topicsDone: completedTopics,
    topicsTotal: totalTopics,
    phases: updatedPhases,
  };
};

export const roadmapMeta = {
  title: "Personalized Backend Developer Roadmap",
  goalLabel: "Backend Developer",
  topicsDone: 0,
  topicsTotal: 15,
};

export const roadmapPhases = domainPhases["Backend Developer"];

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


