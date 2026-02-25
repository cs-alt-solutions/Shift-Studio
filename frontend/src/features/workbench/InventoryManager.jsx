/* src/features/workbench/InventoryManager.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Plus, Back, History, WorkshopIcon } from '../../components/Icons'; 
import { StatCard } from '../../components/cards/StatCard';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { AssetCard } from '../../components/cards/AssetCard';
import { VendorCard } from '../../components/cards/VendorCard'; 
import { IntakeForm } from './components/IntakeForm';
import { AssetEditForm } from './components/AssetEditForm';
import { VendorEditForm } from './components/VendorEditForm'; // NEW IMPORT
import { formatCurrency, getFaviconUrl, getDomainFromUrl } from '../../utils/formatters';
import { TERMINOLOGY, APP_CONFIG } from '../../utils/glossary';

export const InventoryManager = () => {
  const { materials, activeProjects, manufactureProduct, vendors, addVendor } = useInventory(); 
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('ASSETS'); // 'ASSETS' or 'VENDORS'
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  
  // Console State
  const [productionData, setProductionData] = useState({ projectId: '', batchSize: 1 });
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Memoized Data
  const metrics = useMemo(() => {
    let totalValue = 0;
    materials.forEach(m => {
      const val = (m.qty || 0) * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
    });
    return { totalValue };
  }, [materials]);

  const workshopItems = useMemo(() => materials.filter(m => APP_CONFIG.INVENTORY.WORKSHOP.includes(m.category)), [materials]);
  const logisticsItems = useMemo(() => materials.filter(m => APP_CONFIG.INVENTORY.LOGISTICS.includes(m.category)), [materials]);

  // Actions
  const handleRunBatch = async (e) => {
    e.preventDefault();
    const project = activeProjects.find(p => p.id.toString() === productionData.projectId.toString());
    if (!project) return;

    logToConsole(`Initializing batch for ${project.title}...`);
    const result = await manufactureProduct(project.id, project.recipe, parseInt(productionData.batchSize));
    
    if (result.success) logToConsole(`Success: ${productionData.batchSize} units added to stock.`);
    else logToConsole(`Error: ${result.message}`);
  };

  const logToConsole = (msg) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConsoleLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const handleTabSwitch = (tab) => {
      setActiveTab(tab);
      setSelectedItem(null);
      setShowIntakeForm(false);
      setIsEditing(false);
  };

  // --- INTERNAL COMPONENTS FOR CLEAN RENDERING ---
  const VendorIntakeForm = () => {
      const [formData, setFormData] = useState({ name: '', website: '', leadTime: '', contactInfo: '', reliability: 100 });
      
      const onSubmit = async (e) => {
          e.preventDefault();
          await addVendor(formData);
          setShowIntakeForm(false);
      };

      return (
          <form onSubmit={onSubmit} className="animate-fade-in">
              <div className="lab-form-group mb-15">
                  <label className="label-industrial">VENDOR NAME</label>
                  <input required type="text" className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="lab-form-group mb-15">
                  <label className="label-industrial">{TERMINOLOGY.VENDOR.WEBSITE}</label>
                  <input type="url" className="input-industrial" placeholder={TERMINOLOGY.VENDOR.URL_PLACEHOLDER} value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="lab-form-group mb-15">
                  <label className="label-industrial">{TERMINOLOGY.VENDOR.LEAD_TIME} (DAYS)</label>
                  <input type="number" className="input-industrial" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: e.target.value})} />
              </div>
              <div className="lab-form-group mb-20">
                  <label className="label-industrial">{TERMINOLOGY.VENDOR.CONTACT_INFO}</label>
                  <textarea className="input-industrial" rows="3" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full">{TERMINOLOGY.GENERAL.SAVE}</button>
          </form>
      );
  };

  return (
    <div className="inventory-layout">
      {/* LEFT COLUMN: MAIN SCROLL AREA */}
      <div className="inventory-scroll-area">
        <div className="inventory-header">
          <div>
            <h2 className="header-title">{TERMINOLOGY.INVENTORY.HEADER}</h2>
            <div className="tab-group">
                <button className={`tab-btn ${activeTab === 'ASSETS' ? 'active' : ''}`} onClick={() => handleTabSwitch('ASSETS')}>
                    {TERMINOLOGY.INVENTORY.TAB_ASSETS}
                </button>
                <button className={`tab-btn ${activeTab === 'VENDORS' ? 'active' : ''}`} onClick={() => handleTabSwitch('VENDORS')}>
                    {TERMINOLOGY.INVENTORY.TAB_VENDORS}
                </button>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowIntakeForm(true)}>
             <Plus /> {activeTab === 'ASSETS' ? TERMINOLOGY.GENERAL.ADD : TERMINOLOGY.VENDOR.ADD_VENDOR}
          </button>
        </div>

        {activeTab === 'ASSETS' ? (
            <>
                <StatCard label={TERMINOLOGY.INVENTORY.VALUE_LABEL} value={formatCurrency(metrics.totalValue)} glowColor="purple" />
                <div className="blueprint-section">
                <div className="section-separator-inventory">
                    <span className="separator-label-inv">{TERMINOLOGY.INVENTORY.SECTION_WORKSHOP}</span>
                    <div className="separator-line-inv" />
                </div>
                <div className="locker-grid animate-fade-in">
                    {workshopItems.map(m => <AssetCard key={m.id} asset={m} onClick={() => { setSelectedItem(m); setIsEditing(false); }} isSelected={selectedItem?.id === m.id} />)}
                </div>
                </div>

                <div className="blueprint-section">
                <div className="section-separator-inventory">
                    <span className="separator-label-inv logistics">{TERMINOLOGY.INVENTORY.SECTION_LOGISTICS}</span>
                    <div className="separator-line-inv" />
                </div>
                <div className="locker-grid animate-fade-in">
                    {logisticsItems.map(m => <AssetCard key={m.id} asset={m} onClick={() => { setSelectedItem(m); setIsEditing(false); }} isSelected={selectedItem?.id === m.id} />)}
                </div>
                </div>
            </>
        ) : (
            <div className="blueprint-section mt-20">
                <div className="locker-grid animate-fade-in">
                    {vendors.length > 0 ? (
                        vendors.map(v => <VendorCard key={v.id} vendor={v} onClick={() => { setSelectedItem(v); setIsEditing(false); }} isSelected={selectedItem?.id === v.id} />)
                    ) : (
                        <div className="text-muted italic">{TERMINOLOGY.GENERAL.NO_DATA}</div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* RIGHT COLUMN: SIDEBAR */}
      <div className="sidebar-col">
         <div className="keyword-header flex-between">
           <h3 className="label-industrial glow-purple">
             {showIntakeForm 
                 ? (activeTab === 'ASSETS' ? TERMINOLOGY.INVENTORY.INTAKE : TERMINOLOGY.VENDOR.ADD_VENDOR) 
                 : selectedItem 
                     ? (activeTab === 'ASSETS' ? TERMINOLOGY.INVENTORY.ASSET_DETAILS : TERMINOLOGY.VENDOR.CONTACT_INFO) 
                     : TERMINOLOGY.INVENTORY.CONSOLE_HEADER}
           </h3>
           {(showIntakeForm || selectedItem) && (
               <button onClick={() => {setShowIntakeForm(false); setSelectedItem(null); setIsEditing(false);}} className="btn-icon-hover-clean"><Back /></button>
           )}
        </div>

        <div className="keyword-list">
          {showIntakeForm ? (
              activeTab === 'ASSETS' ? <IntakeForm onClose={() => setShowIntakeForm(false)} /> : <VendorIntakeForm />
          ) : selectedItem ? (
            <div className="sidebar-panel animate-fade-in">
              {activeTab === 'ASSETS' && !isEditing && <ImagePlaceholder text={TERMINOLOGY.INVENTORY.PHOTO_LABEL} />}
              
              {activeTab === 'VENDORS' && selectedItem.website && !isEditing && (
                <div className="pad-20 border-bottom-subtle bg-row-even flex-center">
                    <img 
                        src={getFaviconUrl(selectedItem.website, 128)} 
                        alt={selectedItem.name} 
                        className="vendor-logo-large"
                    />
                </div>
              )}

              <div className="sidebar-inner pad-20">
                
                {/* DYNAMIC HEADER: View Title OR Edit Controls */}
                <div className="flex-between align-start mb-10">
                    <h3 className="detail-title m-0">{selectedItem.name}</h3>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-icon-hover-clean text-accent font-mono font-small mt-5">
                            [ EDIT ]
                        </button>
                    )}
                </div>
                
                {/* ROUTING LOGIC: Which form or detail view to show? */}
                {isEditing && activeTab === 'ASSETS' ? (
                    <AssetEditForm 
                        asset={selectedItem}
                        onClose={() => { setSelectedItem(null); setIsEditing(false); }}
                        onCancel={() => setIsEditing(false)}
                        onComplete={(updatedData) => {
                            setSelectedItem({ ...selectedItem, ...updatedData });
                            setIsEditing(false);
                        }}
                    />
                ) : isEditing && activeTab === 'VENDORS' ? (
                    <VendorEditForm 
                        vendor={selectedItem}
                        onClose={() => { setSelectedItem(null); setIsEditing(false); }}
                        onCancel={() => setIsEditing(false)}
                        onComplete={(updatedData) => {
                            setSelectedItem({ ...selectedItem, ...updatedData });
                            setIsEditing(false);
                        }}
                    />
                ) : activeTab === 'ASSETS' ? (
                    <>
                        <div className="mb-15 mt-10">
                            <span className="label-industrial">SUPPLIED BY</span>
                            <div className="mt-5 font-mono text-accent">
                                {selectedItem.vendorId && vendors.find(v => v.id === selectedItem.vendorId) 
                                    ? vendors.find(v => v.id === selectedItem.vendorId).name 
                                    : "NO VENDOR LINKED"}
                            </div>
                        </div>

                        <div className="history-section mt-20">
                            <div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5"><History /> {TERMINOLOGY.INVENTORY.HISTORY_LOG}</div>
                            <div className="history-list flex-col gap-10">
                                {selectedItem.history?.length > 0 ? (
                                    selectedItem.history.map((log, idx) => (
                                        <div key={idx} className="flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                                            <span className="font-small text-muted">{new Date(log.date).toLocaleDateString()}</span>
                                            <span className={log.qty > 0 ? 'text-good' : 'text-warning'}>
                                                {log.qty > 0 ? '+' : ''}{log.qty}
                                            </span>
                                        </div>
                                    ))
                                ) : <div className="text-muted italic font-small">{TERMINOLOGY.GENERAL.NO_DATA}</div>}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="vendor-details mt-20">
                        <div className="mb-20">
                            <span className="label-industrial">{TERMINOLOGY.VENDOR.WEBSITE}</span>
                            {selectedItem.website ? (
                                <div className="mt-5">
                                    <a href={selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`} target="_blank" rel="noreferrer" className="text-accent font-mono flex items-center gap-5">
                                        {getDomainFromUrl(selectedItem.website)} ↗
                                    </a>
                                </div>
                            ) : <div className="mt-5 text-muted font-mono">N/A</div>}
                        </div>
                        <div className="mb-20">
                            <span className="label-industrial">{TERMINOLOGY.VENDOR.CONTACT_INFO} & NOTES</span>
                            <div className="mt-10 font-mono text-main bg-bg-app p-15 border-radius-2 border-subtle notes-display">
                                {selectedItem.contactInfo || 'No notes provided.'}
                            </div>
                        </div>
                        <div className="mb-15">
                             <span className="label-industrial">RELIABILITY SCORE</span>
                             <div className={`text-xl font-bold mt-5 ${selectedItem.reliability >= 80 ? 'text-good' : selectedItem.reliability >= 50 ? 'text-warning' : 'text-alert'}`}>
                                {selectedItem.reliability}/100
                             </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ) : (
            <div className="sidebar-panel animate-fade-in pad-20">
                <form onSubmit={handleRunBatch}>
                    <div className="lab-form-group mb-20">
                        <label className="label-industrial">{TERMINOLOGY.GENERAL.SELECT_PRODUCT}</label>
                        <select className="input-industrial" value={productionData.projectId} onChange={e => setProductionData({...productionData, projectId: e.target.value})}>
                            <option value="">-- Choose Product --</option>
                            {activeProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                    <div className="lab-form-group mb-20">
                        <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.BATCH}</label>
                        <input type="number" className="input-industrial text-center" value={productionData.batchSize} onChange={e => setProductionData({...productionData, batchSize: e.target.value})} />
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