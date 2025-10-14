# Stripe Webhook Setup Instructions

This guide explains how to set up the webhook-based Stripe integration for trybio.ai.

## Overview

The system now uses:
- **Stripe Payment Links** for checkout (no CORS issues)
- **Stripe Webhooks** to update subscription status server-to-server
- **Direct table reads** from `pro_status` table (no edge function calls)

## Setup Steps

### 1. Run SQL Migration

In your Supabase SQL Editor for project `hxjlplwqpkstkjyekrce`, run the contents of:
```
supabase_sql/pro_status.sql
```

This creates the `pro_status` table with proper RLS policies.

### 2. Configure Environment Variables

In Supabase → Project Settings → Edge Functions → Environment Variables, add:

```bash
SUPABASE_URL=https://hxjlplwqpkstkjyekrce.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your service role key]
STRIPE_SECRET_KEY=[your Stripe secret key - sk_live_...]
STRIPE_WEBHOOK_SECRET=[get this from step 3]
```

### 3. Configure Stripe Webhook

The webhook function will be deployed to:
```
https://hxjlplwqpkstkjyekrce.supabase.co/functions/v1/stripe-webhook
```

In Stripe Dashboard:
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter webhook URL: `https://hxjlplwqpkstkjyekrce.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Supabase environment variables as `STRIPE_WEBHOOK_SECRET`

### 4. Payment Links

The system uses these Stripe Payment Links:

- **Pro ($19/mo)**: https://buy.stripe.com/bJe7sMgxegr48nvdlj9sk00
- **Business ($49/mo)**: https://buy.stripe.com/fZu3cw94M5Mq6fn5SR9sk01

These are already configured in the code.

### 5. Success/Cancel URLs

Configure your Stripe Payment Links with:
- **Success URL**: `https://trybio.ai/upgrade?success=true`
- **Cancel URL**: `https://trybio.ai/upgrade?canceled=true`

## How It Works

1. **User clicks upgrade** → Opens Stripe Payment Link
2. **User completes payment** → Stripe sends webhook to your edge function
3. **Webhook function** → Updates `pro_status` table in Supabase
4. **Frontend reads** → `pro_status` table directly (no function calls)
5. **No CORS issues** → Server-to-server webhook, client reads from database

## Testing

### Test the webhook locally:
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

### Test with Stripe CLI:
```bash
stripe trigger checkout.session.completed
```

### Verify in Supabase:
```sql
SELECT * FROM public.pro_status;
```

## Removed Components

The following have been removed:
- ✅ All calls to `check-subscription` edge function
- ✅ All calls to `create-checkout` edge function
- ✅ Polling/interval subscription checks
- ✅ CORS-related issues

## What's Kept

- ✅ `customer-portal` function (for managing subscriptions)
- ✅ User authentication
- ✅ Direct table reads via RLS

## Troubleshooting

### Webhook not firing
- Check Stripe Dashboard → Developers → Webhooks → View logs
- Verify webhook URL is correct
- Check environment variables are set

### Pro status not updating
- Check Supabase logs for webhook function
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check RLS policies on `pro_status` table

### User can't see their pro status
- Verify user is logged in
- Check user's email matches the one used in Stripe
- Run: `SELECT * FROM pro_status WHERE email = 'user@example.com';`
