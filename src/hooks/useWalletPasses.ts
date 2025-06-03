import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { LoyaltyCard } from './useLoyaltyCards';

export const useWalletPasses = () => {
  const [loading, setLoading] = useState(false);

  const generateWalletPass = async (card: LoyaltyCard, passType: 'apple' | 'google') => {
    setLoading(true);
    try {
      console.log('Generating wallet pass for card:', card);
      console.log('Pass type:', passType);

      // Validate required card data
      if (!card.id || !card.name) {
        throw new Error("Card is missing required fields (id, name)");
      }

      const passData = {
        cardId: card.id,
        cardName: card.name,
        businessName: card.name, // Use card name as business name since we don't have a separate business name field
        rewardTitle: card.rules?.rewardTitle || 'Loyalty Reward',
        backgroundColor: card.design?.backgroundColor || '#3B82F6',
        logoUrl: card.design?.logoUrl || null,
        type: card.type,
        totalNeeded: card.rules?.totalNeeded || 10,
        classId: 'loyalty_class_1' // Fixed class ID for now
      };

      console.log('Sending pass data:', passData);

      const { data, error } = await supabase.functions.invoke('generate-wallet-pass', {
        body: {
          passData,
          passType
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate wallet pass');
      }

      // Handle unsupported feature response
      if (data?.error && data.type === 'unsupported_feature') {
        throw new Error(data.error);
      }

      if (passType === 'apple') {
        // Apple Wallet logic - currently unsupported
        throw new Error('Apple Wallet pass generation is temporarily unavailable. Please try Google Wallet instead.');
      } else {
        // Google Wallet logic - open URL
        if (!data || !data.jwt) {
          throw new Error('No JWT received from server');
        }

        console.log('Received JWT, opening Google Wallet...');
        const saveUrl = `https://pay.google.com/gp/v/save/${data.jwt}`;
        window.open(saveUrl, '_blank');
        return data.jwt;
      }
    } catch (error: any) {
      console.error('Error generating wallet pass:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Failed to generate wallet pass';
      if (error?.message) {
        if (error.message.includes('Google service account not configured')) {
          errorMessage = 'Google Wallet integration is not configured. Please contact support.';
        } else if (error.message.includes('Invalid Google service account')) {
          errorMessage = 'Google Wallet configuration error. Please contact support.';
        } else if (error.message.includes('JWT generation failed')) {
          errorMessage = 'Error creating wallet pass. Please try again.';
        } else {
          errorMessage = error.message;
        }
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