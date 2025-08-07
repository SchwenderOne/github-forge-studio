import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  last_watered_date?: string;
  next_watering_date?: string;
  last_watered_by?: string;
  watering_frequency_days: number;
  household_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  image_url?: string;
}

export interface AddPlantData {
  name: string;
  species?: string;
  location?: string;
  watering_frequency_days?: number;
  notes?: string;
}

export const usePlants = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants', profile?.household_id],
    queryFn: async () => {
      if (!profile?.household_id) return [];
      
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Plant[];
    },
    enabled: !!profile?.household_id,
  });

  const addPlantMutation = useMutation({
    mutationFn: async (plantData: AddPlantData) => {
      if (!user?.id || !profile?.household_id) {
        throw new Error('User not authenticated or no household');
      }

      const { data, error } = await supabase
        .from('plants')
        .insert({
          name: plantData.name,
          species: plantData.species,
          location: plantData.location,
          watering_frequency_days: plantData.watering_frequency_days || 7,
          notes: plantData.notes,
          household_id: profile.household_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast.success('Plant added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add plant: ' + error.message);
    },
  });

  const waterPlantMutation = useMutation({
    mutationFn: async (plantId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const plant = plants.find(p => p.id === plantId);
      if (!plant) throw new Error('Plant not found');

      const today = new Date().toISOString().split('T')[0];
      const nextWateringDate = new Date();
      nextWateringDate.setDate(nextWateringDate.getDate() + plant.watering_frequency_days);

      const { data, error } = await supabase
        .from('plants')
        .update({
          last_watered_date: today,
          next_watering_date: nextWateringDate.toISOString().split('T')[0],
          last_watered_by: user.id,
        })
        .eq('id', plantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast.success('Plant watered successfully');
    },
    onError: (error) => {
      toast.error('Failed to water plant: ' + error.message);
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: async (plantId: string) => {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', plantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast.success('Plant deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete plant: ' + error.message);
    },
  });

  // Calculate plant status based on watering schedule
  const plantsWithStatus = plants.map(plant => {
    if (!plant.next_watering_date) {
      return { ...plant, status: 'needs-water' as const };
    }

    const today = new Date();
    const nextWatering = new Date(plant.next_watering_date);
    const daysDiff = Math.ceil((nextWatering.getTime() - today.getTime()) / (1000 * 3600 * 24));

    let status: 'healthy' | 'needs-water' | 'overdue';
    if (daysDiff < 0) {
      status = 'overdue';
    } else if (daysDiff <= 1) {
      status = 'needs-water';
    } else {
      status = 'healthy';
    }

    return { ...plant, status };
  });

  const plantsNeedingWater = plantsWithStatus.filter(plant => 
    plant.status === 'overdue' || plant.status === 'needs-water'
  );

  return {
    plants: plantsWithStatus,
    plantsNeedingWater,
    isLoading,
    addPlant: addPlantMutation.mutate,
    waterPlant: waterPlantMutation.mutate,
    deletePlant: deletePlantMutation.mutate,
    isAddingPlant: addPlantMutation.isPending,
    isWateringPlant: waterPlantMutation.isPending,
    isDeletingPlant: deletePlantMutation.isPending,
  };
};