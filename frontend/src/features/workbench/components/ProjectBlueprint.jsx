/* src/features/workbench/components/ProjectBlueprint.jsx */
import React, { useState, useMemo } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { convertToStockUnit } from '../../../utils/units';
import { Save, Box, WorkshopIcon, Radar, Finance } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials, manufactureProduct } = useInventory();
  
  // SESSION STATE
  const [activeTab, setActiveTab] = useState('RD'); // RD | BUILD | LAUNCH
  const [localProject, setLocalProject] = useState({
    ...project,
    research: project.research || { targetAudience: '', inspiration: '', notes: '' },
    checklist: project.checklist || { photos: false, description: false, tags: false },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20 }
  });
  
  const [batchSize, setBatchSize] = useState(1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // Recipe Form State
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');

  // --- CALCULATIONS ---
  const materialCost = useMemo(() => {
    if (!localProject.recipe || localProject.recipe.length === 0) return 0;
    return localProject.recipe.reduce((total, item) => {
      const mat = materials.find(m => m.id === item.matId);
      if (!mat) return total;
      const qtyInStockUnit = convertToStockUnit(item.reqPerUnit, item.unit, mat.unit);
      return total + (qtyInStockUnit * mat.costPerUnit);
    }, 0);
  }, [localProject.recipe, materials]);

  const platformFees = useMemo(() => {
     const retail = localProject.retailPrice || 0;
     const { platformFeePercent, platformFixedFee } = localProject.economics;
     if (retail === 0) return 0;
     return (retail * (platformFeePercent / 100)) + platformFixedFee;
  }, [localProject.retailPrice, localProject.economics]);

  const totalCost = materialCost + platformFees + (parseFloat(localProject.economics.shippingCost) || 0);
  const netProfit = (localProject.retailPrice || 0) - totalCost;
  const marginPercent = localProject.retailPrice > 0 ? (netProfit / localProject.retailPrice) * 100 : 0;

  // --- ACTIONS ---
  const handleUpdate = (field, value, subField = null) => {
      setIsDirty(true);
      if (subField) {
          setLocalProject(prev => ({
              ...prev,
              [field]: { ...prev[field], [subField]: value }
          }));
      } else {
          setLocalProject(prev => ({ ...prev, [field]: value }));
      }
  };

  const handleSave = () => {
    updateProject(localProject);
    setIsDirty(false);
    logToConsole("Project Blueprint synced to database.", "success");
  };

  const handleAddIngredient = () => {
    if (!selectedMatId || !reqQty) return;
    const mat = materials.find(m => m.id === parseInt(selectedMatId));
    
    const newItem = {
      matId: mat.id,
      name: mat.name,
      reqPerUnit: parseFloat(reqQty),
      unit: mat.unit 
    };

    const newRecipe = [...(localProject.recipe || []), newItem];
    setLocalProject(prev => ({ ...prev, recipe: newRecipe }));
    setIsDirty(true);
    setReqQty('');
    setSelectedMatId('');
  };

  const handleRemoveIngredient = (index) => {
    const newRecipe = [...localProject.recipe];
    newRecipe.splice(index, 1);
    setLocalProject(prev => ({ ...prev, recipe: newRecipe }));
    setIsDirty(true);
  };

  const handleRunBatch = () => {
    if (!localProject.recipe || localProject.recipe.length === 0) {
        logToConsole("Error: Recipe empty. Cannot build.", "error");
        return;
    }
    const result = manufactureProduct(localProject.id, localProject.recipe, parseInt(batchSize));
    if (result.success) {
        logToConsole(`PRODUCTION SUCCESS: ${result.message}`, "success");
        setLocalProject(prev => ({ ...prev, stockQty: (prev.stockQty || 0) + parseInt(batchSize) }));
    } else {
        logToConsole(`PRODUCTION FAILED: ${result.message}`, "error");
    }
  };

  const logToConsole = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [`[${timestamp}] ${msg}::${type}`, ...prev]);
  };

  // --- RENDERERS ---
  const renderRD = () => (
    <div className="phase-grid">
        <div className="phase-col">
            <div className="bp-section-header flex-center gap-10"><Radar /> MARKET RESEARCH</div>
            <div className="pad-20">
                <div className="lab-form-group">
                    <label className="label-industrial">TARGET AUDIENCE</label>
                    <textarea 
                        className="input-industrial" rows="3" 
                        placeholder="Who is this for? (e.g., 'Gifts for Moms', 'Coffee Lovers')..."
                        value={localProject.research.targetAudience}
                        onChange={e => handleUpdate('research', e.target.value, 'targetAudience')}
                    />
                </div>
                <div className="lab-form-group">
                    <label className="label-industrial">INSPIRATION / COMPETITOR URL</label>
                    <input 
                        className="input-industrial" 
                        placeholder="https://etsy.com/..."
                        value={localProject.research.inspiration}
                        onChange={e => handleUpdate('research', e.target.value, 'inspiration')}
                    />
                </div>
                <div className="lab-form-group">
                    <label className="label-industrial">PRODUCT NOTES</label>
                    <textarea 
                        className="input-industrial" rows="6" 
                        placeholder="Design ideas, scent profiles, sketches..."
                        value={localProject.research.notes}
                        onChange={e => handleUpdate('research', e.target.value, 'notes')}
                    />
                </div>
            </div>
        </div>
        <div className="phase-col">
             <div className="bp-section-header">VISUAL CONCEPTS</div>
             <div className="flex-center flex-col h-full text-muted">
                 <div style={{ border: '2px dashed var(--border-subtle)', padding: '40px', borderRadius: '8px' }}>
                    DRAG & DROP CONCEPT ART HERE
                 </div>
                 <span className="font-small mt-10 opacity-50">(Simulated Upload Zone)</span>
             </div>
        </div>
    </div>
  );

  const renderEngineering = () => (
    <div className="engineering-grid">
        {/* COL 1: RECIPE */}
        <div className="bp-col">
            <div className="bp-section-header">BILL OF MATERIALS</div>
            <div className="pad-20 border-bottom-subtle">
                <div className="lab-form-group">
                <select className="input-industrial mb-10" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
                    <option value="">-- Add Material --</option>
                    {materials.filter(m => m.qty > 0).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
                <div className="flex-between gap-10">
                    <input 
                        type="number" className="input-industrial" placeholder="Qty"
                        value={reqQty} onChange={e => setReqQty(e.target.value)}
                    />
                    <button className="btn-ghost" onClick={handleAddIngredient}>ADD</button>
                </div>
                </div>
            </div>
            <div className="flex-col">
                {localProject.recipe?.map((item, idx) => (
                <div key={idx} className="recipe-item">
                    <div>
                        <div className="recipe-name">{item.name}</div>
                        <div className="recipe-meta">{item.reqPerUnit} {item.unit}</div>
                    </div>
                    <button className="btn-icon" onClick={() => handleRemoveIngredient(idx)}>×</button>
                </div>
                ))}
            </div>
        </div>

        {/* COL 2: VISUAL */}
        <div className="bp-col flex-center bg-dots">
             <div className="text-center">
                 <Box style={{ width: 48, height: 48, opacity: 0.3 }} />
                 <div className="mt-20 font-mono text-muted">PRODUCT RENDER</div>
             </div>
        </div>

        {/* COL 3: PRODUCTION */}
        <div className="bp-col">
            <div className="bp-section-header">PRODUCTION CONSOLE</div>
            <div className="pad-20">
                <div className="stock-indicator-clean mb-20 flex-center">
                   IN STOCK: <strong className="ml-5 text-white">{localProject.stockQty || 0}</strong>
                </div>
                <div className="lab-form-group">
                   <label className="label-industrial">BATCH SIZE</label>
                   <input 
                       type="number" className="input-industrial" 
                       value={batchSize} onChange={e => setBatchSize(e.target.value)}
                   />
                </div>
                <button 
                   className="btn-primary w-full mt-10" 
                   onClick={handleRunBatch}
                   disabled={!localProject.recipe || localProject.recipe.length === 0}
                >
                   RUN BATCH
                </button>
            </div>
            <div className="console-log-area">
                 {consoleLogs.map((log, i) => {
                    const [msg, type] = log.split('::');
                    return <div key={i} className={`log-entry log-${type}`}>{msg}</div>;
                 })}
            </div>
        </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="phase-grid">
         <div className="phase-col">
            <div className="bp-section-header flex-center gap-10"><Finance /> PROFIT SIMULATOR</div>
            <div className="pad-20">
                <div className="lab-form-group">
                    <label className="label-industrial">RETAIL PRICE ($)</label>
                    <input 
                        type="number" className="input-industrial font-bold text-main" style={{ fontSize: '1.2rem' }}
                        value={localProject.retailPrice}
                        onChange={e => handleUpdate('retailPrice', parseFloat(e.target.value))}
                    />
                </div>
                
                <div className="profit-breakdown">
                    <div className="calc-row">
                        <span>Raw Materials:</span>
                        <span className="text-muted">{formatCurrency(materialCost)}</span>
                    </div>
                    <div className="calc-row">
                         <span>Platform Fees ({localProject.economics.platformFeePercent}% + ${localProject.economics.platformFixedFee}):</span>
                         <span className="text-warning">-{formatCurrency(platformFees)}</span>
                    </div>
                    <div className="calc-row">
                         <span>Shipping Label Cost (Est.):</span>
                         <div style={{ width: '80px' }}>
                             <input 
                                className="input-chromeless text-right" 
                                type="number" 
                                value={localProject.economics.shippingCost}
                                onChange={e => handleUpdate('economics', parseFloat(e.target.value), 'shippingCost')}
                             />
                         </div>
                    </div>
                    <div className="calc-row final">
                        <span>NET PROFIT:</span>
                        <span className={netProfit > 0 ? 'text-good' : 'text-alert'}>
                            {formatCurrency(netProfit)}
                        </span>
                    </div>
                     <div className="text-right font-small text-muted mt-5">
                        Margin: {marginPercent.toFixed(1)}%
                     </div>
                </div>
            </div>
         </div>

         <div className="phase-col">
             <div className="bp-section-header">LAUNCH CHECKLIST</div>
             <div className="pad-20">
                 {['photos', 'description', 'tags'].map(key => (
                     <div 
                        key={key} 
                        className={`checklist-item ${localProject.checklist[key] ? 'checked' : ''}`}
                        onClick={() => handleUpdate('checklist', !localProject.checklist[key], key)}
                     >
                        <div className="check-box">{localProject.checklist[key] && '✓'}</div>
                        <span className="label-industrial no-margin">
                            {key === 'photos' ? 'PRODUCT PHOTOS TAKEN' : 
                             key === 'description' ? 'DESCRIPTION WRITTEN' : 'SEO TAGS RESEARCHED'}
                        </span>
                     </div>
                 ))}

                 <div className="mt-40 p-20 border-subtle text-center">
                     <div className="label-industrial mb-10">READY TO SHIP?</div>
                     <button className="btn-primary w-full">GENERATE SHIPPING LABEL (MOCK)</button>
                 </div>
             </div>
         </div>
    </div>
  );

  return (
    // UPDATED: Using Global "modal-overlay" and "modal-window" classes
    <div className="modal-overlay">
      <div className="modal-window blueprint-window-size animate-fade-in">
        <div className="blueprint-header">
           <div className="bp-top-bar">
               <div className="flex-center">
                  <WorkshopIcon />
                  <div className="ml-10">
                    <span className="blueprint-title">{localProject.title}</span>
                    <span className="blueprint-id">REF: {localProject.id.toString().slice(-4)}</span>
                  </div>
               </div>
               <div className="flex-center gap-10">
                  {isDirty && <span className="text-warning font-small italic">Unsaved Changes</span>}
                  <button className="btn-primary" onClick={handleSave}>
                     <Save /> {TERMINOLOGY.GENERAL.SAVE}
                  </button>
                  <button className="btn-ghost" onClick={onClose}>{TERMINOLOGY.GENERAL.CLOSE}</button>
               </div>
           </div>
           
           {/* UPDATED: Using Global "tab-container" and "tab-item" classes */}
           <div className="tab-container">
               <div className={`tab-item ${activeTab === 'RD' ? 'active' : ''}`} onClick={() => setActiveTab('RD')}>1. PLAN (R&D)</div>
               <div className={`tab-item ${activeTab === 'BUILD' ? 'active' : ''}`} onClick={() => setActiveTab('BUILD')}>2. BUILD (ENGINEERING)</div>
               <div className={`tab-item ${activeTab === 'LAUNCH' ? 'active' : ''}`} onClick={() => setActiveTab('LAUNCH')}>3. LAUNCH (MARKET)</div>
           </div>
        </div>

        <div className="blueprint-body">
            {activeTab === 'RD' && renderRD()}
            {activeTab === 'BUILD' && renderEngineering()}
            {activeTab === 'LAUNCH' && renderLaunch()}
        </div>
      </div>
    </div>
  );
};