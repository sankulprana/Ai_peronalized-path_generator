import dotenv from "dotenv";
import { generateRandomForestRoadmapData } from "../ml/mlEngine.js";

dotenv.config();

/**
 * Rich domain templates for instant, offline-capable curated curriculums
 */
const ROLE_TEMPLATES = {
  "Backend Developer": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Web & Network Fundamentals",
      duration: "2 weeks",
      description: "Master HTTP/HTTPS protocols, RESTful principles, Git collaboration, and Node.js runtime mechanics.",
      tasks: [
        { title: "HTML5 & CSS3 Core Architecture", xp: 50, type: "theory", estimatedMinutes: 45 },
        { title: "JavaScript ES6+ & Asynchronous Event Loop", xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: "Git & GitHub Version Control Workflows", xp: 40, type: "practice", estimatedMinutes: 30 },
        { title: "HTTP Protocol, Methods, Headers & Status Codes", xp: 60, type: "theory", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "Node.js & Express Framework",
      duration: "3 weeks",
      description: "Build scalable backend servers with Express, routing pipelines, middleware, and request validation.",
      tasks: [
        { title: "Node.js Core Modules & Non-blocking I/O", xp: 70, type: "theory", estimatedMinutes: 60 },
        { title: "Express.js Architecture, Controllers & Routing", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "RESTful API Design & Payload Validation", xp: 100, type: "practice", estimatedMinutes: 90 },
        { title: "Middleware Pipeline & JWT Authentication", xp: 85, type: "project", estimatedMinutes: 90 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Database Engineering (SQL & NoSQL)",
      duration: "3 weeks",
      description: "Design relational and document schemas, indexing strategies, transactions, and ORMs.",
      tasks: [
        { title: "Relational Modeling with PostgreSQL & SQL Queries", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "NoSQL Modeling with MongoDB & Mongoose ODM", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Database Indexing, Aggregations & Query Optimization", xp: 75, type: "review", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "Advanced Architecture & Security",
      duration: "4 weeks",
      description: "Deploy microservices, caching layers, containerization with Docker, and OWASP security standards.",
      tasks: [
        { title: "Docker Containerization & Multi-Stage Builds", xp: 100, type: "practice", estimatedMinutes: 90 },
        { title: "Redis In-Memory Caching & Session Management", xp: 80, type: "theory", estimatedMinutes: 45 },
        { title: "GraphQL API Construction & Resolvers", xp: 90, type: "practice", estimatedMinutes: 60 },
        { title: "API Security, Rate Limiting & Helmet Configuration", xp: 70, type: "review", estimatedMinutes: 60 },
      ],
    },
  ],

  "Frontend Developer": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Modern HTML, CSS & Responsive Systems",
      duration: "2 weeks",
      description: "Build responsive, accessible, pixel-perfect user interfaces with modern CSS and Tailwind.",
      tasks: [
        { title: "Semantic HTML5 & Web Accessibility (a11y)", xp: 50, type: "theory", estimatedMinutes: 40 },
        { title: "CSS Flexbox & Responsive Grid Layouts", xp: 60, type: "practice", estimatedMinutes: 60 },
        { title: "Tailwind CSS Utility Design System", xp: 70, type: "practice", estimatedMinutes: 60 },
        { title: "Modern JavaScript ES6+, DOM & Fetch API", xp: 80, type: "practice", estimatedMinutes: 50 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "React Core & State Architecture",
      duration: "3 weeks",
      description: "Master React component trees, custom hooks, state lifecycles, and client-side routing.",
      tasks: [
        { title: "JSX, Component Props & Composition Patterns", xp: 60, type: "theory", estimatedMinutes: 45 },
        { title: "State Management with useState & useReducer", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Custom Hooks & useEffect Dependency Management", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Client-Side Routing with React Router v6", xp: 70, type: "practice", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Fullstack React & Next.js Ecosystem",
      duration: "3 weeks",
      description: "Leverage Next.js App Router, Server Components, SSR/SSG caching, and global state.",
      tasks: [
        { title: "Global State Management with Zustand & Redux Toolkit", xp: 95, type: "project", estimatedMinutes: 90 },
        { title: "Next.js App Router, Server Actions & SSR", xp: 110, type: "project", estimatedMinutes: 120 },
        { title: "Client Performance, Memoization & Lighthouse Audits", xp: 80, type: "review", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "Advanced UI Testing & Deployment",
      duration: "2 weeks",
      description: "Write unit & end-to-end tests, optimize bundle sizes, and deploy to Vercel/Netlify with CI/CD.",
      tasks: [
        { title: "Unit Testing with Vitest & React Testing Library", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "End-to-End Testing with Playwright / Cypress", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "CI/CD Deployment Pipelines & Web Vitals Monitoring", xp: 75, type: "project", estimatedMinutes: 60 },
      ],
    },
  ],

  "Fullstack Engineer": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Frontend Foundations & Modern React",
      duration: "3 weeks",
      description: "Master React, TypeScript, Tailwind CSS, and REST client integration.",
      tasks: [
        { title: "TypeScript Core Types & Generics for React", xp: 70, type: "theory", estimatedMinutes: 50 },
        { title: "React Components, Custom Hooks & Tailwind UI", xp: 85, type: "practice", estimatedMinutes: 70 },
        { title: "Client State & Asynchronous Data Fetching", xp: 80, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "Backend API Engineering & Microservices",
      duration: "3 weeks",
      description: "Construct Node.js/Express RESTful & GraphQL APIs with JWT authentication.",
      tasks: [
        { title: "Express.js REST Architecture & Middleware Pipelines", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Secure User Auth with JWT, Bcrypt & Refresh Tokens", xp: 95, type: "project", estimatedMinutes: 90 },
        { title: "PostgreSQL Database Schema & Prisma ORM", xp: 90, type: "practice", estimatedMinutes: 75 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Fullstack Integration & Cloud Databases",
      duration: "3 weeks",
      description: "Connect frontend client with backend services, real-time WebSockets, and caching.",
      tasks: [
        { title: "End-to-End Fullstack Data Synchronization", xp: 100, type: "project", estimatedMinutes: 100 },
        { title: "Real-time Communication with WebSockets / Socket.io", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Redis Caching & Performance Layering", xp: 80, type: "theory", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "DevOps, Containerization & Production Cloud",
      duration: "3 weeks",
      description: "Dockerize fullstack applications, configure CI/CD pipelines, and deploy on AWS.",
      tasks: [
        { title: "Docker Containerization for Multi-Container Apps", xp: 100, type: "practice", estimatedMinutes: 90 },
        { title: "GitHub Actions CI/CD Pipeline Automation", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "AWS Cloud Deployment (ECS, S3, RDS) & Monitoring", xp: 110, type: "project", estimatedMinutes: 120 },
      ],
    },
  ],

  "AI Engineer": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Python, Math & Data Engineering",
      duration: "2 weeks",
      description: "Master Python programming, Linear Algebra, NumPy vectorization, and Pandas dataframes.",
      tasks: [
        { title: "Python Advanced Syntax, OOP & Functional Paradigms", xp: 60, type: "theory", estimatedMinutes: 45 },
        { title: "NumPy Matrix Computations & Vectorization", xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: "Pandas Data Cleaning & Feature Engineering", xp: 85, type: "practice", estimatedMinutes: 70 },
        { title: "Applied Mathematics: Calculus & Linear Algebra", xp: 70, type: "theory", estimatedMinutes: 50 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "Machine Learning Core with Scikit-Learn",
      duration: "3 weeks",
      description: "Build supervised and unsupervised ML models, loss functions, and evaluation metrics.",
      tasks: [
        { title: "Supervised Learning: Regression, Trees & SVMs", xp: 85, type: "practice", estimatedMinutes: 75 },
        { title: "Unsupervised Clustering (K-Means, PCA)", xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: "Cross-Validation, Hyperparameter Tuning & ROC/AUC", xp: 75, type: "review", estimatedMinutes: 45 },
        { title: "Building an End-to-End ML Prediction Pipeline", xp: 100, type: "project", estimatedMinutes: 90 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Deep Learning & Neural Networks (PyTorch)",
      duration: "3 weeks",
      description: "Design convolutional, recurrent, and transformer architectures in PyTorch.",
      tasks: [
        { title: "Neural Network Forward/Backward Pass & PyTorch Tensors", xp: 90, type: "theory", estimatedMinutes: 60 },
        { title: "Convolutional Neural Networks (CNNs) for Computer Vision", xp: 95, type: "practice", estimatedMinutes: 80 },
        { title: "Transformer Architecture & Self-Attention Mechanisms", xp: 100, type: "theory", estimatedMinutes: 90 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "LLMs, LangChain, RAG & AI Agent Deployment",
      duration: "4 weeks",
      description: "Deploy Large Language Models, Vector Databases, Retrieval-Augmented Generation, and AI APIs.",
      tasks: [
        { title: "OpenAI, Gemini & Anthropic API Orchestration", xp: 90, type: "practice", estimatedMinutes: 60 },
        { title: "Vector Embeddings & Pinecone/Chroma Vector DBs", xp: 95, type: "practice", estimatedMinutes: 75 },
        { title: "Retrieval-Augmented Generation (RAG) with LangChain", xp: 110, type: "project", estimatedMinutes: 120 },
        { title: "Autonomous AI Agent Workflows & Tool Calling", xp: 100, type: "project", estimatedMinutes: 90 },
      ],
    },
  ],

  "Mobile Developer": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Mobile Architecture & React Native Core",
      duration: "2 weeks",
      description: "Build cross-platform mobile UI components, styling, and navigation with React Native.",
      tasks: [
        { title: "React Native Core Components & StyleSheet API", xp: 60, type: "theory", estimatedMinutes: 45 },
        { title: "Flexbox Layout for Android & iOS Screen Sizes", xp: 75, type: "practice", estimatedMinutes: 60 },
        { title: "Stack & Tab Navigation with React Navigation", xp: 80, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "State, Offline Storage & Device APIs",
      duration: "3 weeks",
      description: "Integrate device cameras, GPS location, push notifications, and offline caching.",
      tasks: [
        { title: "AsyncStorage & SQLite Local Offline Persistence", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Native Sensors, Camera & Geolocation APIs", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Push Notifications with Firebase Cloud Messaging", xp: 80, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Backend Sync, Auth & Mobile Security",
      duration: "3 weeks",
      description: "Connect mobile apps to REST/GraphQL backends with biometric authentication.",
      tasks: [
        { title: "Biometric Authentication (FaceID / Fingerprint)", xp: 90, type: "project", estimatedMinutes: 75 },
        { title: "Optimistic UI Updates & Offline-first Syncing", xp: 95, type: "project", estimatedMinutes: 90 },
        { title: "Mobile Performance Profiling & Memory Leak Detection", xp: 75, type: "review", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "App Store Publishing & CI/CD",
      duration: "2 weeks",
      description: "Prepare release builds for Apple App Store and Google Play Store via Fastlane.",
      tasks: [
        { title: "App Signing, Keystores & Provisioning Profiles", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Fastlane Mobile CI/CD Automation", xp: 95, type: "practice", estimatedMinutes: 75 },
        { title: "Publishing to Apple App Store & Google Play Store", xp: 100, type: "project", estimatedMinutes: 90 },
      ],
    },
  ],

  "DevOps Specialist": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Linux Systems, Shell & Networking",
      duration: "2 weeks",
      description: "Master Linux system administration, Bash automation, and TCP/IP networking.",
      tasks: [
        { title: "Linux CLI Mastery, Permissions & Process Management", xp: 60, type: "theory", estimatedMinutes: 45 },
        { title: "Bash Shell Scripting & Automation Pipelines", xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: "Networking Protocols: DNS, TLS/SSL, Load Balancing", xp: 70, type: "theory", estimatedMinutes: 50 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "Docker Containerization & Registry Management",
      duration: "3 weeks",
      description: "Create lightweight, secure Docker containers and multi-container Docker Compose stacks.",
      tasks: [
        { title: "Dockerfile Optimization & Alpine Base Images", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Multi-container Networking with Docker Compose", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Container Security Auditing & Vulnerability Scans", xp: 75, type: "review", estimatedMinutes: 45 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "Kubernetes Orchestration & Helm Charts",
      duration: "3 weeks",
      description: "Deploy and manage resilient Kubernetes clusters, pods, services, and ingress.",
      tasks: [
        { title: "Kubernetes Architecture (Pods, Deployments, Services)", xp: 100, type: "practice", estimatedMinutes: 90 },
        { title: "ConfigMaps, Secrets & Ingress Controller Routing", xp: 95, type: "practice", estimatedMinutes: 80 },
        { title: "Package Management with Helm Charts", xp: 90, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "Infrastructure as Code & CI/CD Pipelines",
      duration: "4 weeks",
      description: "Automate cloud infrastructure with Terraform and continuous delivery pipelines.",
      tasks: [
        { title: "Terraform Infrastructure as Code (IaC) on AWS", xp: 110, type: "project", estimatedMinutes: 100 },
        { title: "GitHub Actions & GitLab CI/CD Automation", xp: 95, type: "practice", estimatedMinutes: 75 },
        { title: "Observability: Prometheus, Grafana & ELK Stack", xp: 85, type: "review", estimatedMinutes: 60 },
      ],
    },
  ],

  "Cybersecurity": [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: "Security Foundations, Networking & Cryptography",
      duration: "2 weeks",
      description: "Master network security, packet analysis, ciphers, and public key cryptography.",
      tasks: [
        { title: "TCP/IP Packet Analysis with Wireshark", xp: 70, type: "practice", estimatedMinutes: 60 },
        { title: "Symmetric & Asymmetric Cryptography (AES, RSA, ECC)", xp: 80, type: "theory", estimatedMinutes: 60 },
        { title: "Authentication, PKI & TLS/SSL Handshakes", xp: 75, type: "theory", estimatedMinutes: 50 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: "Web Security & OWASP Top 10",
      duration: "3 weeks",
      description: "Identify and patch critical vulnerabilities like SQLi, XSS, CSRF, and SSRF.",
      tasks: [
        { title: "SQL Injection & Cross-Site Scripting (XSS) Exploitation", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Cross-Site Request Forgery (CSRF) & CORS Headers", xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: "Broken Access Control & Insecure Deserialization", xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: "Burp Suite Web Penetration Testing", xp: 100, type: "project", estimatedMinutes: 90 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: "System & Cloud Infrastructure Defense",
      duration: "3 weeks",
      description: "Harden Linux/Windows servers, configure firewalls, and secure AWS/GCP workloads.",
      tasks: [
        { title: "Linux Server Hardening, SSH & IPTables Firewalls", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Cloud Security: AWS IAM Policies, VPCs & Security Groups", xp: 95, type: "practice", estimatedMinutes: 80 },
        { title: "Vulnerability Scanning with Nmap & OpenVAS", xp: 85, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: "Incident Response & Ethical Hacking",
      duration: "3 weeks",
      description: "Perform penetration testing, forensic log analysis, and threat hunting.",
      tasks: [
        { title: "Metasploit Framework & Privilege Escalation", xp: 100, type: "project", estimatedMinutes: 90 },
        { title: "SIEM Log Analysis with Splunk & Incident Response", xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: "Ethical Hacking Capstone & Security Audit Report", xp: 110, type: "project", estimatedMinutes: 120 },
      ],
    },
  ],
};

// Aliases mapping
ROLE_TEMPLATES["AI & Data Science"] = ROLE_TEMPLATES["AI Engineer"];
ROLE_TEMPLATES["Machine Learning Engineer"] = ROLE_TEMPLATES["AI Engineer"];
ROLE_TEMPLATES["DevOps & Cloud"] = ROLE_TEMPLATES["DevOps Specialist"];
ROLE_TEMPLATES["Cybersecurity Specialist"] = ROLE_TEMPLATES["Cybersecurity"];
ROLE_TEMPLATES["Mobile App Development"] = ROLE_TEMPLATES["Mobile Developer"];

/**
 * Dynamically synthesizes a bespoke 4-phase learning path for ANY custom career title
 */
const synthesizeCustomRoadmap = (targetRole, skillLevel = "intermediate", durationWeeks = 8) => {
  const roleName = targetRole.trim();
  const weeksPerPhase = Math.max(1, Math.floor(durationWeeks / 4));

  return [
    {
      phaseNumber: 1,
      phaseName: "PHASE 1",
      title: `${roleName} Core Fundamentals & Tooling`,
      duration: `${weeksPerPhase} weeks`,
      description: `Master fundamental principles, modern developer tools, and primary syntax required for ${roleName}.`,
      tasks: [
        { title: `${roleName} Architecture & Core Concepts`, xp: 60, type: "theory", estimatedMinutes: 45 },
        { title: `Essential Programming & Environment Setup`, xp: 75, type: "practice", estimatedMinutes: 60 },
        { title: `Version Control & Best Practices in ${roleName}`, xp: 65, type: "practice", estimatedMinutes: 45 },
        { title: `Foundational Practical Exercises`, xp: 80, type: "practice", estimatedMinutes: 60 },
      ],
    },
    {
      phaseNumber: 2,
      phaseName: "PHASE 2",
      title: `Applied Techniques & Intermediate Engineering`,
      duration: `${weeksPerPhase} weeks`,
      description: `Build functional modules, handle data flow, error recovery, and standard libraries for ${roleName}.`,
      tasks: [
        { title: `Component & Module Design in ${roleName}`, xp: 85, type: "theory", estimatedMinutes: 60 },
        { title: `Implementing Core Features & Data Processing`, xp: 90, type: "practice", estimatedMinutes: 75 },
        { title: `Debugging & Asynchronous Execution`, xp: 80, type: "practice", estimatedMinutes: 60 },
        { title: `Hands-on Project: ${roleName} Prototype`, xp: 100, type: "project", estimatedMinutes: 90 },
      ],
    },
    {
      phaseNumber: 3,
      phaseName: "PHASE 3",
      title: `Advanced Architecture, Performance & Scalability`,
      duration: `${weeksPerPhase} weeks`,
      description: `Implement production-grade patterns, caching, security safeguards, and system scaling.`,
      tasks: [
        { title: `Design Patterns & Clean Code Architecture`, xp: 90, type: "theory", estimatedMinutes: 60 },
        { title: `Performance Profiling & Bottleneck Optimization`, xp: 95, type: "practice", estimatedMinutes: 75 },
        { title: `Security Hardening & Industry Compliance`, xp: 85, type: "review", estimatedMinutes: 60 },
        { title: `Integration with Cloud & External APIs`, xp: 100, type: "practice", estimatedMinutes: 80 },
      ],
    },
    {
      phaseNumber: 4,
      phaseName: "PHASE 4",
      title: `Production Deployment & Capstone Project`,
      duration: `${weeksPerPhase} weeks`,
      description: `Ship an enterprise-ready ${roleName} capstone project with automated CI/CD and monitoring.`,
      tasks: [
        { title: `Automated Testing & Quality Assurance`, xp: 85, type: "practice", estimatedMinutes: 60 },
        { title: `CI/CD Deployment & Production Infrastructure`, xp: 95, type: "practice", estimatedMinutes: 75 },
        { title: `Full-scale Capstone Portfolio Project`, xp: 120, type: "project", estimatedMinutes: 120 },
      ],
    },
  ];
};

/**
 * Fallback algorithmic curriculum builder when no AI API key is configured
 */
export const generateAlgorithmicFallback = ({
  targetRole = "Backend Developer",
  skillLevel = "intermediate",
  durationWeeks = 8,
}) => {
  // Check exact or partial match in templates
  let matchedPhases = ROLE_TEMPLATES[targetRole];

  if (!matchedPhases) {
    const lower = targetRole.toLowerCase();
    for (const key of Object.keys(ROLE_TEMPLATES)) {
      if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
        matchedPhases = ROLE_TEMPLATES[key];
        break;
      }
    }
  }

  // Call Random Forest Machine Learning Model generator to tailor phases based on level & duration
  const rfGenerated = generateRandomForestRoadmapData({
    targetRole,
    skillLevel,
    durationWeeks,
  });

  return {
    title: rfGenerated.title,
    targetRole,
    difficulty: skillLevel,
    durationWeeks,
    phases: rfGenerated.phases,
  };
};

/**
 * Generate AI-powered personalized learning roadmap calling Gemini API or fallback
 * @param {Object} options - { targetRole, skillLevel, durationWeeks }
 * @returns {Promise<Object>} Structured Roadmap JSON object
 */
export const generateAIRoadmap = async ({
  targetRole = "Backend Developer",
  skillLevel = "intermediate",
  durationWeeks = 8,
}) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

  if (!apiKey) {
    return generateAlgorithmicFallback({ targetRole, skillLevel, durationWeeks });
  }

  try {
    const prompt = `You are a Senior Technical Curriculum Architect.
Generate a structured, highly realistic, personalized learning roadmap for a student pursuing a career as a "${targetRole}" at a "${skillLevel}" experience level over a total timeframe of ${durationWeeks} weeks.

Return ONLY a valid JSON object matching the exact structure below, with NO markdown formatting, NO explanation, NO code block ticks:
{
  "title": "Personalized ${targetRole} Roadmap",
  "targetRole": "${targetRole}",
  "difficulty": "${skillLevel}",
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "PHASE 1",
      "title": "Phase 1 Title Here",
      "duration": "2 weeks",
      "description": "Clear explanation of what skills are mastered in this phase.",
      "tasks": [
        {
          "title": "Topic or Project Title",
          "xp": 60,
          "type": "theory",
          "estimatedMinutes": 45
        }
      ]
    }
  ]
}

Rules:
- Provide 4 logical phases progressing from fundamentals to advanced production mastery.
- Each phase must contain 3 to 4 specific, actionable task titles.
- "type" must strictly be one of: "theory", "practice", "project", "review".
- XP values must range between 40 and 120 based on task depth.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Invalid response received from Gemini API");
    }

    const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);

    return {
      title: parsedData.title || `Personalized ${targetRole} Roadmap`,
      targetRole: parsedData.targetRole || targetRole,
      difficulty: parsedData.difficulty || skillLevel,
      phases: parsedData.phases || generateAlgorithmicFallback({ targetRole, skillLevel, durationWeeks }).phases,
    };
  } catch (error) {
    console.warn("AI generation fallback active:", error.message);
    return generateAlgorithmicFallback({ targetRole, skillLevel, durationWeeks });
  }
};

/**
 * AI Assistant for solving student doubts
 * @param {Object} options - { query, contextGoal }
 * @returns {Promise<Object>} { answer, suggestedFollowups }
 */
export const solveDoubtAI = async ({ query, contextGoal = "Backend Developer" }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

  if (!apiKey) {
    return {
      answer: `Great question about **${query}**!\n\nIn **${contextGoal}** learning, this concept is critical for building resilient production applications:\n\n1. **Core Concept**: Understanding how it fits into architecture and component lifecycles.\n2. **Best Practice**: Keep implementations modular, follow clean code principles, and add unit tests.\n3. **Real-world Application**: Widely utilized in modern development for performance, reliability, and security.\n\nKeep asking questions as you progress through your roadmap! 🚀`,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const prompt = `You are a friendly, highly knowledgeable AI Tech Mentor helping a student studying to become a ${contextGoal}.
Question: "${query}"

Provide a clear, encouraging, structured response in markdown. Focus on core concepts, best practices, and practical examples.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) throw new Error("Gemini API error");

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      answer: answer || "I couldn't generate an answer right now. Please try rephrasing your question.",
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      answer: `Great question about **${query}**!\n\nIn **${contextGoal}** learning, this concept is critical for building resilient production applications:\n\n1. **Core Concept**: Proper architecture and separation of concerns.\n2. **Best Practice**: Write modular code with proper error handling.\n3. **Real-world Application**: Widely used in modern production systems. 🚀`,
      timestamp: new Date().toISOString(),
    };
  }
};
