import * as jose from "npm:jsonwebtoken";

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

Deno.serve(async (req) => {
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

    if (passType === 'apple') {
      const applePass = await generateAppleWalletPass(passData);
      return new Response(applePass, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/vnd.apple.pkpass',
          'Content-Disposition': `attachment; filename="${passData.cardName}.pkpass"`
        }
      });
    } else if (passType === 'google') {
      // Google Wallet logic
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
      if (!serviceAccountJson) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY env var");
      const serviceAccount = JSON.parse(serviceAccountJson);

      const loyaltyObject = {
        id: `${serviceAccount.project_id}.${passData.cardId}`,
        classId: `${serviceAccount.project_id}.${passData.classId || "loyalty_class_generic"}`,
        state: "ACTIVE",
        loyaltyPoints: {
          balance: { string: "0" }
        },
        accountName: passData.businessName,
        accountId: passData.cardId,
        textModulesData: [
          {
            header: "Reward",
            body: passData.rewardTitle || ''
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
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid passType" }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
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
  return new Uint8Array();
}

import * as jose from "npm:jsonwebtoken";

async function generateGoogleWalletPass(passData: PassData) {
  // Read service account from env var
  const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!serviceAccountJson) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY env var");
  const serviceAccount = JSON.parse(serviceAccountJson);

  // Build the loyalty object
  const loyaltyObject = {
    id: `${serviceAccount.project_id}.${passData.cardId}`,
    classId: `${serviceAccount.project_id}.${passData.classId || "loyalty_class_generic"}`,
    state: "ACTIVE",
    loyaltyPoints: {
      balance: { string: "0" }
    },
    accountName: passData.businessName,
    accountId: passData.cardId,
    textModulesData: [
      {
        header: "Reward",
        body: passData.rewardTitle
      }
    ],
    barcode: {
      type: "QR_CODE",
      value: `loyalty:${passData.cardId}`
    }
  };

  // Build JWT payload
  const payload = {
    iss: serviceAccount.client_email,
    aud: "google",
    origins: ["*"],
    typ: "savetowallet",
    payload: {
      loyaltyObjects: [loyaltyObject]
    }
  };

  // Sign JWT
  const jwt = jose.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });
  return { jwt };
}

