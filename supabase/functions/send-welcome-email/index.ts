/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WELCOME-EMAIL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const payload = await req.json();
    logStep("Received payload", { 
      type: payload.type, 
      hasUser: !!payload.record 
    });

    // Only process signup events
    if (payload.type !== "INSERT") {
      logStep("Skipping - not a signup event");
      return new Response(JSON.stringify({ message: "Not a signup event" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = payload.record;
    if (!user?.email) {
      throw new Error("No email found in user record");
    }

    logStep("Processing signup for user", { email: user.email });

    // Extract user name from metadata if available
    const userName = user.raw_user_meta_data?.full_name || 
                     user.raw_user_meta_data?.name ||
                     user.email.split('@')[0];

    // Create HTML email template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 40px 48px;">
                <h1 style="color: #333; font-size: 32px; font-weight: bold; margin: 0 0 24px 0;">Welcome to TryBio! 🎉</h1>
                <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  Hi${userName ? ` ${userName}` : ''},
                </p>
                <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  Thank you for signing up! We're excited to have you on board.
                </p>
                <div style="padding: 24px 0;">
                  <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                    You can now start creating your personalized bio link and share it with your audience.
                  </p>
                </div>
                <div style="text-align: center; padding: 27px 0;">
                  <a href="https://trybio.ai/dashboard" style="background-color: #5469d4; border-radius: 6px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 24px; display: inline-block;">
                    Get Started
                  </a>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  If you have any questions, feel free to reach out to our support team.
                </p>
                <p style="color: #898989; font-size: 14px; line-height: 22px; margin-top: 32px;">
                  TryBio - Your personalized bio link platform<br>
                  <a href="https://trybio.ai" style="color: #5469d4; text-decoration: underline;">trybio.ai</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    logStep("Email template created");

    // Send the email via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TryBio <onboarding@resend.dev>",
        to: [user.email],
        subject: "Welcome to TryBio! 🎉",
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const data = await resendResponse.json();
    logStep("Welcome email sent successfully", { emailId: data.id });

    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR sending welcome email", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
