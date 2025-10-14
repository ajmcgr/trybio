import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useProStatus } from '@/lib/useProStatus';

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
  
  // Use the new useProStatus hook to read directly from pro_status table
  const { loading, isPro, plan, subscriptionEnd } = useProStatus(supabase, { 
    email: user?.email, 
    debug: true 
  });

  const refreshSubscription = async () => {
    // Force a re-render by updating user state
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const openCustomerPortal = async () => {
    try {
      console.log('[CustomerPortal] Opening customer portal...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('[CustomerPortal] No session found, redirecting to /auth');
        window.location.href = '/auth';
        return;
      }

      console.log('[CustomerPortal] Invoking customer-portal function...');
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('[CustomerPortal] Error:', error);
        throw error;
      }

      console.log('[CustomerPortal] Response:', data);

      if (data?.url) {
        console.log('[CustomerPortal] Redirecting to:', data.url);
        window.location.href = data.url as string;
      } else {
        console.error('[CustomerPortal] No URL in response');
      }
    } catch (error) {
      console.error('[CustomerPortal] Error opening customer portal:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        subscribed: isPro,
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
