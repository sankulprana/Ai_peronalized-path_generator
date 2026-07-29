import Planner from "../models/Planner.js";

export const generateDefaultPlanner = async (userId) => {
  const defaultPlannerData = {
    user: userId,
    weekRange: "Week of July 14–20, 2025",
    totalHours: "8.5 hours scheduled",
    todayDate: "Thursday, July 17",
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

  return await Planner.create(defaultPlannerData);
};
