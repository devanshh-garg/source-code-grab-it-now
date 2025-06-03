
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  settings?: any;
  description?: string | null;
  website?: string | null;
  business_type?: string | null;
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
}

export const useBusinessData = () => {
  const { currentUser } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchBusiness();
    } else {
      setBusiness(null);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchBusiness = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', currentUser.id)
        .limit(1);

      if (error) {
        console.error('Error fetching business:', error);
        return;
      }

      if (data && data.length > 0) {
        const rawBusiness = data[0];
        // Type-cast the JSON fields to match our Business interface
        const business: Business = {
          ...rawBusiness,
          social_links: rawBusiness.social_links as Business['social_links'],
          theme_settings: rawBusiness.theme_settings as Business['theme_settings'],
        };
        setBusiness(business);
      } else {
        setBusiness(null);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  return { business, loading, refetch: fetchBusiness };
};
