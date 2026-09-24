/**
 * Google Analytics 4 (GA4) Integration Service
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

let isInitialized = false;

/**
 * Initialize Google Analytics by injecting the gtag.js script
 * @param {string} [measurementId] - Optional override for Measurement ID (format: G-XXXXXXXXXX)
 */
export const initGA = (measurementId = GA_MEASUREMENT_ID) => {
  if (typeof window === "undefined" || !measurementId || measurementId === "G-XXXXXXXXXX") {
    return;
  }

  if (isInitialized) return;

  // Insert Google Analytics Script Tag
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false, // Page views handled manually for SPA route changes
  });

  isInitialized = true;
};

/**
 * Track a page view event
 * @param {string} path - URL pathname (e.g. /roadmap)
 * @param {string} [title] - Page title
 */
export const trackPageView = (path, title = document.title) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

/**
 * Track custom events
 * @param {string} action - Event action/name (e.g., 'generate_roadmap', 'search_query')
 * @param {object} [params] - Custom parameters to attach to the event
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, params);
};

/**
 * Set user identity / properties (e.g. upon login)
 * @param {string} userId - User identifier
 * @param {object} [userProperties] - Additional user properties
 */
export const setAnalyticsUser = (userId, userProperties = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;

  if (userId) {
    window.gtag("set", { user_id: userId });
  }

  if (Object.keys(userProperties).length > 0) {
    window.gtag("set", "user_properties", userProperties);
  }
};
