
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as jose from "npm:jsonwebtoken@9.0.0"

interface PassData {
  cardId: string;
  cardName: string;
  businessName: string;
  rewardTitle?: string;
  backgroundColor?: string;
  logoUrl?: string;
  type?: string;
  totalNeeded?: number;
  classId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { passData, passType } = await req.json();
    
    console.log('Received passData:', JSON.stringify(passData, null, 2));
    console.log('Pass type:', passType);

    // Validate required fields
    if (!passData || !passData.cardId || !passData.cardName) {
      throw new Error('Missing required pass data: cardId and cardName are required');
    }

    if (passType === 'google') {
      // Google Wallet logic
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
      if (!serviceAccountJson) {
        console.error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
        return new Response(JSON.stringify({ 
          error: "Google service account not configured. Please set GOOGLE_SERVICE_ACCOUNT_KEY in your Supabase project secrets.",
          details: "Missing GOOGLE_SERVICE_ACCOUNT_KEY environment variable"
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
      }
      
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('Service account parsed successfully');
      } catch (parseError) {
        console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", parseError);
        return new Response(JSON.stringify({ 
          error: "Invalid Google service account configuration. Please check your GOOGLE_SERVICE_ACCOUNT_KEY format.",
          details: "Service account JSON is not valid"
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
      }

      // Validate required service account fields
      const requiredFields = ['project_id', 'client_email', 'private_key'];
      const missingFields = requiredFields.filter(field => !serviceAccount[field]);
      
      if (missingFields.length > 0) {
        console.error("Missing required service account fields:", missingFields);
        return new Response(JSON.stringify({ 
          error: `Invalid Google service account: missing required fields: ${missingFields.join(', ')}`,
          details: "Please ensure your service account JSON contains all required fields"
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
      }

      const loyaltyObject = {
        id: `${serviceAccount.project_id}.${passData.cardId}`,
        classId: `${serviceAccount.project_id}.${passData.classId || "loyalty_class_generic"}`,
        state: "ACTIVE",
        loyaltyPoints: {
          balance: { string: "0" }
        },
        accountName: passData.businessName || passData.cardName || 'Loyalty Card',
        accountId: passData.cardId,
        textModulesData: [
          {
            header: "Reward",
            body: passData.rewardTitle || 'Loyalty Reward'
          }
        ],
        barcode: {
          type: "QR_CODE",
          value: `loyalty:${passData.cardId}`
        }
      };

      console.log('Created loyalty object:', JSON.stringify(loyaltyObject, null, 2));

      const payload = {
        iss: serviceAccount.client_email,
        aud: "google",
        origins: ["*"],
        typ: "savetowallet",
        payload: {
          loyaltyObjects: [loyaltyObject]
        }
      };

      console.log('JWT payload prepared');

      try {
        const jwt = jose.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });
        console.log('JWT generated successfully');
        
        return new Response(JSON.stringify({ jwt }), {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
      } catch (jwtError) {
        console.error('JWT generation error:', jwtError);
        return new Response(JSON.stringify({ 
          error: `JWT generation failed: ${jwtError.message}`,
          details: "Check your service account private key format"
        }), {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
      }
    } else if (passType === 'apple') {
      // Apple Wallet logic (placeholder)
      return new Response(JSON.stringify({ 
        error: "Apple Wallet pass generation not implemented yet" 
      }), {
        status: 501,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: "Invalid passType. Must be 'apple' or 'google'" 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
});
