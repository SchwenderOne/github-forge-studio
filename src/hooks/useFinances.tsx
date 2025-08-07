import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'settlement';
  amount: number;
  description: string;
  date: string;
  paid_by: string;
  split_with?: string;
  household_id: string;
  created_at: string;
}

export interface AddTransactionData {
  type: 'expense' | 'income' | 'settlement';
  amount: number;
  description: string;
  split_with?: string;
}

export const useFinances = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', profile?.household_id],
    queryFn: async () => {
      if (!profile?.household_id) return [];
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!profile?.household_id,
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (transactionData: AddTransactionData) => {
      if (!user?.id || !profile?.household_id) {
        throw new Error('User not authenticated or no household');
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description,
          paid_by: user.id,
          split_with: transactionData.split_with,
          household_id: profile.household_id,
          date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add transaction: ' + error.message);
    },
  });

  const calculateBalance = () => {
    if (!user?.id || !transactions) return { userBalance: 0, roommateBalance: 0 };

    let userBalance = 0;
    
    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'expense') {
        if (transaction.paid_by === user.id) {
          // User paid
          if (transaction.split_with === 'both') {
            userBalance -= amount / 2; // User owes half
          } else if (transaction.split_with === user.id) {
            userBalance -= amount; // User owes all
          }
          // If split_with is someone else, user paid for them (they owe user)
        } else {
          // Someone else paid
          if (transaction.split_with === 'both') {
            userBalance += amount / 2; // User owes them half
          } else if (transaction.split_with === user.id) {
            userBalance += amount; // User owes them all
          }
        }
      } else if (transaction.type === 'settlement') {
        if (transaction.paid_by === user.id) {
          userBalance -= amount; // User paid settlement
        } else {
          userBalance += amount; // User received settlement
        }
      } else if (transaction.type === 'income') {
        if (transaction.paid_by === user.id) {
          userBalance += amount;
        }
      }
    });

    return {
      userBalance: -userBalance, // Negative because we're tracking what user is owed
      roommateBalance: userBalance
    };
  };

  const { userBalance, roommateBalance } = calculateBalance();

  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             t.type === 'expense';
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    transactions,
    isLoading,
    addTransaction: addTransactionMutation.mutate,
    isAddingTransaction: addTransactionMutation.isPending,
    userBalance,
    roommateBalance,
    monthlyExpenses,
  };
};