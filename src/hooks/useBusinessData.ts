import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '../lib/database.types';

export const useBusinessData = () => {
  const supabase = useSupabaseClient<Database>();
  const [business, setBusiness] = useState<Database['public']['Tables']['businesses']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .single();

        if (error) throw error;
        setBusiness(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch business data'));
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [supabase]);

  return { business, loading, error };
};