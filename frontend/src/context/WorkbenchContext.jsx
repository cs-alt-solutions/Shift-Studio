import React, { createContext, useContext, useState } from 'react'; // FIXED: Removed unused useEffect
import { MOCK_PROJECTS } from '../data/mockData';

// --- INITIAL CONSOLIDATED DATA ---
const INITIAL_MATERIALS = [
  { id: 101, name: 'Soy Wax', brand: 'Golden Brands 464', category: 'Raw Material', qty: 45, unit: 'lbs', costPerUnit: 3.50, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-09', history: [] },
  { id: 102, name: 'Glass Jars', brand: '8oz Amber', category: 'Packaging', qty: 120, unit: 'count', costPerUnit: 1.10, status: 'Active', usageType: 'Project Component', lastUsed: '2025-11-15', history: [] },
  { id: 103, name: 'Walnut Stain', brand: 'Minwax Dark', category: 'Consumables', qty: 0.5, unit: 'gal', costPerUnit: 24.00, status: 'Dormant', usageType: 'Project Component', lastUsed: '2025-09-01', history: [] },
  { id: 104, name: 'Brass Rods', brand: '1/4 Inch Solid', category: 'Hardware', qty: 0, unit: 'ft', costPerUnit: 6.00, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-05', history: [] },
  { id: 105, name: 'Cotton Wicks', brand: 'CD-12', category: 'Hardware', qty: 500, unit: 'count', costPerUnit: 0.05, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-01', history: [] },
  { id: 106, name: 'Fragrance Oil', brand: 'Santal & Coconut', category: 'Raw Material', qty: 32, unit: 'oz', costPerUnit: 2.20, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-10', history: [] },
];

const WorkbenchContext = createContext();

export const WorkbenchProvider = ({ children }) => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [transactions, setTransactions] = useState([]);

  // --- ACTIONS: PROJECTS ---
  const addProject = (title) => {
    const newProj = {
      id: crypto.randomUUID(),
      title,
      status: 'active',
      demand: 'Unknown',
      competition: 'Unknown',
      created_at: new Date().toISOString(),
      missions: [],
      tags: []
    };
    setProjects([newProj, ...projects]);
  };

  const updateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // --- ACTIONS: INVENTORY ---
  const addAsset = (asset) => {
    setMaterials(prev => [asset, ...prev]);
  };

  const updateAsset = (id, updates) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const restockAsset = (id, addedQty, totalCost) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const newTotalQty = (parseFloat(m.qty) || 0) + parseFloat(addedQty);
        // Calculate new weighted average cost
        const oldTotalValue = (parseFloat(m.qty) || 0) * m.costPerUnit;
        const newTotalValue = oldTotalValue + parseFloat(totalCost);
        const newUnitCost = newTotalQty > 0 ? newTotalValue / newTotalQty : m.costPerUnit;
        
        // Add history entry
        const historyEntry = { date: new Date().toISOString().split('T')[0], qty: addedQty, unitCost: (totalCost/addedQty) };
        
        return { ...m, qty: newTotalQty, costPerUnit: newUnitCost, lastUsed: new Date().toISOString().split('T')[0], history: [historyEntry, ...(m.history || [])] };
      }
      return m;
    }));
  };

  // --- ACTIONS: WORKSHOP (THE BRIDGE) ---
  const manufactureProduct = (projectId, recipe) => {
    let sufficientStock = true;
    
    // 1. Check Stock
    recipe.forEach(item => {
      const mat = materials.find(m => m.id === parseInt(item.matId));
      if (!mat || mat.qty < item.reqPerUnit) sufficientStock = false;
    });

    if (!sufficientStock) return { success: false, message: 'Insufficient Inventory' };

    // 2. Deduct Stock
    let productionCost = 0;
    const today = new Date().toISOString().split('T')[0];

    setMaterials(prev => prev.map(m => {
      const ingredient = recipe.find(r => r.matId === m.id);
      if (ingredient) {
        productionCost += (ingredient.reqPerUnit * m.costPerUnit);
        return { ...m, qty: m.qty - ingredient.reqPerUnit, lastUsed: today };
      }
      return m;
    }));

    // 3. Update Project Status
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));

    // 4. Log Transaction (Internal Cost)
    const projectTitle = projects.find(p => p.id === projectId)?.title || 'Unknown Project';
    setTransactions(prev => [{
      id: Date.now(),
      date: today,
      item: `Built: ${projectTitle}`,
      type: 'PRODUCTION',
      amount: -productionCost,
      status: 'INTERNAL'
    }, ...prev]);

    return { success: true, message: 'Unit Built & Stock Deducted' };
  };

  return (
    <WorkbenchContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      materials, addAsset, updateAsset, restockAsset,
      transactions,
      manufactureProduct
    }}>
      {children}
    </WorkbenchContext.Provider>
  );
};

// FIXED: Added eslint-disable to allow hook export in the same file
// eslint-disable-next-line react-refresh/only-export-components
export const useWorkbench = () => useContext(WorkbenchContext);