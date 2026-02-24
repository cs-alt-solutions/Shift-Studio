/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useInventory } from './InventoryContext'; // <-- ADDED: Needed for material cost calculations

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. READ (The Historical Log)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Boot up the matrix on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 2. CREATE
  const addTransaction = async (transactionPayload) => {
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([transactionPayload])
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Optimistic UI update: instantly snap it to the top of our list
      setTransactions((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message);
      return null;
    }
  };

  // 3. UPDATE
  const updateTransaction = async (id, updates) => {
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Swap out the old record with the fresh database response
      setTransactions((prev) => 
        prev.map(tx => tx.id === id ? data : tx)
      );
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message);
      return null;
    }
  };

  // 4. DELETE
  const deleteTransaction = async (id) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTransactions((prev) => prev.filter(tx => tx.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
      return false;
    }
  };

  // The Visionary's Metrics Engine
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(tx => tx.type === 'INCOME' || tx.type === 'SALE')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
    // Expense amounts are often recorded negatively, so we take absolute value for total calculations
    const totalExpense = transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    const netProfit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netProfit };
  }, [transactions]);

  const value = {
    transactions,
    loading,
    error,
    metrics,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};


// --- NEWLY DEPLOYED HOOKS ---

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancialStats = () => {
  const { transactions, metrics, loading } = useFinancial();
  
  const totalRev = metrics.totalIncome || 0;
  const totalCost = metrics.totalExpense || 0;
  const margin = totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0;

  return {
    totalRev,
    totalCost,
    margin,
    transactions,
    netProfit: metrics.netProfit || 0,
    loading
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectEconomics = (project) => {
  const { materials } = useInventory();
  
  return useMemo(() => {
    let materialCost = 0;
    
    // Calculate accurate material costs based on live inventory pricing
    if (project?.recipe && project.recipe.length > 0) {
      project.recipe.forEach(item => {
        const mat = materials.find(m => m.id === item.matId);
        if (mat) {
          materialCost += (mat.costPerUnit * item.reqPerUnit);
        }
      });
    }

    const retailPrice = parseFloat(project?.retailPrice) || 0;
    const platformFeePercent = project?.economics?.platformFeePercent || 6.5;
    const platformFixedFee = project?.economics?.platformFixedFee || 0.20;

    const platformFees = retailPrice > 0 ? (retailPrice * (platformFeePercent / 100)) + platformFixedFee : 0;
    const netProfit = retailPrice - materialCost - platformFees;
    const marginPercent = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0;

    return { materialCost, platformFees, netProfit, marginPercent };
  }, [project, materials]);
};