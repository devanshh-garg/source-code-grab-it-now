
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { LoyaltyCard } from './useLoyaltyCards';

export const useWalletPasses = () => {
  const [loading, setLoading] = useState(false);

  const generateWalletPass = async (card: LoyaltyCard, passType: 'apple' | 'google') => {
    setLoading(true);
    try {
      if (passType === 'apple') {
        // Apple Wallet logic (leave as-is for now)
        const { data, error } = await supabase.functions.invoke('generate-wallet-pass', {
          body: {
            passData: {
              cardId: card.id,
              cardName: card.name,
              businessName: card.name,
              rewardTitle: card.rules?.rewardTitle || '',
              backgroundColor: card.design?.backgroundColor || '#3B82F6',
              logoUrl: card.design?.logoUrl,
              type: card.type,
              totalNeeded: card.rules?.totalNeeded || 10
            },
            passType
          }
        });
        if (error) throw error;
        const blob = new Blob([data], { type: 'application/vnd.apple.pkpass' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.name}.pkpass`;
        a.click();
        URL.revokeObjectURL(url);
        return data;
      } else {
        // Google Wallet logic: use direct fetch to deployed Edge Function
        const EDGE_FUNCTION_URL = 'https://jynzkzucubcmhmidsgki.functions.supabase.co/google-wallet-function';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bnprenVjdWJjbWhtaWRzZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTQ3NzAsImV4cCI6MjA2MzU5MDc3MH0.D4De3B6dBeAzr86Ym41_Z317jWSMpVHu4feaj87CrDk';
// Defensive: ensure all required fields are present before making the request
if (!card.id || !card.name || !card.type || !card.rules?.totalNeeded) {
  throw new Error("Missing required card fields for Google Wallet pass generation.");
}

const response = await fetch(EDGE_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    passData: {
      cardId: card.id,
      cardName: card.name,
      businessName: card.businessName || card.name,
      rewardTitle: card.rules?.rewardTitle || '',
      backgroundColor: card.design?.backgroundColor || '#3B82F6',
      logoUrl: card.design?.logoUrl,
      type: card.type,
      totalNeeded: card.rules?.totalNeeded || 10,
      classId: '338800000002295058.loyalty_class_1'
    },
    passType: 'google'
  })
});
        if (!response.ok) {
          let error = 'Edge Function error';
          try {
            const data = await response.json();
            if (data.error) {
              error = data.error;
              if (data.details) {
                error += ': ' + data.details;
              }
            }
          } catch {}
          throw new Error(error);
        }
        const { jwt } = await response.json();
        const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;
        window.open(saveUrl, '_blank');
        return jwt;
      }
    } catch (error: any) {
      console.error('Error generating wallet pass:', error, {
        card,
        passType,
      });
      let errorMessage = 'Failed to generate wallet pass.';
      if (error?.message) {
        errorMessage += `\n${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `\n${error}`;
      }
      alert(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (cardId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-qr-code', {
        body: { cardId }
      });
      if (error) throw error;
      return data.qrCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const getCardShareUrl = (cardId: string) => {
    return `${window.location.origin}/card/${cardId}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  return {
    generateWalletPass,
    generateQRCode,
    getCardShareUrl,
    copyToClipboard,
    loading
  };
};
