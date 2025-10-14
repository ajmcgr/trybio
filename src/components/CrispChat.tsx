import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    $crisp?: any[];
  }
}

const CrispChat = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on a bio page (dynamic username route)
    // Bio pages are any route that matches /:username pattern
    // We exclude known routes like /dashboard, /auth, /settings, etc.
    const knownRoutes = [
      "/",
      "/auth",
      "/dashboard",
      "/editor",
      "/upgrade",
      "/settings",
      "/about",
      "/privacy",
      "/terms",
      "/tools",
    ];

    const isBioPage = !knownRoutes.some(
      (route) => location.pathname === route || location.pathname.startsWith(route)
    );

    // Hide or show Crisp chat based on whether we're on a bio page
    if (window.$crisp) {
      if (isBioPage) {
        window.$crisp.push(["do", "chat:hide"]);
      } else {
        window.$crisp.push(["do", "chat:show"]);
      }
    }
  }, [location.pathname]);

  return null;
};

export default CrispChat;
