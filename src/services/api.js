/**
 * API Service Layer for PathAI Platform
 * Handles communication with Node.js/Express backend APIs with automatic token authorization
 * and fallback grace handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = (tokenOverride = null) => {
  const token = tokenOverride || localStorage.getItem("pathai_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    completeOnboarding: async (onboardingData) => {
      const res = await fetch(`${API_BASE_URL}/auth/onboarding`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(onboardingData),
      });
      return handleResponse(res);
    },
  },

  // Dashboard API
  dashboard: {
    getStats: async () => {
      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Roadmap API
  roadmaps: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/roadmaps`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    generate: async (options) => {
      const res = await fetch(`${API_BASE_URL}/roadmaps/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(options),
      });
      return handleResponse(res);
    },
    toggleTask: async (roadmapId, taskId) => {
      const res = await fetch(`${API_BASE_URL}/roadmaps/${roadmapId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Planner API
  planner: {
    getPlanner: async () => {
      const res = await fetch(`${API_BASE_URL}/planner`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateFocus: async (focusData) => {
      const res = await fetch(`${API_BASE_URL}/planner/focus`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(focusData),
      });
      return handleResponse(res);
    },
    toggleSession: async (sessionData) => {
      const res = await fetch(`${API_BASE_URL}/planner/sessions`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(sessionData),
      });
      return handleResponse(res);
    },
  },

  // Resources API
  resources: {
    getAll: async (category = "") => {
      const url = category ? `${API_BASE_URL}/resources?category=${category}` : `${API_BASE_URL}/resources`;
      const res = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Progress API
  progress: {
    getAnalytics: async () => {
      const res = await fetch(`${API_BASE_URL}/progress`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // AI Doubt Solver API
  ai: {
    askDoubt: async (query, contextGoal) => {
      const res = await fetch(`${API_BASE_URL}/ai/doubt-solver`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ query, contextGoal }),
      });
      return handleResponse(res);
    },
  },
};
