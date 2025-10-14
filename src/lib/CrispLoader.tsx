import { useEffect } from "react";

// Define routes where Crisp is ALLOWED (everything else = off)
const ENABLED_PATHS = [
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

function isPublicBioPath(pathname: string) {
  // Matches /<slug> (no trailing slash, no more segments)
  // Example: /alex, /john_doe
  // Exclude known app routes to avoid collisions
  if (ENABLED_PATHS.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return false;
  }
  const parts = pathname.split("/").filter(Boolean);
  return parts.length === 1; // single segment = likely a public bio
}

export default function CrispLoader() {
  useEffect(() => {
    const pathname = window.location.pathname;

    // If this looks like a public bio page, ensure Crisp is OFF.
    if (isPublicBioPath(pathname)) {
      // Set data attribute for CSS fallback
      document.documentElement.setAttribute("data-crisp-off", "true");

      // Hard kill any existing Crisp
      try {
        // Hide/close if already booted
        // @ts-ignore
        window.$crisp?.push?.(["do", "chat:hide"]);
        // @ts-ignore
        window.$crisp?.push?.(["do", "chat:close"]);
      } catch (_) {}

      // Remove injected script tag
      const s = document.querySelector<HTMLScriptElement>('script[src*="crisp.chat"], script[src*="client.crisp.chat"]');
      if (s?.parentNode) s.parentNode.removeChild(s);

      // Remove crisp DOM nodes if present
      const crispNodes = document.querySelectorAll('[id^="crisp-"], [class*="crisp-client"]');
      crispNodes.forEach((n) => n.parentNode?.removeChild(n));

      // Nuke globals to prevent re-init
      // @ts-ignore
      delete (window as any).$crisp;
      // @ts-ignore
      delete (window as any).CRISP_WEBSITE_ID;

      return; // do not load script
    }

    // Remove the data attribute on allowed pages
    document.documentElement.removeAttribute("data-crisp-off");

    // Enable Crisp on allowed pages only
    if (!ENABLED_PATHS.some(route => pathname === route || pathname.startsWith(route + "/"))) {
      return;
    }

    // Already loaded?
    // @ts-ignore
    if (window.$crisp && document.querySelector('script[src*="crisp.chat"]')) {
      // Show it if it was hidden
      try {
        // @ts-ignore
        window.$crisp?.push?.(["do", "chat:show"]);
      } catch (_) {}
      return;
    }

    // Init globals
    // @ts-ignore
    window.$crisp = [];
    // @ts-ignore
    window.CRISP_WEBSITE_ID = "e4cf3841-cb57-4b69-9fbf-a40b62bbe635";

    // Inject script
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  }, []);

  return null;
}
