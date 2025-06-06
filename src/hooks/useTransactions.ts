import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useBusinessData } from './useBusinessData';

export interface Transaction {
  id: string;
  customer_card_id: string;
  type: string;
  points: number;
  stamps: number;
  metadata: any;
  created_at: string;
}

export interface CreateTransactionData {
  customer_card_id: string;
  type: string;
  points?: number;
  stamps?: number;
  metadata?: any;
}

export const useTransactions = () => {
  const { business } = useBusinessData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async (customerLoyaltyCardId?: string) => {
    try {
      setLoading(true);
      console.log('Fetching transactions:', { customerLoyaltyCardId });
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (customerLoyaltyCardId) {
        query = query.eq('customer_card_id', customerLoyaltyCardId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Transactions fetched successfully:', data);
      setTransactions(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsByCustomerId = async (customerId: string) => {
    if (!business?.id) {
      console.log('No business ID available, cannot fetch transactions');
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching transactions for customer:', customerId);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer_loyalty_cards!inner (
            customer_profile_id,
            loyalty_cards!inner (
              business_id
            )
          )
        `)
        .eq('customer_loyalty_cards.customer_profile_id', customerId)
        .eq('customer_loyalty_cards.loyalty_cards.business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Transactions fetched successfully:', data);
      setTransactions(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: CreateTransactionData) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        customer_card_id: transaction.customer_card_id,
        type: transaction.type,
        points: transaction.points ?? 0,
        stamps: transaction.stamps ?? 0,
        metadata: transaction.metadata ?? {},
      });
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    return data;
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchTransactionsByCustomerId,
    createTransaction
  };
};
