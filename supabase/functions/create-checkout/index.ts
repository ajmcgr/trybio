import { getCorsHeaders, okOptions } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return okOptions(req);
  const headers = { 'Content-Type': 'application/json', ...getCorsHeaders(req.headers.get('origin')) };

  try {
    const body = await req.json().catch(() => ({}));
    const { priceId, successUrl, cancelUrl, customerEmail } = body;
    const price = priceId || Deno.env.get('STRIPE_PRICE_PRO');
    if (!price) throw new Error('Missing priceId or STRIPE_PRICE_PRO');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl || 'https://trybio.ai/upgrade/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://trybio.ai/upgrade/cancel',
      customer_email: customerEmail,
    });

    return new Response(JSON.stringify({ ok: true, url: session.url }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500, headers });
  }
});
