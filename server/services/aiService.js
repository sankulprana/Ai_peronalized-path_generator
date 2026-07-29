import dotenv from "dotenv";

dotenv.config();

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
  };

  const phases = roleTemplates[targetRole] || roleTemplates["Backend Developer"];

  return {
    title: `Personalized ${targetRole} Roadmap`,
    targetRole,
    difficulty: skillLevel,
    phases,
  };
};

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
Generate a structured, production-ready personalized learning roadmap for a student pursuing a career as a "${targetRole}" at a "${skillLevel}" level over a total duration of ${durationWeeks} weeks.

Return ONLY a valid JSON object matching the exact format below:
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
}`;

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
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("AI Generation error:", error.message);
    return generateAlgorithmicFallback({ targetRole, skillLevel, durationWeeks });
  }
};
