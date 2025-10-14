import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type Opts = { email?: string | null; debug?: boolean };

export function useProStatus(supabase: SupabaseClient, opts: Opts) {
  const email = (opts.email || '')?.toLowerCase();
  const debug = !!opts.debug;

  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!email) { 
        setLoading(false); 
        setIsPro(false); 
        setPlan(null); 
        setSubscriptionEnd(null);
        return; 
      }
      try {
        if (debug) console.log('[ProStatus] querying pro_status for', email);
        const { data, error, status } = await supabase
          .from('pro_status')
          .select('plan,current_period_end')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          // If the table doesn't exist yet, PostgREST returns 404.
          if (debug) console.warn('[ProStatus] read error', { error, status });
          if (!cancelled) {
            setIsPro(false); 
            setPlan(null);
            setSubscriptionEnd(null);
          }
        } else {
          const p = data?.plan ?? null;
          if (!cancelled) {
            setPlan(p);
            setIsPro(p === 'pro');
            setSubscriptionEnd(data?.current_period_end ?? null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [supabase, email, debug]);

  return { loading, isPro, plan, subscriptionEnd };
}
