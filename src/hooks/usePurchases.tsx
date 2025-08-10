import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

export interface Purchase {
  id: string;
  name: string;
  total_cost: number;
  user1_share: number;
  user2_share: number;
  needed_by?: string | null;
  status: 'planned' | 'ordered' | 'purchased' | 'cancelled';
  household_id: string;
  created_by: string;
  created_at: string;
}

export interface AddPurchaseData {
  name: string;
  total_cost: number;
  needed_by?: string;
}

export const usePurchases = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases', profile?.household_id],
    queryFn: async () => {
      if (!profile?.household_id) return [] as Purchase[];

      const { data, error } = await supabase
        .from('long_term_purchases')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Purchase[];
    },
    enabled: !!profile?.household_id,
  });

  const addPurchaseMutation = useMutation({
    mutationFn: async (payload: AddPurchaseData) => {
      if (!user?.id || !profile?.household_id) {
        throw new Error('User not authenticated or no household');
      }

      const user1_share = Number((payload.total_cost / 2).toFixed(2));
      const user2_share = Number((payload.total_cost - user1_share).toFixed(2));

      const { data, error } = await supabase
        .from('long_term_purchases')
        .insert({
          name: payload.name,
          total_cost: payload.total_cost,
          user1_share,
          user2_share,
          needed_by: payload.needed_by || null,
          household_id: profile.household_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Purchase added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add purchase: ' + error.message);
    },
  });

  return {
    purchases,
    isLoading,
    addPurchase: addPurchaseMutation.mutate,
    isAddingPurchase: addPurchaseMutation.isPending,
  };
};
