import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const HUBSPOT_API_TOKEN = Deno.env.get('HUBSPOT_API_TOKEN');
const HUBSPOT_LIST_ID = '40189621';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: ContactRequest = await req.json();

    console.log('Syncing contact to HubSpot:', { email, firstName, lastName });

    // Create or update contact in HubSpot
    const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: firstName || '',
          lastname: lastName || '',
        },
      }),
    });

    let contactData;
    const responseText = await contactResponse.text();
    
    // Check if contact already exists (409 conflict)
    if (contactResponse.status === 409) {
      console.log('Contact already exists, fetching existing contact');
      
      // Search for existing contact by email
      const searchResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              }],
            }],
          }),
        }
      );

      const searchData = await searchResponse.json();
      if (searchData.results && searchData.results.length > 0) {
        contactData = searchData.results[0];
        console.log('Found existing contact:', contactData.id);
      } else {
        throw new Error('Contact exists but could not be found');
      }
    } else if (!contactResponse.ok) {
      console.error('HubSpot contact creation failed:', contactResponse.status, responseText);
      throw new Error(`Failed to create contact: ${contactResponse.status} - ${responseText}`);
    } else {
      contactData = JSON.parse(responseText);
      console.log('Contact created:', contactData.id);
    }

    // Add contact to the list
    const listResponse = await fetch(
      `https://api.hubapi.com/crm/v3/lists/${HUBSPOT_LIST_ID}/memberships/add`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            id: contactData.id,
          },
        ]),
      }
    );

    if (!listResponse.ok) {
      const listError = await listResponse.text();
      console.error('Failed to add contact to list:', listResponse.status, listError);
      // Don't throw error here, contact was created successfully
    } else {
      console.log('Contact added to list successfully');
    }

    // Set contact as marketing contact
    const marketingResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactData.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            hs_marketable_status: 'true',
            hs_marketable_reason_type: 'NON_GDPR',
          },
        }),
      }
    );

    if (!marketingResponse.ok) {
      const marketingError = await marketingResponse.text();
      console.error('Failed to set marketing status:', marketingResponse.status, marketingError);
    } else {
      console.log('Contact set as marketing contact');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        contactId: contactData.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in sync-hubspot-contact function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
