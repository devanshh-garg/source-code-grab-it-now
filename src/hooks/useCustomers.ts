
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useBusinessData } from './useBusinessData';

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone?: string | null;
  metadata?: any;
  created_at: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  metadata?: any;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  metadata?: any;
}

export const useCustomers = () => {
  const { business } = useBusinessData();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomers = async () => {
    if (!business?.id) {
      console.log('No business ID available, cannot fetch customers');
      setCustomers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching customers for business:', business.id);
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }

      console.log('Customers fetched successfully:', data);
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch customers'));
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerData) => {
    if (!business?.id) {
      throw new Error('No business ID available');
    }

    try {
      console.log('Creating customer:', customerData);
      
      const { data, error } = await supabase
        .from('customers')
        .insert({
          business_id: business.id,
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          metadata: customerData.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        throw error;
      }

      console.log('Customer created successfully:', data);
      
      // Update local state
      setCustomers(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Failed to create customer:', err);
      throw err instanceof Error ? err : new Error('Failed to create customer');
    }
  };

  const updateCustomer = async (customerId: string, updates: UpdateCustomerData) => {
    try {
      console.log('Updating customer:', customerId, updates);
      
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        throw error;
      }

      console.log('Customer updated successfully:', data);
      
      // Update local state
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? { ...customer, ...data } : customer
        )
      );
      
      return data;
    } catch (err) {
      console.error('Failed to update customer:', err);
      throw err instanceof Error ? err : new Error('Failed to update customer');
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      console.log('Deleting customer:', customerId);
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) {
        console.error('Error deleting customer:', error);
        throw error;
      }

      console.log('Customer deleted successfully');
      
      // Update local state
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      
      return true;
    } catch (err) {
      console.error('Failed to delete customer:', err);
      throw err instanceof Error ? err : new Error('Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [business?.id]);

  const mutate = () => {
    return fetchCustomers();
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    mutate
  };
};
