
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cardId, cardUrl } = await req.json()
    console.log('Generating QR code for cardId:', cardId, 'cardUrl:', cardUrl)
    
    // Generate QR code using QR service
    const url = cardUrl || `https://47d9b6bf-e151-426e-9a64-d6c41d6b6360.lovableproject.com/card/${cardId}`
    const qrCode = await generateQRCode(url)
    
    console.log('Generated QR code URL:', qrCode)
    
    return new Response(JSON.stringify({ qrCode }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate QR code' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateQRCode(url: string): Promise<string> {
  // Use QR code service URL - this is a reliable external service
  const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  console.log('Using QR service URL:', qrServiceUrl)
  return qrServiceUrl
}
