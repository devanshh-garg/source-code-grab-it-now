
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { LoyaltyCard } from './useLoyaltyCards';

export const useWalletPasses = () => {
  const [loading, setLoading] = useState(false);

  const generateWalletPass = async (card: LoyaltyCard, passType: 'apple' | 'google') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-wallet-pass', {
        body: {
          passData: {
            cardId: card.id,
            cardName: card.name,
            businessName: card.name, // Using card name as business name for now
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

      if (passType === 'apple') {
        // For Apple Wallet, we would download the .pkpass file
        const blob = new Blob([data], { type: 'application/vnd.apple.pkpass' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.name}.pkpass`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // For Google Wallet, we would redirect to the Google Wallet save URL
        const saveUrl = `https://pay.google.com/gp/v/save/${btoa(JSON.stringify(data))}`;
        window.open(saveUrl, '_blank');
      }

      return data;
    } catch (error) {
      console.error('Error generating wallet pass:', error);
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
