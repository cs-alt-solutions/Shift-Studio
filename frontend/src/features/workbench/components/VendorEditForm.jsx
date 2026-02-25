/* src/features/workbench/components/VendorEditForm.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY } from '../../../utils/glossary';

export const VendorEditForm = ({ vendor, onClose, onComplete, onCancel }) => {
  const { updateVendor, deleteVendor } = useInventory();

  // Pre-fill the form with existing database values
  const [formData, setFormData] = useState({
    name: vendor.name || '',
    website: vendor.website || '',
    leadTime: vendor.leadTime || '',
    reliability: vendor.reliability || 100,
    contactInfo: vendor.contactInfo || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {
      name: formData.name,
      website: formData.website,
      leadTime: formData.leadTime ? parseInt(formData.leadTime) : null,
      reliability: parseInt(formData.reliability),
      contactInfo: formData.contactInfo
    };
    
    await updateVendor(vendor.id, updates);
    onComplete(updates); 
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to completely remove ${vendor.name} from your Supply Chain?`)) {
      await deleteVendor(vendor.id);
      onClose(); // Force close the sidebar since the vendor is gone
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in mt-15">
      <div className="lab-form-group mb-15">
        <label className="label-industrial">VENDOR NAME</label>
        <input required type="text" className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      </div>

      <div className="lab-form-group mb-15">
        <label className="label-industrial">{TERMINOLOGY.VENDOR.WEBSITE}</label>
        <input type="url" className="input-industrial" placeholder={TERMINOLOGY.VENDOR.URL_PLACEHOLDER} value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
      </div>

      <div className="grid-2-col gap-15 mb-15">
        <div className="lab-form-group">
          <label className="label-industrial">{TERMINOLOGY.VENDOR.LEAD_TIME} (DAYS)</label>
          <input type="number" className="input-industrial" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: e.target.value})} />
        </div>
        <div className="lab-form-group">
          <label className="label-industrial">RELIABILITY (0-100)</label>
          <input required type="number" min="0" max="100" className="input-industrial" value={formData.reliability} onChange={e => setFormData({...formData, reliability: e.target.value})} />
        </div>
      </div>

      <div className="lab-form-group mb-20">
        <label className="label-industrial">{TERMINOLOGY.VENDOR.CONTACT_INFO} & NOTES</label>
        <textarea className="input-industrial" rows="4" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} />
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