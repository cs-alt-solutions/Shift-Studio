/* src/features/workbench/components/TransactionForm.jsx */
import React, { useState } from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';

export const TransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    type: 'EXPENSE', // Default to expense since that's the most common manual entry
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure we are passing a negative value for expenses automatically if we want, 
    // but our current FinancialContext handles Math.abs() on display, so positive is fine.
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
    
    // Clear form if it's a new entry
    if (!initialData) {
      setFormData({ description: '', amount: '', type: 'EXPENSE' });
    }
  };

  return (
    <div className="bg-app">
      <div className="panel-header flex-between">
        <span className="font-bold font-large">
            {initialData ? TERMINOLOGY.FINANCIAL.EDIT_TRANSACTION : TERMINOLOGY.FINANCIAL.NEW_TRANSACTION}
        </span>
      </div>
      <div className="pad-20">
        <form onSubmit={handleSubmit}>
          
          <div className="lab-form-group mb-20">
            <label className="label-industrial">{TERMINOLOGY.FINANCIAL.DESCRIPTION}</label>
            <input 
              type="text" 
              name="description"
              className="input-industrial" 
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={TERMINOLOGY.FINANCIAL.DESC_PLACEHOLDER}
              autoFocus
            />
          </div>

          <div className="flex-between gap-10 mb-20">
              <div className="lab-form-group w-full">
                <label className="label-industrial">{TERMINOLOGY.FINANCIAL.TYPE}</label>
                <select 
                  name="type"
                  className="input-industrial text-large font-bold"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="EXPENSE">{TERMINOLOGY.FINANCIAL.EXPENSE}</option>
                  <option value="INCOME">{TERMINOLOGY.FINANCIAL.INCOME}</option>
                </select>
              </div>

              <div className="lab-form-group w-full">
                <label className="label-industrial">{TERMINOLOGY.FINANCIAL.AMOUNT}</label>
                <input 
                  type="number" 
                  name="amount"
                  className={`input-industrial text-large font-bold text-center ${formData.type === 'EXPENSE' ? 'text-warning' : 'text-good'}`} 
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                />
              </div>
          </div>

          <div className="flex-between gap-10 mt-20 pt-20 border-top-dashed">
            {onCancel && (
              <button type="button" className="btn-ghost w-full" onClick={onCancel}>
                {TERMINOLOGY.GENERAL.CANCEL}
              </button>
            )}
            <button type="submit" className="btn-primary w-full">
              {initialData ? TERMINOLOGY.FINANCIAL.UPDATE : TERMINOLOGY.GENERAL.SAVE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};