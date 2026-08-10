import dotenv from "dotenv";

dotenv.config();

/**
 * Fallback algorithmic curriculum builder when no AI API key is configured
 */
const generateAlgorithmicFallback = ({
  targetRole = "Backend Developer",
  skillLevel = "intermediate",
  durationWeeks = 8,
}) => {
  const roleTemplates = {
    "Backend Developer": [
      {
        phaseNumber: 1,
        phaseName: "PHASE 1",
        title: "Web & Network Fundamentals",
        duration: "2 weeks",
        description: "Master HTTP/HTTPS, REST principles, Git, and JS runtime mechanics.",
        tasks: [
          { title: "HTML & CSS Core Architecture", xp: 50, type: "theory", estimatedMinutes: 45 },
          { title: "JavaScript ES6+ & Asynchronous Control Flow", xp: 80, type: "practice", estimatedMinutes: 60 },
          { title: "Git & Version Control Team Workflows", xp: 40, type: "practice", estimatedMinutes: 30 },
          { title: "HTTP Protocol, Verbs & Status Codes", xp: 60, type: "theory", estimatedMinutes: 45 },
        ],
      },
      {
        phaseNumber: 2,
        phaseName: "PHASE 2",
        title: "Node.js & Express Framework",
        duration: "3 weeks",
        description: "Build robust server applications with Express, routing, and middleware.",
        tasks: [
          { title: "Node.js Event Loop & Non-blocking I/O", xp: 70, type: "theory", estimatedMinutes: 60 },
          { title: "Express.js Architecture & Controller Patterns", xp: 90, type: "practice", estimatedMinutes: 60 },
          { title: "REST API Design & Input Validation", xp: 100, type: "practice", estimatedMinutes: 90 },
          { title: "Middleware & JWT Authentication", xp: 85, type: "project", estimatedMinutes: 90 },
        ],
      },
      {
        phaseNumber: 3,
        phaseName: "PHASE 3",
        title: "Database Engineering (SQL & NoSQL)",
        duration: "3 weeks",
        description: "Design relational and document schemas, indexing, and ORMs.",
        tasks: [
          { title: "SQL Schema Design with PostgreSQL", xp: 90, type: "practice", estimatedMinutes: 75 },
          { title: "NoSQL Modeling with MongoDB & Mongoose", xp: 85, type: "practice", estimatedMinutes: 60 },
          { title: "Database Indexing & Query Optimization", xp: 75, type: "review", estimatedMinutes: 45 },
        ],
      },
      {
        phaseNumber: 4,
        phaseName: "PHASE 4",
        title: "Advanced Architecture & Security",
        duration: "4 weeks",
        description: "Deploy microservices, caching, containerization, and OWASP security.",
        tasks: [
          { title: "Docker & Containerization Workflow", xp: 100, type: "practice", estimatedMinutes: 90 },
          { title: "GraphQL API Construction", xp: 90, type: "practice", estimatedMinutes: 60 },
          { title: "Redis Caching Strategies", xp: 80, type: "theory", estimatedMinutes: 45 },
          { title: "Security Best Practices & Rate Limiting", xp: 70, type: "review", estimatedMinutes: 60 },
        ],
      },
    ],
    "Frontend Developer": [
      {
        phaseNumber: 1,
        phaseName: "PHASE 1",
        title: "Modern HTML, CSS & JS Foundations",
        duration: "2 weeks",
        description: "Master layouts, responsive design, accessibility, and modern JS.",
        tasks: [
          { title: "Semantic HTML5 & Accessibility (a11y)", xp: 50, type: "theory", estimatedMinutes: 40 },
          { title: "Flexbox & Grid Layout Masterclass", xp: 60, type: "practice", estimatedMinutes: 60 },
          { title: "TailwindCSS Component System", xp: 70, type: "practice", estimatedMinutes: 60 },
          { title: "Async/Await & Fetch API Integrations", xp: 80, type: "practice", estimatedMinutes: 45 },
        ],
      },
      {
        phaseNumber: 2,
        phaseName: "PHASE 2",
        title: "React Core & State Architecture",
        duration: "3 weeks",
        description: "Virtual DOM, component lifecycles, state management, and hooks.",
        tasks: [
          { title: "JSX, Components & Props Architecture", xp: 60, type: "theory", estimatedMinutes: 45 },
          { title: "State Management with useState & useReducer", xp: 85, type: "practice", estimatedMinutes: 60 },
          { title: "Custom Hooks & Effect Optimization", xp: 90, type: "practice", estimatedMinutes: 75 },
          { title: "Client-Side Routing with React Router", xp: 70, type: "practice", estimatedMinutes: 45 },
        ],
      },
      {
        phaseNumber: 3,
        phaseName: "PHASE 3",
        title: "Fullstack React & Next.js",
        duration: "3 weeks",
        description: "Server-side rendering, global state, performance, and deployment.",
        tasks: [
          { title: "Global State with Zustand & Redux", xp: 95, type: "project", estimatedMinutes: 90 },
          { title: "Next.js App Router & SSR Architecture", xp: 110, type: "project", estimatedMinutes: 120 },
          { title: "Frontend Performance & Lighthouse Auditing", xp: 80, type: "review", estimatedMinutes: 45 },
        ],
      },
    ],
  };

  const phases = roleTemplates[targetRole] || roleTemplates["Backend Developer"];

  return {
    title: `Personalized ${targetRole} Roadmap`,
    targetRole,
    difficulty: skillLevel,
    phases,
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

  // If no API key configured, use intelligent fallback
  if (!apiKey) {
    console.log("ℹ️ No GEMINI_API_KEY set in .env. Using intelligent algorithmic roadmap builder.");
    return generateAlgorithmicFallback({ targetRole, skillLevel, durationWeeks });
  }

  try {
    const prompt = `You are a Senior Technical Curriculum Architect.
Generate a structured, production-ready personalized learning roadmap for a student pursuing a career as a "${targetRole}" at a "${skillLevel}" level over a total duration of ${durationWeeks} weeks.

Return ONLY a valid JSON object matching the exact format below, with NO markdown formatting, NO extra text or backticks:
{
  "title": "Personalized ${targetRole} Roadmap",
  "targetRole": "${targetRole}",
  "difficulty": "${skillLevel}",
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "PHASE 1",
      "title": "Phase Title Here",
      "duration": "2 weeks",
      "description": "Brief phase description",
      "tasks": [
        {
          "title": "Topic or Task Title",
          "xp": 60,
          "type": "theory",
          "estimatedMinutes": 45
        }
      ]
    }
  ]
}

Ensure "type" is one of: "theory", "practice", "review", or "project". Provide 3 to 4 phases with 3 to 4 tasks each.`;

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
      throw new Error(`Gemini API HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Invalid response format received from Gemini API");
    }

    // Clean JSON text if wrapped in markdown ```json ... ```
    const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);

    return parsedData;
  } catch (error) {
    console.error("⚠️ AI Model Generation Error:", error.message);
    console.log("🔄 Falling back to intelligent algorithmic roadmap generator...");
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
      answer: `Great question about **${query}**!\n\nIn ${contextGoal} learning, this topic is key to building reliable systems. Here is a breakdown:\n\n1. **Core Concept**: It ensures proper architecture, separation of concerns, and clean execution.\n2. **Best Practice**: Keep your implementation modular, write unit tests, and follow industry standard conventions.\n3. **Real-world Application**: Widely used in modern production applications for performance and scalability.\n\nFeel free to ask follow-up questions or request code snippets! 🚀`,
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
      answer: `Great question about **${query}**!\n\nIn ${contextGoal} learning, this topic is key to building reliable systems. Here is a breakdown:\n\n1. **Core Concept**: It ensures proper architecture, separation of concerns, and clean execution.\n2. **Best Practice**: Keep your implementation modular, write unit tests, and follow industry standard conventions.\n\nFeel free to ask follow-up questions! 🚀`,
      timestamp: new Date().toISOString(),
    };
  }
};

