
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PassData {
  cardId: string
  cardName: string
  businessName: string
  rewardTitle: string
  backgroundColor: string
  logoUrl?: string
  type: 'stamp' | 'points' | 'tier'
  totalNeeded: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { passData, passType } = await req.json() as { 
      passData: PassData, 
      passType: 'apple' | 'google' 
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Generate pass based on type
    if (passType === 'apple') {
      const applePass = await generateAppleWalletPass(passData)
      return new Response(applePass, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.apple.pkpass',
          'Content-Disposition': `attachment; filename="${passData.cardName}.pkpass"`
        }
      })
    } else {
      const googlePass = await generateGoogleWalletPass(passData)
      return new Response(JSON.stringify(googlePass), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }
  } catch (error) {
    console.error('Error generating wallet pass:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate wallet pass' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateAppleWalletPass(passData: PassData): Promise<Uint8Array> {
  // Simplified Apple Wallet pass structure
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: "pass.com.loyaltyapp.card",
    serialNumber: passData.cardId,
    teamIdentifier: "TEAM123456",
    organizationName: passData.businessName,
    description: passData.cardName,
    logoText: passData.businessName,
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: passData.backgroundColor,
    storeCard: {
      primaryFields: [
        {
          key: "balance",
          label: passData.type === 'stamp' ? "Stamps" : "Points",
          value: "0"
        }
      ],
      secondaryFields: [
        {
          key: "reward",
          label: "Reward",
          value: passData.rewardTitle
        }
      ],
      auxiliaryFields: [
        {
          key: "total",
          label: "Goal",
          value: passData.totalNeeded.toString()
        }
      ]
    },
    barcodes: [
      {
        message: `loyalty:${passData.cardId}`,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1"
      }
    ]
  }

  // For a real implementation, you would need to:
  // 1. Create the pass.json file
  // 2. Add images (logo, icon, etc.)
  // 3. Create a manifest.json with file hashes
  // 4. Sign with Apple certificates
  // 5. Create a .pkpass zip file

  // This is a simplified version that returns the JSON structure
  const encoder = new TextEncoder()
  return encoder.encode(JSON.stringify(passJson, null, 2))
}

async function generateGoogleWalletPass(passData: PassData) {
  // Google Wallet pass structure
  return {
    iss: "loyalty-app@example.com",
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    payload: {
      loyaltyObjects: [
        {
          id: `loyalty_object_${passData.cardId}`,
          classId: "loyalty_class_generic",
          state: "ACTIVE",
          loyaltyPoints: {
            balance: {
              string: "0"
            }
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
        }
      ]
    }
  }
}
