import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface ShoppingItem {
  id: string;
  name: string;
  assigned_to?: string;
  completed: boolean;
  cost?: number;
  household_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  split_with?: string;
}

export interface AddShoppingItemData {
  name: string;
  assigned_to?: string;
  cost?: number;
  split_with?: string;
}

export const useShopping = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shopping_items', profile?.household_id],
    queryFn: async () => {
      if (!profile?.household_id) return [];
      
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('completed', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShoppingItem[];
    },
    enabled: !!profile?.household_id,
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData: AddShoppingItemData) => {
      if (!user?.id || !profile?.household_id) {
        throw new Error('User not authenticated or no household');
      }

      const { data, error } = await supabase
        .from('shopping_items')
        .insert({
          name: itemData.name,
          assigned_to: itemData.assigned_to,
          cost: itemData.cost,
          split_with: itemData.split_with,
          household_id: profile.household_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping_items'] });
      toast.success('Item added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add item: ' + error.message);
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('Item not found');

      const { data, error } = await supabase
        .from('shopping_items')
        .update({ completed: !item.completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping_items'] });
    },
    onError: (error) => {
      toast.error('Failed to update item: ' + error.message);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping_items'] });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete item: ' + error.message);
    },
  });

  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);

  return {
    items,
    isLoading,
    addItem: addItemMutation.mutate,
    toggleItem: toggleItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    totalCost,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: toggleItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
};