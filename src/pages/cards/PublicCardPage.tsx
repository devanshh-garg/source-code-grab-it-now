
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Download, Smartphone } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useWalletPasses } from '../../hooks/useWalletPasses';
import type { LoyaltyCard } from '../../hooks/useLoyaltyCards';

const PublicCardPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const { generateWalletPass, loading: passLoading } = useWalletPasses();

  useEffect(() => {
    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const fetchCard = async () => {
    if (!cardId) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('id', cardId)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        return;
      }

      setCard({
        id: data.id,
        name: data.name,
        type: data.type as 'stamp' | 'points' | 'tier',
        design: data.design as { backgroundColor?: string; logoUrl?: string },
        rules: data.rules as { rewardTitle?: string; totalNeeded?: number },
        active: data.active,
        created_at: data.created_at,
      });
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWallet = async (passType: 'apple' | 'google') => {
    if (!card) return;
    
    try {
      await generateWalletPass(card, passType);
    } catch (error) {
      alert('Failed to add to wallet. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading loyalty card...</div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Card Not Found</h2>
          <p className="text-gray-600">This loyalty card doesn't exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  const getCardColorClass = (backgroundColor?: string) => {
    if (backgroundColor) {
      return `bg-[${backgroundColor}]`;
    }
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loyalty Card</h1>
          <p className="text-gray-600">Add this card to your wallet</p>
        </div>

        {/* Card Preview */}
        <div className={`bg-gradient-to-r ${getCardColorClass(card.design?.backgroundColor)} rounded-lg p-6 text-white shadow-lg mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <CreditCard className="text-blue-600" size={16} />
              </div>
              <span className="font-bold">{card.name}</span>
            </div>
          </div>
          
          <div className="text-xs bg-white bg-opacity-20 py-1 px-2 rounded-full inline-block mb-4">
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
          </div>
          
          {card.type === 'stamp' && (
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-5 gap-1">
                {[...Array(Math.min(5, card.rules?.totalNeeded || 10))].map((_, i) => (
                  <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white" size={12} />
                  </div>
                ))}
              </div>
              {(card.rules?.totalNeeded || 10) > 5 && (
                <div className="grid grid-cols-5 gap-1">
                  {[...Array(Math.min(5, (card.rules?.totalNeeded || 10) - 5))].map((_, i) => (
                    <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                      <CreditCard className="text-white" size={12} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="text-center py-2 bg-white bg-opacity-20 rounded-md text-sm">
            {card.rules?.rewardTitle || 'Loyalty Reward'}
          </div>
        </div>

        {/* Wallet Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add to Wallet</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleAddToWallet('apple')}
              disabled={passLoading}
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Smartphone size={18} className="mr-2" />
              Add to Apple Wallet
            </button>
            <button
              onClick={() => handleAddToWallet('google')}
              disabled={passLoading}
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Download size={18} className="mr-2" />
              Add to Google Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCardPage;
