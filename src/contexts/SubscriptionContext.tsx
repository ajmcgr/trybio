import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SubscriptionContextType {
  user: User | null;
  subscribed: boolean;
  plan: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Payment Links
export const PAYMENT_LINKS = {
  pro_monthly: 'https://buy.stripe.com/bJe7sMgxegr48nvdlj9sk00',
  business_monthly: 'https://buy.stripe.com/fZu3cw94M5Mq6fn5SR9sk01',
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = async () => {
    try {
      console.log('[SubscriptionContext] Refreshing subscription status...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        console.log('[SubscriptionContext] No session found');
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
        setLoading(false);
        return;
      }

      console.log('[SubscriptionContext] Checking pro_status for:', session.user.email);
      
      // Read from pro_status table
      const { data, error } = await supabase
        .from('pro_status')
        .select('plan, current_period_end')
        .eq('email', session.user.email)
        .maybeSingle();

      if (error) {
        console.error('[SubscriptionContext] Error reading pro_status:', error);
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
      } else if (data) {
        console.log('[SubscriptionContext] Pro status found:', data);
        setSubscribed(true);
        setPlan(data.plan || 'pro');
        setSubscriptionEnd(data.current_period_end);
      } else {
        console.log('[SubscriptionContext] No pro status found');
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
      }
    } catch (error) {
      console.error('[SubscriptionContext] Error refreshing subscription:', error);
      setSubscribed(false);
      setPlan(null);
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        refreshSubscription();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        refreshSubscription();
      } else {
        setSubscribed(false);
        setPlan(null);
        setSubscriptionEnd(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        subscribed,
        plan,
        subscriptionEnd,
        loading,
        refreshSubscription,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
