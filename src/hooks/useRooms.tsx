import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface Room {
  id: string;
  name: string;
  last_cleaned_date?: string;
  last_cleaned_by?: string;
  next_assigned_to?: string;
  cleaning_frequency_days: number;
  household_id: string;
  created_at: string;
}

export interface AddRoomData {
  name: string;
  cleaning_frequency_days?: number;
}

export const useRooms = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms', profile?.household_id],
    queryFn: async () => {
      if (!profile?.household_id) return [];
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Room[];
    },
    enabled: !!profile?.household_id,
  });

  const addRoomMutation = useMutation({
    mutationFn: async (roomData: AddRoomData) => {
      if (!user?.id || !profile?.household_id) {
        throw new Error('User not authenticated or no household');
      }

      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomData.name,
          cleaning_frequency_days: roomData.cleaning_frequency_days || 7,
          household_id: profile.household_id,
          next_assigned_to: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add room: ' + error.message);
    },
  });

  const markCleanedMutation = useMutation({
    mutationFn: async (roomId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const room = rooms.find(r => r.id === roomId);
      if (!room) throw new Error('Room not found');

      const today = new Date().toISOString().split('T')[0];
      
      // Get all household members to alternate assignment
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('household_id', profile?.household_id);

      if (profilesError) throw profilesError;

      const householdMembers = profiles?.map(p => p.user_id) || [];
      const currentIndex = householdMembers.indexOf(user.id);
      const nextIndex = (currentIndex + 1) % householdMembers.length;
      const nextAssignedTo = householdMembers[nextIndex];

      const { data, error } = await supabase
        .from('rooms')
        .update({
          last_cleaned_date: today,
          last_cleaned_by: user.id,
          next_assigned_to: nextAssignedTo,
        })
        .eq('id', roomId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room marked as cleaned');
    },
    onError: (error) => {
      toast.error('Failed to mark room as cleaned: ' + error.message);
    },
  });

  // Calculate room status and priority
  const roomsWithStatus = rooms.map(room => {
    if (!room.last_cleaned_date) {
      return { ...room, priority: 'high' as const };
    }

    const today = new Date();
    const lastCleaned = new Date(room.last_cleaned_date);
    const daysSinceCleaned = Math.ceil((today.getTime() - lastCleaned.getTime()) / (1000 * 3600 * 24));

    let priority: 'low' | 'medium' | 'high' | 'overdue';
    if (daysSinceCleaned > room.cleaning_frequency_days + 2) {
      priority = 'overdue';
    } else if (daysSinceCleaned > room.cleaning_frequency_days) {
      priority = 'high';
    } else if (daysSinceCleaned > room.cleaning_frequency_days - 2) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    return { ...room, priority };
  });

  const todaysTasks = roomsWithStatus.filter(room => 
    room.priority === 'overdue' || room.priority === 'high'
  );

  return {
    rooms: roomsWithStatus,
    todaysTasks,
    isLoading,
    addRoom: addRoomMutation.mutate,
    markCleaned: markCleanedMutation.mutate,
    isAddingRoom: addRoomMutation.isPending,
    isMarkingCleaned: markCleanedMutation.isPending,
  };
};