import { useState, useEffect, useCallback } from 'react';
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
  const { business, loading: businessLoading } = useBusinessData();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
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
        throw error;
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
  }, [business?.id]);

  useEffect(() => {
    // Don't fetch if business is still loading
    if (businessLoading) {
      return;
    }

    if (business?.id) {
      console.log('Business ID found, fetching cards for business:', business.id);
      fetchCards();
    } else {
      console.log('No business ID found, clearing cards');
      setCards([]);
      setLoading(false);
    }
  }, [business?.id, businessLoading, fetchCards]);

  const createCard = useCallback(async (cardData: Omit<LoyaltyCard, 'id' | 'created_at'>) => {
    if (!business?.id) {
      console.error('No business ID available for card creation');
      throw new Error('No business found. Please refresh the page and try again.');
    }

    try {
      console.log('Creating loyalty card with data:', cardData);
      console.log('Business ID:', business.id);
      
      const insertData = {
        business_id: business.id,
        name: cardData.name,
        type: cardData.type,
        design: cardData.design || {},
        rules: cardData.rules || {},
        active: cardData.active,
      };

      console.log('Insert data:', insertData);
      
      const { data, error } = await supabase
        .from('loyalty_cards')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating card:', error);
        throw new Error(`Failed to create card: ${error.message}`);
      }

      console.log('Card created successfully:', data);
      await fetchCards(); // Refresh the cards list
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }, [business?.id, fetchCards]);

  const deleteCard = useCallback(async (cardId: string) => {
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
  }, [fetchCards]);

  // Fetch a single card by ID
  const getCardById = useCallback(async (cardId: string): Promise<LoyaltyCard | null> => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('id', cardId)
        .single();
      if (error) throw error;
      if (!data) return null;
      // Transform to LoyaltyCard type
      return {
        id: data.id,
        name: data.name,
        type: data.type as 'stamp' | 'points' | 'tier' | 'tiered' | 'discount',
        design: data.design as { backgroundColor?: string; logoUrl?: string },
        rules: data.rules as { rewardTitle?: string; totalNeeded?: number },
        active: data.active,
        created_at: data.created_at,
      };
    } catch (err) {
      console.error('Failed to fetch card by ID:', err);
      return null;
    }
  }, []);

  // Update a card by ID
  const updateCard = useCallback(async (cardId: string, cardData: Partial<LoyaltyCard>) => {
    try {
      const { error } = await supabase
        .from('loyalty_cards')
        .update({
          name: cardData.name,
          type: cardData.type,
          design: cardData.design,
          rules: cardData.rules,
          active: cardData.active,
        })
        .eq('id', cardId);
      if (error) throw error;
      await fetchCards();
      return true;
    } catch (err) {
      console.error('Failed to update card:', err);
      throw err;
    }
  }, [fetchCards]);

  return {
    cards,
    loading: loading || businessLoading,
    createCard,
    deleteCard,
    getCardById,
    updateCard,
    refetch: fetchCards
  };
};