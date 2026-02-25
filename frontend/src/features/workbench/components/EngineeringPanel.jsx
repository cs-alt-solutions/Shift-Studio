/* src/features/workbench/components/EngineeringPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';

export const EngineeringPanel = ({
  localProject, materials, handleUpdate,
  selectedMatId, setSelectedMatId, reqQty, setReqQty,
  newStep, setNewStep, addStep, removeStep
}) => {

  // --- ACTIONS ---
  const handleAddMaterial = () => {
    if (!selectedMatId || !reqQty) return;
    
    // Cross-reference the selected ID with our live Inventory data
    const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
    if (!mat) return;

    // Snapshot the material cost at the time the recipe is created
    const newItem = {
      matId: mat.id,
      name: mat.name,
      reqPerUnit: parseFloat(reqQty),
      costPerUnit: mat.costPerUnit 
    };

    const currentRecipe = localProject.recipe || [];
    handleUpdate('recipe', [...currentRecipe, newItem]);

    // Reset the local form state for the next item
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
       <div className="blueprint-card m-0 flex-col">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>

          <div className="grid-2-col gap-15 mb-20 align-end">
             <div className="lab-form-group">
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
             
             <div className="grid-2-col gap-10">
                 <div className="lab-form-group">
                    <label className="label-industrial">{TERMINOLOGY.GENERAL.UNITS}</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        className="input-industrial" 
                        value={reqQty} 
                        onChange={e => setReqQty(e.target.value)} 
                        placeholder="0.00" 
                    />
                 </div>
                 <button type="button" className="btn-primary w-full mt-auto py-10" onClick={handleAddMaterial}>
                     {TERMINOLOGY.GENERAL.ADD}
                 </button>
             </div>
          </div>

          {/* DYNAMIC BOM LIST */}
          <div className="flex-1 overflow-y-auto pr-10">
             {recipe.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center border-dashed border-subtle border-radius-2">
                     {TERMINOLOGY.GENERAL.NO_DATA}
                 </div>
             ) : (
                 <div className="flex-col gap-10">
                     {recipe.map((item, idx) => (
                         <div key={idx} className="flex-between p-15 bg-row-odd border-subtle border-radius-2">
                             <div>
                                 <div className="font-bold text-main">{item.name}</div>
                                 <div className="font-small text-muted font-mono mt-5">
                                     {item.reqPerUnit} units @ {formatCurrency(item.costPerUnit || 0)}/ea
                                 </div>
                             </div>
                             <div className="flex-center gap-15">
                                 <div className="font-mono text-neon-teal font-bold">
                                     {formatCurrency(item.reqPerUnit * (item.costPerUnit || 0))}
                                 </div>
                                 <button type="button" className="btn-icon-hover-clean text-alert font-small font-mono" onClick={() => handleRemoveMaterial(idx)}>
                                     [ {TERMINOLOGY.GENERAL.DELETE} ]
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
       </div>

       {/* --- RIGHT COLUMN: STANDARD OPERATING PROCEDURE (SOP) --- */}
       <div className="blueprint-card m-0 flex-col">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.ASSEMBLY_GUIDE}</div>

          <div className="flex gap-10 mb-20 align-end">
             <div className="lab-form-group flex-1">
                 <input
                    type="text"
                    className="input-industrial w-full"
                    placeholder={TERMINOLOGY.WORKSHOP.STEP_PLACEHOLDER}
                    value={newStep}
                    onChange={e => setNewStep(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addStep()}
                 />
             </div>
             <button type="button" className="btn-primary py-10" onClick={addStep}>
                 {TERMINOLOGY.GENERAL.ADD}
             </button>
          </div>

          {/* DYNAMIC SOP LIST */}
          <div className="flex-1 overflow-y-auto pr-10 flex-col gap-10">
             {localProject.instructions?.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center border-dashed border-subtle border-radius-2">
                     {TERMINOLOGY.GENERAL.NO_DATA}
                 </div>
             ) : (
                 localProject.instructions?.map((step, idx) => (
                     <div key={idx} className="instruction-step flex p-15 bg-darker border-radius-2 gap-15 align-start">
                         <div className="step-num flex-shrink-0">{idx + 1}</div>
                         <div className="text-main font-small flex-1 lh-15">{step}</div>
                         <button type="button" className="btn-icon-hover-clean text-alert flex-shrink-0 font-small font-mono" onClick={() => removeStep(idx)}>
                             [ {TERMINOLOGY.GENERAL.DELETE} ]
                         </button>
                     </div>
                 ))
             )}
          </div>
       </div>

    </div>
  );
};