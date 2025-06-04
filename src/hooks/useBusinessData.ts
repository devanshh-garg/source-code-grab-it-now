
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

export interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  business_type?: string | null;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
  business_hours?: any;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  } | null;
  theme_settings?: {
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    logo_position?: string;
  } | null;
  owner_id: string;
  qr_code_url?: string | null;
  stripe_account_id?: string | null;
  subscription_status?: string | null;
}

export const useBusinessData = () => {
  const supabase = useSupabaseClient<Database>();
  const { currentUser } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBusinessData = async () => {
    if (!currentUser) {
      console.log('No authenticated user, cannot fetch business data');
      setBusiness(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching business data for user:', currentUser.id);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No business found for user');
          setBusiness(null);
        } else {
          console.error('Error fetching business:', error);
          throw error;
        }
        return;
      }
      
      console.log('Business data fetched:', data);
      
      // Transform the database row to our Business interface
      const transformedData: Business = {
        ...data,
        owner_id: data.user_id,
        social_links: data.social_links as Business['social_links'],
        theme_settings: data.theme_settings as Business['theme_settings'],
        business_hours: data.business_hours,
      };
      
      setBusiness(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch business data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [currentUser, supabase]);

  const mutate = () => {
    return fetchBusinessData();
  };

  return { business, loading, error, mutate };
};
