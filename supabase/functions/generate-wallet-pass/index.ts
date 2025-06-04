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
      return new Response(JSON.stringify({
        error: "Apple Wallet pass generation is temporarily unavailable. Please try Google Wallet instead.",
        type: "unsupported_feature"
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } 
    
    if (passType === 'google') {
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
      if (!serviceAccountJson) {
        throw new Error("Google service account not configured");
      }
      
      const serviceAccount = JSON.parse(serviceAccountJson);

      // Default images from Pexels (valid, publicly accessible URLs)
      const defaultLogoUrl = "https://images.pexels.com/photos/1162361/pexels-photo-1162361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
      const defaultHeroUrl = "https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

      // Create the loyalty class if it doesn't exist
      const loyaltyClass = {
        id: `${serviceAccount.project_id}.${passData.classId || "loyalty_class_1"}`,
        issuerName: passData.businessName || "LoyaltyCard",
        programName: passData.cardName,
        programLogo: {
          sourceUri: {
            uri: passData.logoUrl || defaultLogoUrl
          }
        },
        reviewStatus: "APPROVED", // Changed from UNDER_REVIEW to APPROVED
        hexBackgroundColor: passData.backgroundColor || "#3B82F6"
      };
      
      // Create the loyalty object (individual pass)
      const loyaltyObject = {
        id: `${serviceAccount.project_id}.${passData.cardId}`,
        classId: loyaltyClass.id,
        state: "ACTIVE",
        heroImage: {
          sourceUri: {
            uri: passData.logoUrl || defaultHeroUrl
          }
        },
        textModulesData: [
          {
            header: "Reward Progress",
            body: passData.rewardTitle || "Collect stamps to earn rewards"
          }
        ],
        linksModuleData: {
          uris: [
            {
              uri: `${passData.baseUrl || 'https://loyaltycard.app'}/cards/${passData.cardId}`,
              description: "View Card Details"
            }
          ]
        },
        imageModulesData: [
          {
            mainImage: {
              sourceUri: {
                uri: passData.logoUrl || defaultLogoUrl
              }
            }
          }
        ],
        barcode: {
          type: "QR_CODE",
          value: `${passData.cardId}`,
          alternateText: passData.cardId
        }
      };

      // Create JWT claims
      const claims = {
        iss: serviceAccount.client_email,
        aud: 'google',
        origins: ['*'],
        typ: 'savetowallet',
        payload: {
          loyaltyObjects: [loyaltyObject],
          loyaltyClasses: [loyaltyClass]
        }
      };

      // Sign the JWT
      const privateKey = await jose.importPKCS8(
        serviceAccount.private_key, 
        'RS256'
      );
      
      const jwt = await new jose.SignJWT(claims)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      return new Response(
        JSON.stringify({ jwt }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    throw new Error("Invalid pass type. Must be 'apple' or 'google'");
  } catch (error) {
    console.error('Error generating wallet pass:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});