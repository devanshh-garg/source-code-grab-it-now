import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { PKPass } from "npm:passkit-generator@3.1.11"

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
      // Get Apple Wallet certificates from environment variables
      const certP12 = Deno.env.get("APPLE_PASS_P12");
      const certPassword = Deno.env.get("APPLE_PASS_PASSWORD");
      const wwdr = Deno.env.get("APPLE_WWDR_PEM");
      
      if (!certP12 || !certPassword || !wwdr) {
        throw new Error('Apple Wallet certificates not configured');
      }

      // Create pass instance
      const pass = new PKPass({
        model: './models/loyalty',
        certificates: {
          wwdr,
          signerCert: certP12,
          signerKey: certP12,
          signerKeyPassphrase: certPassword
        }
      });

      // Set pass data
      pass.setBarcodes({
        message: `loyalty:${passData.cardId}`,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      });

      // Set pass content
      const passContent = {
        formatVersion: 1,
        passTypeIdentifier: 'pass.com.yourbusiness.loyalty',
        serialNumber: passData.cardId,
        teamIdentifier: Deno.env.get("APPLE_TEAM_ID"),
        organizationName: passData.businessName,
        description: 'Loyalty Card',
        logoText: passData.businessName,
        foregroundColor: 'rgb(255, 255, 255)',
        backgroundColor: passData.backgroundColor || '#3B82F6',
        storeCard: {
          primaryFields: [
            {
              key: 'balance',
              label: 'Current Points',
              value: 0
            }
          ],
          secondaryFields: [
            {
              key: 'tier',
              label: 'Member Level',
              value: 'Standard'
            }
          ],
          backFields: [
            {
              key: 'terms',
              label: 'Terms and Conditions',
              value: passData.rewardTitle || 'Loyalty Rewards Program'
            }
          ]
        }
      };

      pass.loadBuffer(Buffer.from(JSON.stringify(passContent)));

      // Generate pass file
      const passBuffer = await pass.generate();

      return new Response(passBuffer, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.apple.pkpass',
          'Content-Disposition': `attachment; filename="${passData.cardName}.pkpass"`
        }
      });
    } else if (passType === 'google') {
      // Existing Google Wallet logic
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

      const jwt = jose.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });
      
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