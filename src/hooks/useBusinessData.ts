
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

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
  const { currentUser } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createDefaultBusiness = async () => {
    if (!currentUser) return null;

    try {
      console.log('Creating default business for user:', currentUser.id);
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          user_id: currentUser.id,
          name: 'My Business',
          email: currentUser.email || '',
          business_type: 'retail',
          description: 'Default business profile'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default business:', error);
        throw error;
      }

      console.log('Default business created:', data);
      return data;
    } catch (err) {
      console.error('Failed to create default business:', err);
      throw err;
    }
  };

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
        .maybeSingle();

      if (error) {
        console.error('Error fetching business:', error);
        throw error;
      }

      let businessData = data;
      
      // If no business exists, create a default one
      if (!businessData) {
        console.log('No business found, creating default business');
        businessData = await createDefaultBusiness();
      }
      
      if (businessData) {
        console.log('Business data found:', businessData);
        
        // Transform the database row to our Business interface
        const transformedData: Business = {
          ...businessData,
          owner_id: businessData.user_id,
          updated_at: businessData.created_at, // Use created_at as fallback for updated_at
          social_links: businessData.social_links as Business['social_links'],
          theme_settings: businessData.theme_settings as Business['theme_settings'],
          business_hours: businessData.business_hours,
        };
        
        setBusiness(transformedData);
      }
    } catch (err) {
      console.error('Error in fetchBusinessData:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch business data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [currentUser]);

  const mutate = () => {
    return fetchBusinessData();
  };

  return { business, loading, error, mutate };
};
