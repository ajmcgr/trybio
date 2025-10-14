# Welcome Email Setup with Resend

## What's Been Set Up

I've created a welcome email system that sends a beautiful email via Resend when users sign up (including Google Auth).

## Setup Steps

### 1. Configure Auth Hook in Supabase

Go to your Supabase Dashboard → Authentication → Hooks and configure:

**Hook:** `Send Email Hook`
**Event:** `user.created` (triggers on signup)
**Function:** `send-welcome-email`

This will trigger the edge function every time a user signs up.

### 2. Verify Resend Domain

Make sure you've verified your domain in Resend:
- Go to https://resend.com/domains
- Add and verify your domain (e.g., trybio.ai)
- Update the `from` field in the edge function from `onboarding@resend.dev` to your verified domain email

### 3. Optional: Use Resend for System Emails

To use Resend for Supabase confirmation emails (instead of Supabase's default):

1. Go to Supabase Dashboard → Settings → Auth → SMTP Settings
2. Enable Custom SMTP
3. Configure with Resend SMTP:
   - **Host:** smtp.resend.com
   - **Port:** 465 or 587
   - **Username:** resend
   - **Password:** Your RESEND_API_KEY
   - **Sender email:** Your verified email (e.g., noreply@trybio.ai)
   - **Sender name:** TryBio

This will make ALL auth emails (confirmation, password reset, etc.) go through Resend.

## Testing

1. Sign up with a new account (email or Google)
2. Check the Edge Function logs in Supabase Dashboard → Edge Functions → send-welcome-email
3. You should see log messages showing the email was sent
4. Check your inbox for the welcome email

## Email Template

The welcome email includes:
- Personalized greeting with user's name
- Welcome message
- "Get Started" button linking to dashboard
- Professional branding

You can customize the HTML template in `supabase/functions/send-welcome-email/index.ts` (lines 52-92).
