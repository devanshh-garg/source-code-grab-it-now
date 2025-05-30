
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useBusinessData } from './useBusinessData';

export interface LoyaltyCard {
  id: string;
  name: string;
  type: 'stamp' | 'points' | 'tier' | 'tiered' | 'discount';
  design: {
    backgroundColor?: string;
    logoUrl?: string;
  };
  rules: {
    rewardTitle?: string;
    totalNeeded?: number;
  };
  active: boolean;
  created_at: string;
}

export const useLoyaltyCards = () => {
  const { business } = useBusinessData();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business?.id) {
      fetchCards();
    } else {
      setCards([]);
      setLoading(false);
    }
  }, [business?.id]);

  const fetchCards = async () => {
    if (!business?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedCards: LoyaltyCard[] = (data || []).map(card => ({
        id: card.id,
        name: card.name,
        type: card.type as 'stamp' | 'points' | 'tier' | 'tiered' | 'discount',
        design: card.design as { backgroundColor?: string; logoUrl?: string },
        rules: card.rules as { rewardTitle?: string; totalNeeded?: number },
        active: card.active,
        created_at: card.created_at,
      }));

      setCards(transformedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: Omit<LoyaltyCard, 'id' | 'created_at'>) => {
    if (!business?.id) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .insert({
          business_id: business.id,
          name: cardData.name,
          type: cardData.type,
          design: cardData.design,
          rules: cardData.rules,
          active: cardData.active,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCards();
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('loyalty_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      await fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  return { cards, loading, createCard, deleteCard, refetch: fetchCards };
};
