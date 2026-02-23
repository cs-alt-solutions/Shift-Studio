import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [draftProjects, setDraftProjects] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchStudioData = useCallback(async () => {
    setLoading(true); 
    
    try {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .order('name', { ascending: true });

      if (invError) throw invError;
      setMaterials(invData || []);

      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*');

      if (projError) throw projError;

      const allProjects = projData || [];
      
      setActiveProjects(allProjects.filter(p => p.status === 'In Progress' || p.status === 'Completed'));
      setDraftProjects(allProjects.filter(p => p.status === 'Planning' || p.status === 'Draft' || !p.status));

    } catch (error) {
      console.error("Supabase Error fetching studio telemetry:", error);
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchStudioData();
  }, [fetchStudioData]);

  const addInventoryItem = async (newItem) => {
    const { data, error } = await supabase
      .from('inventory')
      .insert([newItem])
      .select();
      
    if (error) {
      console.error("Supabase Error adding item:", error);
      return null;
    } else if (data) {
      setMaterials(prev => [...prev, data[0]]);
      return data[0];
    }
  };

  const updateInventoryItem = async (id, updates) => {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase Error updating item:", error);
    } else if (data) {
      setMaterials(prev => prev.map(item => item.id === id ? data[0] : item));
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      materials,          
      activeProjects,     
      draftProjects,      
      loading, 
      fetchStudioData,    
      addInventoryItem, 
      updateInventoryItem 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);