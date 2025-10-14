import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    $crisp?: any;
  }
}

const CrispChat = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on a bio page (dynamic username route)
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

    // Wait for Crisp to be ready before trying to hide/show
    const checkCrisp = setInterval(() => {
      if (window.$crisp && window.$crisp.is && window.$crisp.is("chat:visible") !== undefined) {
        clearInterval(checkCrisp);
        
        if (isBioPage) {
          window.$crisp.push(["do", "chat:hide"]);
        } else {
          window.$crisp.push(["do", "chat:show"]);
        }
      }
    }, 100);

    // Cleanup interval after 5 seconds if Crisp never loads
    const timeout = setTimeout(() => clearInterval(checkCrisp), 5000);

    return () => {
      clearInterval(checkCrisp);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  return null;
};

export default CrispChat;
