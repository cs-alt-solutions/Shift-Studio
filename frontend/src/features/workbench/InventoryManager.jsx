/* src/features/workbench/InventoryManager.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Plus, Back, History, WorkshopIcon } from '../../components/Icons'; 
import { StatCard } from '../../components/cards/StatCard';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { AssetCard } from '../../components/cards/AssetCard';
import { IntakeForm } from './components/IntakeForm';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, APP_CONFIG } from '../../utils/glossary';

export const InventoryManager = () => {
  const { materials, activeProjects, manufactureProduct } = useInventory(); 
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  
  const [productionData, setProductionData] = useState({ projectId: '', batchSize: 1 });
  const [consoleLogs, setConsoleLogs] = useState([]);

  const metrics = useMemo(() => {
    let totalValue = 0;
    materials.forEach(m => {
      const val = (m.qty || 0) * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
    });
    return { totalValue };
  }, [materials]);

  const workshopItems = useMemo(() => 
    materials.filter(m => APP_CONFIG.INVENTORY.WORKSHOP.includes(m.category)), 
  [materials]);
  
  const logisticsItems = useMemo(() => 
    materials.filter(m => APP_CONFIG.INVENTORY.LOGISTICS.includes(m.category)), 
  [materials]);

  const handleRunBatch = async (e) => {
    e.preventDefault();
    const project = activeProjects.find(p => p.id.toString() === productionData.projectId.toString());
    if (!project) return;

    logToConsole(`Initializing batch for ${project.title}...`);
    const result = await manufactureProduct(project.id, project.recipe, parseInt(productionData.batchSize));
    
    if (result.success) {
        logToConsole(`Success: ${productionData.batchSize} units added to stock.`);
    } else {
        logToConsole(`Error: ${result.message}`);
    }
  };

  const logToConsole = (msg) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConsoleLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  return (
    <div className="inventory-layout">
      <div className="inventory-scroll-area">
        <div className="inventory-header">
          <div>
            <h2 className="header-title">{TERMINOLOGY.INVENTORY.HEADER}</h2>
            <span className="header-subtitle">{TERMINOLOGY.INVENTORY.MANIFEST_LABEL}</span>
          </div>
          <button className="btn-primary" onClick={() => setShowIntakeForm(true)}>
             <Plus /> {TERMINOLOGY.GENERAL.ADD}
          </button>
        </div>

        <StatCard label={TERMINOLOGY.INVENTORY.VALUE_LABEL} value={formatCurrency(metrics.totalValue)} glowColor="purple" />

        <div className="blueprint-section">
          <div className="section-separator-inventory">
             <span className="separator-label-inv">{TERMINOLOGY.INVENTORY.SECTION_WORKSHOP}</span>
             <div className="separator-line-inv" />
          </div>
          <div className="locker-grid animate-fade-in">
             {workshopItems.map(m => (
                <AssetCard key={m.id} asset={m} onClick={() => setSelectedMaterial(m)} isSelected={selectedMaterial?.id === m.id} />
             ))}
          </div>
        </div>

        <div className="blueprint-section">
          <div className="section-separator-inventory">
             <span className="separator-label-inv logistics">{TERMINOLOGY.INVENTORY.SECTION_LOGISTICS}</span>
             <div className="separator-line-inv" />
          </div>
          <div className="locker-grid animate-fade-in">
             {logisticsItems.map(m => (
                <AssetCard key={m.id} asset={m} onClick={() => setSelectedMaterial(m)} isSelected={selectedMaterial?.id === m.id} />
             ))}
          </div>
        </div>
      </div>

      <div className="sidebar-col">
         <div className="keyword-header flex-between">
           <h3 className="label-industrial glow-purple">
             {showIntakeForm ? TERMINOLOGY.INVENTORY.INTAKE : selectedMaterial ? TERMINOLOGY.INVENTORY.ASSET_DETAILS : TERMINOLOGY.INVENTORY.CONSOLE_HEADER}
           </h3>
           {(showIntakeForm || selectedMaterial) && (
               <button onClick={() => {setShowIntakeForm(false); setSelectedMaterial(null);}} className="btn-icon-hover-clean"><Back /></button>
           )}
        </div>

        <div className="keyword-list">
          {showIntakeForm ? (
            <IntakeForm onClose={() => setShowIntakeForm(false)} />
          ) : selectedMaterial ? (
            <div className="sidebar-panel animate-fade-in">
              <ImagePlaceholder text={TERMINOLOGY.INVENTORY.PHOTO_LABEL} />
              <div className="sidebar-inner pad-20">
                <h3 className="detail-title">{selectedMaterial.name}</h3>
                <div className="history-section mt-20">
                    <div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5"><History /> {TERMINOLOGY.INVENTORY.HISTORY_LOG}</div>
                    <div className="history-list flex-col gap-10">
                        {selectedMaterial.history?.length > 0 ? (
                            selectedMaterial.history.map((log, idx) => (
                                <div key={idx} className="flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                                    <span className="font-small text-muted">{new Date(log.date).toLocaleDateString()}</span>
                                    <span className={log.qty > 0 ? 'text-good' : 'text-warning'}>
                                        {log.qty > 0 ? '+' : ''}{log.qty}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted italic font-small">{TERMINOLOGY.GENERAL.NO_DATA}</div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sidebar-panel animate-fade-in pad-20">
                <form onSubmit={handleRunBatch}>
                    <div className="lab-form-group mb-20">
                        <label className="label-industrial">{TERMINOLOGY.GENERAL.SELECT_PRODUCT}</label>
                        <select 
                            className="input-industrial" 
                            value={productionData.projectId} 
                            onChange={e => setProductionData({...productionData, projectId: e.target.value})}
                        >
                            <option value="">-- Choose Product --</option>
                            {activeProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                    <div className="lab-form-group mb-20">
                        <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.BATCH}</label>
                        <input 
                            type="number" className="input-industrial text-center" 
                            value={productionData.batchSize} 
                            onChange={e => setProductionData({...productionData, batchSize: e.target.value})}
                        />
                    </div>
                    <button className="btn-primary w-full py-15" disabled={!productionData.projectId}>
                        <WorkshopIcon /> {TERMINOLOGY.BLUEPRINT.RUN}
                    </button>
                </form>
                {consoleLogs.length > 0 && (
                    <div className="console-log-area mt-20 p-10 bg-app border-subtle border-radius-2 font-mono font-small text-muted">
                        {consoleLogs.map((log, i) => <div key={i} className="mb-5">{log}</div>)}
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};