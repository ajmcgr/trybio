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
    const { customerId } = body;
    if (!customerId) throw new Error('Missing customerId');

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active' });
    const active = subscriptions.data.length > 0;

    return new Response(JSON.stringify({ ok: true, active }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500, headers });
  }
});
