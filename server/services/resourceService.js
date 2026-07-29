import Resource from "../models/Resource.js";

const seedDefaultResources = [
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
    category: "articles",
    tag: "Architecture",
    title: "Understanding the Node.js Event Loop Architecture",
    author: "Medium · Engineering",
    views: "450K reads",
    duration: "8 min read",
    url: "https://medium.com",
    targetRole: "Backend Developer",
  },
];

export const getRecommendedResources = async (targetRole = "Backend Developer") => {
  const count = await Resource.countDocuments();
  if (count === 0) {
    await Resource.insertMany(seedDefaultResources);
  }

  const allResources = await Resource.find({
    $or: [{ targetRole }, { targetRole: "Backend Developer" }],
  });

  return {
    title: "Learning Resources",
    subtitle: `Hand-picked free resources for your ${targetRole} path`,
    categories: [
      { id: "youtube", label: "YouTube" },
      { id: "docs", label: "Documentation" },
      { id: "articles", label: "Articles" },
    ],
    items: {
      youtube: allResources.filter((r) => r.category === "youtube"),
      docs: allResources.filter((r) => r.category === "docs"),
      articles: allResources.filter((r) => r.category === "articles"),
    },
  };
};
