import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'settlement';
  amount: number;
  description: string;
  date: string;
  paid_by: string;
  split_with?: string | null;
  household_id: string;
  created_at: string;
}

export const useFinances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useProfile();

  const fetchTransactions = async () => {
    if (!user || !profile?.household_id) return;

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('household_id', profile.household_id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedTransactions = (data || []).map(row => ({
        ...row,
        type: row.type as 'expense' | 'income' | 'settlement'
      }));
      
      setTransactions(typedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'household_id'>) => {
    if (!user || !profile?.household_id) return;

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transaction,
          household_id: profile.household_id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the new transaction
      const typedTransaction = {
        ...data,
        type: data.type as 'expense' | 'income' | 'settlement'
      };
      
      setTransactions(prev => [typedTransaction, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error };
    }
  };

  const calculateBalances = () => {
    if (!user || !profile?.household_id) return { yourBalance: 0, roommateBalance: 0 };

    let yourBalance = 0;
    let roommateBalance = 0;

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'settlement') {
        if (transaction.paid_by === user.id) {
          yourBalance -= amount;
          roommateBalance += amount;
        } else {
          yourBalance += amount;
          roommateBalance -= amount;
        }
      } else {
        // Regular expense
        if (transaction.split_with === 'both') {
          // Split expense
          const halfAmount = amount / 2;
          if (transaction.paid_by === user.id) {
            // You paid, roommate owes you half
            roommateBalance += halfAmount;
          } else {
            // Roommate paid, you owe them half
            yourBalance += halfAmount;
          }
        } else if (transaction.split_with === user.id) {
          // Personal expense you paid
          // No balance change
        } else {
          // Personal expense roommate paid or expense for roommate
          if (transaction.paid_by === user.id) {
            // You paid for roommate
            roommateBalance += amount;
          }
        }
      }
    });

    return { yourBalance, roommateBalance: -yourBalance };
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, profile?.household_id]);

  return {
    transactions,
    loading,
    addTransaction,
    calculateBalances,
    refetch: fetchTransactions
  };
};