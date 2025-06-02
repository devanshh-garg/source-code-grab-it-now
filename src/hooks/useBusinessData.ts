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

      setBusiness(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  return { business, loading, refetch: fetchBusiness };
};