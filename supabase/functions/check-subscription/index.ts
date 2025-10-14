import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { getCorsHeaders, okOptions } from "../_shared/cors.ts";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return okOptions(req);
  }

  const headers = getCorsHeaders(req.headers.get('origin'));

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      return new Response(JSON.stringify({ subscribed: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptionsRes = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 5,
    });

    let productId = null;
    let priceId = null;
    let subscriptionEnd = null;

    // Prefer active/trialing subscriptions
    const subscription = subscriptionsRes.data.find((s: any) =>
      ["active", "trialing"].includes((s.status as string) ?? "")
    );

    const hasSub = Boolean(subscription);

    if (subscription) {
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Subscription found", { subscriptionId: subscription.id, status: subscription.status, endDate: subscriptionEnd });
      productId = (subscription.items.data[0]?.price?.product as string) ?? null;
      priceId = (subscription.items.data[0]?.price?.id as string) ?? null;
      logStep("Determined subscription tier", { productId, priceId });
    } else {
      logStep("No active or trialing subscription found", { count: subscriptionsRes.data.length, statuses: subscriptionsRes.data.map((s: any) => s.status) });
    }

    return new Response(JSON.stringify({
      subscribed: hasSub,
      product_id: productId,
      price_id: priceId,
      subscription_end: subscriptionEnd
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }
});
