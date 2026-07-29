import Resource from "../models/Resource.js";

const seedDefaultResources = [
  // YouTube Resources
  {
    category: "youtube",
    tag: "Node.js",
    title: "Node.js Crash Course 2024",
    author: "Traversy Media",
    views: "4.2M views",
    duration: "1:30:22",
    url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
    targetRole: "Backend Developer",
  },
  {
    category: "youtube",
    tag: "Express",
    title: "Express.js Full Course",
    author: "freeCodeCamp",
    views: "2.8M views",
    duration: "2:15:44",
    url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    targetRole: "Backend Developer",
  },
  {
    category: "youtube",
    tag: "SQL",
    title: "PostgreSQL Tutorial for Beginners",
    author: "TechWorld with Nana",
    views: "1.9M views",
    duration: "1:45:00",
    url: "https://www.youtube.com/watch?v=qw--VYLpxG4",
    targetRole: "Backend Developer",
  },
  {
    category: "youtube",
    tag: "Docker",
    title: "Docker Tutorial for Beginners",
    author: "Programming with Mosh",
    views: "3.5M views",
    duration: "1:08:15",
    url: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
    targetRole: "Backend Developer",
  },
  {
    category: "youtube",
    tag: "REST API",
    title: "REST APIs for Beginners - Full Course",
    author: "Academind",
    views: "1.4M views",
    duration: "1:12:00",
    url: "https://www.youtube.com/watch?v=-MTSQjw5DrM",
    targetRole: "Backend Developer",
  },
  {
    category: "youtube",
    tag: "Redis",
    title: "Redis Crash Course",
    author: "Fireship",
    views: "850K views",
    duration: "12:45",
    url: "https://www.youtube.com/watch?v=G1rOthIU-uo",
    targetRole: "Backend Developer",
  },

  // Documentation Resources
  {
    category: "docs",
    tag: "Node.js",
    title: "Official Node.js Documentation & Guides",
    author: "nodejs.org",
    views: "Official Doc",
    duration: "15 min read",
    url: "https://nodejs.org/docs",
    targetRole: "Backend Developer",
  },
  {
    category: "docs",
    tag: "Express",
    title: "Express.js API Reference & Middleware",
    author: "expressjs.com",
    views: "Official Doc",
    duration: "20 min read",
    url: "https://expressjs.com",
    targetRole: "Backend Developer",
  },
  {
    category: "docs",
    tag: "PostgreSQL",
    title: "PostgreSQL Official Documentation Manual",
    author: "postgresql.org",
    views: "Official Doc",
    duration: "30 min read",
    url: "https://www.postgresql.org/docs/",
    targetRole: "Backend Developer",
  },

  // Article Resources
  {
    category: "articles",
    tag: "Architecture",
    title: "Understanding the Node.js Event Loop Architecture",
    author: "Medium · Engineering",
    views: "450K reads",
    duration: "8 min read",
    url: "https://medium.com",
    targetRole: "Backend Developer",
  },
  {
    category: "articles",
    tag: "Security",
    title: "JWT Authentication & Best Practices for REST APIs",
    author: "Dev.to",
    views: "320K reads",
    duration: "10 min read",
    url: "https://dev.to",
    targetRole: "Backend Developer",
  },
  {
    category: "articles",
    tag: "Database",
    title: "SQL vs NoSQL: How to Choose the Right Database",
    author: "DigitalOcean Tutorials",
    views: "610K reads",
    duration: "12 min read",
    url: "https://www.digitalocean.com/community/tutorials",
    targetRole: "Backend Developer",
  },
];

/**
 * Fetch categorized learning resources with auto-seeding
 * @param {string} targetRole - Target role to filter resources by
 */
export const getRecommendedResources = async (targetRole = "Backend Developer") => {
  const count = await Resource.countDocuments();
  if (count === 0) {
    await Resource.insertMany(seedDefaultResources);
  }

  const allResources = await Resource.find({
    $or: [{ targetRole }, { targetRole: "Backend Developer" }],
  });

  const youtube = allResources.filter((r) => r.category === "youtube");
  const docs = allResources.filter((r) => r.category === "docs");
  const articles = allResources.filter((r) => r.category === "articles");

  return {
    title: "Learning Resources",
    subtitle: `Hand-picked free resources for your ${targetRole} path`,
    categories: [
      { id: "youtube", label: "YouTube" },
      { id: "docs", label: "Documentation" },
      { id: "articles", label: "Articles" },
    ],
    items: {
      youtube,
      docs,
      articles,
    },
  };
};
