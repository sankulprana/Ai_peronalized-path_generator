import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView } from "../services/analytics";

/**
 * Component that initializes GA4 and listens to route changes
 * to dispatch page_view events automatically in the SPA.
 */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
