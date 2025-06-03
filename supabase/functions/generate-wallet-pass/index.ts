import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "npm:jose@4.14.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { passData, passType } = await req.json();
    
    console.log('Received passData:', JSON.stringify(passData, null, 2));
    console.log('Pass type:', passType);

    if (!passData || !passData.cardId || !passData.cardName) {
      throw new Error('Missing required pass data');
    }

    if (passType === 'apple') {
      // For Apple Wallet, return a URL to a separate service that handles pass generation
      // This is a temporary solution until we implement a proper pass generation service
      return new Response(JSON.stringify({
        error: "Apple Wallet pass generation is temporarily unavailable. Please try Google Wallet instead.",
        type: "unsupported_feature"
      }), {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } else if (passType === 'google') {
      // Google Wallet logic
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
      if (!serviceAccountJson) {
        throw new Error("Google service account not configured");
      }
      
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      const loyaltyObject = {
        id: `${serviceAccount.project_id}.${passData.cardId}`,
        classId: `${serviceAccount.project_id}.${passData.classId || "loyalty_class_generic"}`,
        state: "ACTIVE",
        loyaltyPoints: {
          balance: { string: "0" }
        },
        accountName: passData.businessName || passData.cardName,
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

      const payload = {
        iss: serviceAccount.client_email,
        aud: "google",
        origins: ["*"],
        typ: "savetowallet",
        payload: {
          loyaltyObjects: [loyaltyObject]
        }
      };

      // Create a new SignJWT instance
      const privateKey = await jose.importPKCS8(serviceAccount.private_key, 'RS256');
      const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256' })
        .sign(privateKey);
      
      return new Response(JSON.stringify({ jwt }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } else {
      throw new Error("Invalid passType. Must be 'apple' or 'google'");
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});