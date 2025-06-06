
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useBusinessData } from './useBusinessData';

export interface CustomerLoyaltyCard {
  id: string;
  customer_profile_id: string;
  loyalty_card_id: string;
  points: number;
  stamps: number;
  tier: string | null;
  joined_at: string;
  last_activity: string;
  // Joined data from loyalty_cards table
  loyalty_card_name?: string;
}

export interface CreateCustomerLoyaltyCardData {
  customer_profile_id: string;
  loyalty_card_id: string;
  points?: number;
  stamps?: number;
  tier?: string;
}

export interface UpdateCustomerLoyaltyCardData {
  points?: number;
  stamps?: number;
  tier?: string;
  last_activity?: string;
}

export const useCustomerLoyaltyCards = () => {
  const { business } = useBusinessData();
  const [customerLoyaltyCards, setCustomerLoyaltyCards] = useState<CustomerLoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomerLoyaltyCards = async (customerId?: string) => {
    if (!business?.id) {
      console.log('No business ID available, cannot fetch customer loyalty cards');
      setCustomerLoyaltyCards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching customer loyalty cards for business:', business.id);
      
      let query = supabase
        .from('customer_loyalty_cards')
        .select(`
          *,
          loyalty_cards!inner(
            id,
            name,
            business_id
          )
        `)
        .eq('loyalty_cards.business_id', business.id);

      if (customerId) {
        query = query.eq('customer_profile_id', customerId);
      }

      const { data, error } = await query.order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching customer loyalty cards:', error);
        throw error;
      }

      console.log('Customer loyalty cards fetched successfully:', data);
      
      const transformedData = data?.map(item => ({
        id: item.id,
        customer_profile_id: item.customer_profile_id,
        loyalty_card_id: item.loyalty_card_id,
        points: item.points,
        stamps: item.stamps,
        tier: item.tier,
        joined_at: item.joined_at,
        last_activity: item.last_activity,
        loyalty_card_name: item.loyalty_cards?.name
      })) || [];

      setCustomerLoyaltyCards(transformedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch customer loyalty cards:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch customer loyalty cards'));
    } finally {
      setLoading(false);
    }
  };

  const createCustomerLoyaltyCard = async (cardData: CreateCustomerLoyaltyCardData) => {
    try {
      console.log('Creating customer loyalty card:', cardData);
      
      const { data, error } = await supabase
        .from('customer_loyalty_cards')
        .insert({
          customer_profile_id: cardData.customer_profile_id,
          loyalty_card_id: cardData.loyalty_card_id,
          points: cardData.points || 0,
          stamps: cardData.stamps || 0,
          tier: cardData.tier || 'bronze'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating customer loyalty card:', error);
        throw error;
      }

      console.log('Customer loyalty card created successfully:', data);
      
      // Update local state
      await fetchCustomerLoyaltyCards();
      
      return data;
    } catch (err) {
      console.error('Failed to create customer loyalty card:', err);
      throw err instanceof Error ? err : new Error('Failed to create customer loyalty card');
    }
  };

  const updateCustomerLoyaltyCard = async (cardId: string, updates: UpdateCustomerLoyaltyCardData) => {
    try {
      console.log('Updating customer loyalty card:', cardId, updates);
      
      const { data, error } = await supabase
        .from('customer_loyalty_cards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer loyalty card:', error);
        throw error;
      }

      console.log('Customer loyalty card updated successfully:', data);
      
      // Update local state
      setCustomerLoyaltyCards(prev => 
        prev.map(card => 
          card.id === cardId ? { ...card, ...data } : card
        )
      );
      
      return data;
    } catch (err) {
      console.error('Failed to update customer loyalty card:', err);
      throw err instanceof Error ? err : new Error('Failed to update customer loyalty card');
    }
  };

  const getCustomerLoyaltyCardsByCustomerId = (customerId: string) => {
    return customerLoyaltyCards.filter(card => card.customer_profile_id === customerId);
  };

  useEffect(() => {
    fetchCustomerLoyaltyCards();
  }, [business?.id]);

  const mutate = () => {
    return fetchCustomerLoyaltyCards();
  };

  return {
    customerLoyaltyCards,
    loading,
    error,
    fetchCustomerLoyaltyCards,
    createCustomerLoyaltyCard,
    updateCustomerLoyaltyCard,
    getCustomerLoyaltyCardsByCustomerId,
    mutate
  };
};
