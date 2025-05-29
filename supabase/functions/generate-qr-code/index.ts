
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/qrcode_generator@v1.8.0/mod.ts"

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
    
    // Generate QR code using a simple QR library
    const qrCode = await generateQRCode(cardUrl || `https://47d9b6bf-e151-426e-9a64-d6c41d6b6360.lovableproject.com/card/${cardId}`)
    
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
  // Simple QR code generation - in a real implementation, you'd use a proper QR library
  // For now, we'll use a QR code service URL
  const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  return qrServiceUrl
}
