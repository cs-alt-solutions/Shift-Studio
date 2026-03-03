/* src/features/workbench/components/EngineeringPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { TrashIcon } from '../../../components/Icons';

export const EngineeringPanel = ({
  localProject, materials, handleUpdate,
  selectedMatId, setSelectedMatId, reqQty, setReqQty,
  newStep, setNewStep, addStep, removeStep
}) => {

  const handleAddMaterial = () => {
    if (!selectedMatId || !reqQty) return;
    const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
    if (!mat) return;

    const newItem = {
      matId: mat.id,
      name: mat.name,
      reqPerUnit: parseFloat(reqQty),
      costPerUnit: mat.costPerUnit 
    };

    const currentRecipe = localProject.recipe || [];
    handleUpdate('recipe', [...currentRecipe, newItem]);
    setSelectedMatId('');
    setReqQty('');
  };

  const handleRemoveMaterial = (index) => {
    const currentRecipe = localProject.recipe || [];
    const updated = currentRecipe.filter((_, i) => i !== index);
    handleUpdate('recipe', updated);
  };

  const recipe = localProject.recipe || [];

  return (
    <div className="engineering-grid-v2 h-full">
       
       {/* --- LEFT COLUMN: BILL OF MATERIALS (BOM) --- */}
       <div className="blueprint-card no-margin flex-col h-full">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>

          {/* Form Area - Using strict flex utilities for alignment */}
          <div className="flex-between gap-10 mb-20">
             <div className="flex-col w-full">
                <label className="label-industrial">MATERIAL</label>
                <select className="input-industrial" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
                   <option value="">{TERMINOLOGY.BLUEPRINT.ADD_MATERIAL}</option>
                   {materials.map(m => (
                      <option key={m.id} value={m.id}>
                          {m.name} ({formatCurrency(m.costPerUnit)}/ea)
                      </option>
                   ))}
                </select>
             </div>
             
             <div className="flex-col">
                 <label className="label-industrial">{TERMINOLOGY.GENERAL.UNITS}</label>
                 <div className="flex-center gap-10">
                    <input 
                        type="number" 
                        step="0.01" 
                        className="input-industrial" 
                        value={reqQty} 
                        onChange={e => setReqQty(e.target.value)} 
                        placeholder="0.00" 
                    />
                    <button type="button" className="btn-primary" onClick={handleAddMaterial}>
                        {TERMINOLOGY.GENERAL.ADD}
                    </button>
                 </div>
             </div>
          </div>

          {/* DYNAMIC BOM LIST */}
          <div className="panel-content no-pad mt-10">
             {recipe.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center">
                     {TERMINOLOGY.GENERAL.NO_DATA}
                 </div>
             ) : (
                 <div className="flex-col gap-10">
                     {recipe.map((item, idx) => (
                         <div key={idx} className="flex-between p-15 border-subtle border-radius-2 bg-darker">
                             {/* UPDATED: Container now has bom-item-text class for CSS constraint */}
                             <div className="bom-item-text">
                                 <div className="font-bold text-main">{item.name}</div>
                                 <div className="font-small text-muted font-mono mt-5">
                                     {item.reqPerUnit} units @ {formatCurrency(item.costPerUnit || 0)}/ea
                                 </div>
                             </div>
                             <div className="flex-center gap-15">
                                 <div className="font-mono text-neon-teal font-bold">
                                     {formatCurrency(item.reqPerUnit * (item.costPerUnit || 0))}
                                 </div>
                                 <button 
                                    type="button" 
                                    className="btn-icon-hover-clean" 
                                    onClick={() => handleRemoveMaterial(idx)}
                                    title={TERMINOLOGY.GENERAL.DELETE}
                                 >
                                     <TrashIcon />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
       </div>

       {/* --- RIGHT COLUMN: STANDARD OPERATING PROCEDURE (SOP) --- */}
       <div className="blueprint-card no-margin flex-col h-full">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.ASSEMBLY_GUIDE}</div>

          {/* Form Area */}
          <div className="flex-col mb-20 w-full">
             <label className="label-industrial">NEW STEP</label>
             <div className="flex-center gap-10 w-full">
                 <input
                    type="text"
                    className="input-industrial w-full"
                    placeholder={TERMINOLOGY.WORKSHOP.STEP_PLACEHOLDER}
                    value={newStep}
                    onChange={e => setNewStep(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addStep()}
                 />
                 <button type="button" className="btn-primary" onClick={addStep}>
                     {TERMINOLOGY.GENERAL.ADD}
                 </button>
             </div>
          </div>

          {/* DYNAMIC SOP LIST */}
          <div className="panel-content no-pad mt-10 flex-col gap-10">
             {localProject.instructions?.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center">
                     {TERMINOLOGY.GENERAL.NO_DATA}
                 </div>
             ) : (
                 localProject.instructions?.map((step, idx) => (
                     <div key={idx} className="instruction-step flex-between p-15 gap-15 bg-darker border-radius-2">
                         <div className="flex-center gap-15">
                             <div className="step-num flex-shrink-0">{idx + 1}</div>
                             {/* UPDATED: Description container now has instruction-item-text class */}
                             <div className="text-main font-small lh-15 instruction-item-text">{step}</div>
                         </div>
                         <button 
                            type="button" 
                            className="btn-icon-hover-clean flex-shrink-0" 
                            onClick={() => removeStep(idx)}
                            title={TERMINOLOGY.GENERAL.DELETE}
                         >
                             <TrashIcon />
                         </button>
                     </div>
                 ))
             )}
          </div>
       </div>

    </div>
  );
};