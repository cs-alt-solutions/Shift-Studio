/* src/features/workbench/components/AssetEditForm.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY, APP_CONFIG } from '../../../utils/glossary';

export const AssetEditForm = ({ asset, onClose, onComplete, onCancel }) => {
  const { updateInventoryItem, deleteInventoryItem, vendors } = useInventory();

  // Pre-fill the form with the existing asset data
  const [formData, setFormData] = useState({
    name: asset.name || '',
    category: asset.category || APP_CONFIG.INVENTORY.WORKSHOP[0],
    vendorId: asset.vendorId || '',
    qty: asset.qty || 0,
    costPerUnit: asset.costPerUnit || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {
      name: formData.name,
      category: formData.category,
      qty: parseFloat(formData.qty),
      costPerUnit: parseFloat(formData.costPerUnit),
      vendorId: formData.vendorId || null
    };
    
    await updateInventoryItem(asset.id, updates);
    onComplete(updates); // Tell the parent UI to exit edit mode and update visually
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}? This cannot be undone.`)) {
      await deleteInventoryItem(asset.id);
      onClose(); // Close the sidebar completely since the item no longer exists
    }
  };

  const allCategories = [...APP_CONFIG.INVENTORY.WORKSHOP, ...APP_CONFIG.INVENTORY.LOGISTICS];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in mt-15">
      <div className="lab-form-group mb-15">
        <label className="label-industrial">{TERMINOLOGY.INVENTORY.MATERIAL_NAME}</label>
        <input required type="text" className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      </div>

      <div className="lab-form-group mb-15">
        <label className="label-industrial">{TERMINOLOGY.GENERAL.CATEGORY}</label>
        <select className="input-industrial" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
           {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="lab-form-group mb-15">
        <label className="label-industrial">SUPPLIER / VENDOR</label>
        <select className="input-industrial" value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})}>
           <option value="">-- No Vendor Assigned --</option>
           {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="grid-2-col gap-15 mb-20">
        <div className="lab-form-group">
          <label className="label-industrial">{TERMINOLOGY.GENERAL.UNITS}</label>
          <input required type="number" step="0.01" className="input-industrial" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} />
        </div>
        <div className="lab-form-group">
          <label className="label-industrial">{TERMINOLOGY.INVENTORY.UNIT_PRICE}</label>
          <input required type="number" step="0.01" className="input-industrial" value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} />
        </div>
      </div>

      <div className="flex-col gap-10">
          <button type="submit" className="btn-primary w-full">{TERMINOLOGY.GENERAL.SAVE}</button>
          <div className="grid-2-col gap-10 mt-5">
              <button type="button" className="btn-secondary w-full" onClick={onCancel}>{TERMINOLOGY.GENERAL.CANCEL}</button>
              <button type="button" className="btn-danger w-full" onClick={handleDelete}>{TERMINOLOGY.GENERAL.DELETE}</button>
          </div>
      </div>
    </form>
  );
};