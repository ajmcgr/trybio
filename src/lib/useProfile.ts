import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = { 
  id: string; 
  username: string | null; 
  full_name: string | null; 
  avatar_url: string | null;
  bio?: string | null;
  wallpaper_url?: string | null;
  text_color?: string | null;
  button_color?: string | null;
  button_text_color?: string | null;
  background_color?: string | null;
  font?: string | null;
  links?: any;
  is_primary?: boolean;
};

type State = { loading: boolean; error?: string; data?: Profile | null };

export function useProfile(supabase: SupabaseClient, userId?: string | null) {
  const [state, setState] = useState<State>({ loading: !!userId });
  const inFlight = useRef(false);
  const hardErrorUntil = useRef<number | null>(null); // backoff gate

  useEffect(() => {
    if (!userId) { 
      setState({ loading: false, data: null }); 
      return; 
    }

    // Backoff if we recently hit a 4xx/5xx
    const now = Date.now();
    if (hardErrorUntil.current && now < hardErrorUntil.current) return;

    if (inFlight.current) return;
    inFlight.current = true;

    (async () => {
      try {
        const { data, error, status } = await supabase
          .from("profiles_api") // COMPAT VIEW (id = user_id)
          .select("id, username, full_name, avatar_url, bio, wallpaper_url, text_color, button_color, button_text_color, background_color, font, links, is_primary")
          .eq("id", userId)
          .maybeSingle();

        if (status >= 400) {
          // Stop the spam: set a short backoff (e.g., 10 minutes)
          hardErrorUntil.current = Date.now() + 10 * 60 * 1000;
        }
        if (error) {
          setState({ loading: false, error: error.message });
        } else {
          setState({ loading: false, data: data ?? null });
        }
      } finally {
        inFlight.current = false;
      }
    })();
  // only re-run when userId changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return state;
}
