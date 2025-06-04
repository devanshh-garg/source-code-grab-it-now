
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
      console.log('Business ID found, fetching cards for business:', business.id);
      fetchCards();
    } else {
      console.log('No business ID found, clearing cards');
      setCards([]);
      setLoading(false);
    }
  }, [business?.id]);

  const fetchCards = async () => {
    if (!business?.id) {
      console.log('No business ID available for fetching cards');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching loyalty cards for business:', business.id);
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        return;
      }

      console.log('Raw loyalty cards data from Supabase:', data);
      
      if (!data || data.length === 0) {
        console.log('No loyalty cards found for this business');
        setCards([]);
        setLoading(false);
        return;
      }

      // Transform the data to match our interface
      const transformedCards: LoyaltyCard[] = data.map(card => {
        console.log('Transforming card:', card);
        return {
          id: card.id,
          name: card.name,
          type: card.type as 'stamp' | 'points' | 'tier' | 'tiered' | 'discount',
          design: card.design as { backgroundColor?: string; logoUrl?: string },
          rules: card.rules as { rewardTitle?: string; totalNeeded?: number },
          active: card.active,
          created_at: card.created_at,
        };
      });

      console.log('Transformed loyalty cards:', transformedCards);
      setCards(transformedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: Omit<LoyaltyCard, 'id' | 'created_at'>) => {
    if (!business?.id) {
      console.error('No business ID available for card creation');
      return;
    }

    try {
      console.log('Creating loyalty card with data:', cardData);
      console.log('Business ID:', business.id);
      
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

      if (error) {
        console.error('Error creating card:', error);
        throw error;
      }

      console.log('Card created successfully:', data);
      await fetchCards(); // Refresh the cards list
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      console.log('Deleting card:', cardId);
      const { error } = await supabase
        .from('loyalty_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error deleting card:', error);
        throw error;
      }

      console.log('Card deleted successfully');
      await fetchCards(); // Refresh the cards list
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  return { cards, loading, createCard, deleteCard, refetch: fetchCards };
};
