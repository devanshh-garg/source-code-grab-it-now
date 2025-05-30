
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
        throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY environment variable");
      }
      
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch (parseError) {
        throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY: not valid JSON");
      }

      if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error("Invalid service account: missing required fields (project_id, client_email, private_key)");
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

      console.log('JWT payload:', JSON.stringify(payload, null, 2));

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
        throw new Error(`JWT generation failed: ${jwtError.message}`);
      }
    } else if (passType === 'apple') {
      // Apple Wallet logic (placeholder)
      const applePass = await generateAppleWalletPass(passData);
      return new Response(applePass, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/vnd.apple.pkpass',
          'Content-Disposition': `attachment; filename="${passData.cardName}.pkpass"`
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid passType. Must be 'apple' or 'google'" }), {
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

// Dummy Apple Wallet pass generator (replace with your actual implementation)
async function generateAppleWalletPass(passData: PassData): Promise<Uint8Array> {
  // TODO: Implement real Apple Wallet pass generation
  console.log('Apple Wallet pass generation not implemented yet');
  return new Uint8Array();
}
