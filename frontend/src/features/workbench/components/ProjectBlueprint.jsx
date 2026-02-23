/* src/features/workbench/components/ProjectBlueprint.jsx */
import React, { useState } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';
import { useProjectEconomics } from '../../../context/FinancialContext';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { Save, WorkshopIcon, Finance, CloseIcon, Plus } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials } = useInventory();
  
  const [activeTab, setActiveTab] = useState('BUILD'); 
  const [localProject, setLocalProject] = useState({
    ...project,
    instructions: project.instructions || [],
    brand_specs: project.brand_specs || { label_size: '', finish: '', font_main: '', hex_code: '#ffffff', notes: '' },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20 },
    checklist: project.checklist || { photos: false, description: false, tags: false }
  });
  
  const { materialCost, platformFees, netProfit, marginPercent } = useProjectEconomics(localProject);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [newStep, setNewStep] = useState('');

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
    onClose(); 
  };

  // --- INSTRUCTION LOGIC ---
  const addStep = () => {
    if (!newStep.trim()) return;
    handleUpdate('instructions', [...localProject.instructions, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (index) => {
    const updated = localProject.instructions.filter((_, i) => i !== index);
    handleUpdate('instructions', updated);
  };

  const renderEngineering = () => (
    <div className="engineering-grid-v2">
        {/* Left Column: The Recipe */}
        <div className="bp-col">
            <div className="blueprint-card">
                <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>
                <div className="lab-form-group mb-20">
                    <select className="input-industrial mb-10" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
                        <option value="">{TERMINOLOGY.BLUEPRINT.ADD_MATERIAL}</option>
                        {materials.filter(m => m.qty > 0).map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <div className="flex-between gap-10">
                        <input 
                            type="number" className="input-industrial" placeholder="Qty per unit"
                            value={reqQty} onChange={e => setReqQty(e.target.value)}
                        />
                        <button className="btn-ghost" onClick={() => {
                            const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
                            if(mat && reqQty) {
                                handleUpdate('recipe', [...(localProject.recipe || []), { matId: mat.id, name: mat.name, reqPerUnit: parseFloat(reqQty), unit: mat.unit }]);
                                setSelectedMatId(''); setReqQty('');
                            }
                        }}>{TERMINOLOGY.GENERAL.ADD}</button>
                    </div>
                </div>
                <div className="flex-col gap-10">
                    {localProject.recipe?.map((item, idx) => (
                        <div key={idx} className="recipe-item flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                            <span className="font-bold">{item.name} <span className="text-muted font-small">({item.reqPerUnit}{item.unit})</span></span>
                            <button className="btn-icon text-muted hover-red" onClick={() => {
                                const r = localProject.recipe.filter((_, i) => i !== idx);
                                handleUpdate('recipe', r);
                            }}><CloseIcon /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Assembly Guide */}
        <div className="bp-col">
            <div className="blueprint-card">
                <div className="blueprint-card-title">ASSEMBLY GUIDE (SOP)</div>
                <div className="flex-between gap-10 mb-20">
                    <input 
                        className="input-industrial" placeholder="Step description..." 
                        value={newStep} onChange={e => setNewStep(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addStep()}
                    />
                    <button className="btn-ghost" onClick={addStep}><Plus /></button>
                </div>
                <div className="instructions-list">
                    {localProject.instructions.map((step, idx) => (
                        <div key={idx} className="instruction-step flex-between p-10 mb-5 bg-row-even border-radius-2">
                            <div className="flex-center gap-10">
                                <span className="step-num">{idx + 1}</span>
                                <span className="text-main font-small">{step}</span>
                            </div>
                            <button className="btn-icon text-muted" onClick={() => removeStep(idx)}><CloseIcon /></button>
                        </div>
                    ))}
                    {localProject.instructions.length === 0 && <div className="text-muted italic pad-10">No instructions defined yet.</div>}
                </div>
            </div>
        </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="phase-grid">
         <div className="phase-col">
            <div className="blueprint-card">
                <div className="blueprint-card-title"><Finance /> PROFIT SIMULATOR</div>
                <div className="lab-form-group mt-20">
                    <label className="label-industrial">TARGET RETAIL</label>
                    <input 
                        type="number" className="input-industrial retail-price-input" 
                        value={localProject.retailPrice}
                        onChange={e => handleUpdate('retailPrice', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="profit-breakdown">
                    <div className="calc-row">
                        <span>Material Cost:</span> 
                        <span className="text-muted">{formatCurrency(materialCost)}</span>
                    </div>
                    <div className="calc-row">
                        <span>Platform Fees:</span> 
                        <span className="text-warning">-{formatCurrency(platformFees)}</span>
                    </div>
                    <div className="calc-row final">
                        <span>Net Profit:</span> 
                        <span className="text-good">{formatCurrency(netProfit)}</span>
                    </div>
                    <div className="text-right font-small text-muted mt-10">Margin: {marginPercent.toFixed(1)}%</div>
                </div>
            </div>
         </div>

         <div className="phase-col">
             <div className="blueprint-card">
                 <div className="blueprint-card-title">BRAND & LABEL SPECS</div>
                 <div className="mt-20 flex-col gap-15">
                    <div className="flex-between gap-10">
                        <div className="w-full">
                            <label className="label-industrial">LABEL SIZE</label>
                            <input className="input-industrial" value={localProject.brand_specs.label_size} onChange={e => handleUpdate('brand_specs', e.target.value, 'label_size')} placeholder="e.g. 2x3 Rectangle" />
                        </div>
                        <div className="w-full">
                            <label className="label-industrial">HEX COLOR</label>
                            <div className="flex-center gap-10">
                                <input type="color" value={localProject.brand_specs.hex_code} onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} />
                                <input className="input-industrial font-mono" value={localProject.brand_specs.hex_code} onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="label-industrial">PRIMARY FONT</label>
                        <input className="input-industrial" value={localProject.brand_specs.font_main} onChange={e => handleUpdate('brand_specs', e.target.value, 'font_main')} placeholder="e.g. Montserrat Bold" />
                    </div>
                    <div>
                        <label className="label-industrial">MAKER NOTES / PACKAGING INFO</label>
                        <textarea className="input-industrial" value={localProject.brand_specs.notes} onChange={e => handleUpdate('brand_specs', e.target.value, 'notes')} placeholder="Special packaging instructions..." />
                    </div>
                 </div>
             </div>
         </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-window blueprint-window-size animate-fade-in">
        <div className="blueprint-header">
           <div className="bp-top-bar pad-20 flex-between border-bottom-subtle">
               <div className="flex-center w-full max-w-500">
                  <WorkshopIcon />
                  <input 
                    className="input-chromeless ml-10 font-large font-bold w-full"
                    value={localProject.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                  />
               </div>
               <div className="flex-center gap-10">
                  {isDirty && <span className="text-warning font-small italic mr-10">Unsaved Changes</span>}
                  <button className="btn-ghost" onClick={onClose}>CANCEL</button>
                  <button className="btn-primary" onClick={handleSave}><Save /> SAVE BLUEPRINT</button>
               </div>
           </div>
           <div className="tab-container">
               <div className={`tab-item ${activeTab === 'BUILD' ? 'active' : ''}`} onClick={() => setActiveTab('BUILD')}>ENGINEERING</div>
               <div className={`tab-item ${activeTab === 'LAUNCH' ? 'active' : ''}`} onClick={() => setActiveTab('LAUNCH')}>BRANDING & PROFIT</div>
           </div>
        </div>
        <div className="blueprint-body bg-app p-20">
            {activeTab === 'BUILD' && renderEngineering()}
            {activeTab === 'LAUNCH' && renderLaunch()}
        </div>
      </div>
    </div>
  );
};