import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-08-27.basil",
});

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req: Request) => {
  try {
    logStep("Webhook received");

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      logStep("ERROR: Missing signature");
      return new Response("Missing signature", { status: 400 });
    }

    const rawBody = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("ERROR: STRIPE_WEBHOOK_SECRET not set");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    logStep("Event verified", { type: event.type });

    const type = event.type;
    let email: string | null = null;
    let plan: string | null = null;
    let periodEnd: string | null = null;

    // Handle checkout.session.completed
    if (type === "checkout.session.completed") {
      const session = event.data.object as any;
      email = session?.customer_details?.email || session?.customer_email || null;
      plan = "pro";
      
      // If subscription, get period end
      if (session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          logStep("Subscription period retrieved", { periodEnd });
        } catch (e) {
          logStep("Failed to retrieve subscription", { error: String(e) });
        }
      }
      
      logStep("Checkout session completed", { email, plan });
    }

    // Handle invoice.paid (renewals)
    if (type === "invoice.paid") {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;
      
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          // @ts-ignore
          email = customer?.email || null;
          plan = "pro";
          
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          }
          
          logStep("Invoice paid", { email, plan });
        } catch (e) {
          logStep("Failed to retrieve customer", { error: String(e) });
        }
      }
    }

    // Handle subscription updates
    if (type === "customer.subscription.updated" || type === "customer.subscription.created") {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;
      
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          // @ts-ignore
          email = customer?.email || null;
          plan = "pro";
          periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          logStep("Subscription updated", { email, plan });
        } catch (e) {
          logStep("Failed to retrieve customer", { error: String(e) });
        }
      }
    }

    // Handle subscription cancellation
    if (type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;
      
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          // @ts-ignore
          email = customer?.email || null;
          
          // Delete the pro status
          if (email) {
            const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
            const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
            
            await fetch(`${SUPABASE_URL}/rest/v1/pro_status?email=eq.${encodeURIComponent(email)}`, {
              method: "DELETE",
              headers: {
                "apikey": SERVICE_ROLE,
                "Authorization": `Bearer ${SERVICE_ROLE}`,
              },
            });
            
            logStep("Subscription cancelled, pro status removed", { email });
          }
        } catch (e) {
          logStep("Failed to handle cancellation", { error: String(e) });
        }
      }
      
      return new Response("ok", { status: 200 });
    }

    if (!email) {
      logStep("No email found, skipping");
      return new Response("ok", { status: 200 });
    }

    // Upsert into pro_status
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const nowIso = new Date().toISOString();

    const body = {
      email,
      plan: "pro",
      current_period_end: periodEnd,
      updated_at: nowIso,
    };

    logStep("Upserting to pro_status", body);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/pro_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE,
        "Authorization": `Bearer ${SERVICE_ROLE}`,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("ERROR: Failed to upsert", { status: response.status, error: errorText });
      return new Response(`Database error: ${errorText}`, { status: 500 });
    }

    logStep("Success: Pro status updated");
    return new Response("ok", { status: 200 });
  } catch (e: any) {
    const errorMessage = e?.message || String(e);
    logStep("ERROR", { message: errorMessage });
    return new Response(`webhook error: ${errorMessage}`, { status: 400 });
  }
});
