/* src/features/workbench/components/BrandingPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';

export const BrandingPanel = ({
  localProject,
  handleUpdate,
  materialCost,
  platformFees,
  netProfit,
  marginPercent
}) => {
  const { economics = {}, brand_specs = {} } = localProject;

  return (
    <div className="engineering-grid-v2 h-full">
      
      {/* --- LEFT COLUMN: PROFIT SIMULATOR --- */}
      <div className="blueprint-card no-margin flex-col h-full">
        <div className="blueprint-card-title">{TERMINOLOGY.BLUEPRINT.PROFIT_SIMULATOR}</div>
        
        <div className="flex-center flex-col mb-20 w-full">
           <label className="label-industrial text-center w-full mb-10">{TERMINOLOGY.BLUEPRINT.RETAIL}</label>
           <input 
              type="number" 
              step="0.01" 
              className="input-chromeless retail-price-input" 
              value={economics.targetRetail || ''} 
              onChange={e => handleUpdate('economics', parseFloat(e.target.value) || 0, 'targetRetail')} 
              placeholder="$0.00" 
           />
        </div>

        <div className="flex-between gap-20 mb-20">
           <div className="flex-col w-full">
              <label className="label-industrial">SHIPPING COST TO YOU</label>
              <input 
                  type="number" 
                  step="0.01" 
                  className="input-industrial" 
                  value={economics.shippingCost || 0} 
                  onChange={e => handleUpdate('economics', parseFloat(e.target.value) || 0, 'shippingCost')} 
              />
           </div>
           <div className="flex-col w-full">
              <label className="label-industrial">PLATFORM FEE (%)</label>
              <input 
                  type="number" 
                  step="0.1" 
                  className="input-industrial" 
                  value={economics.platformFeePercent || 0} 
                  onChange={e => handleUpdate('economics', parseFloat(e.target.value) || 0, 'platformFeePercent')} 
              />
           </div>
        </div>

        <div className="profit-breakdown mt-auto">
           <div className="calc-row">
              <span>{TERMINOLOGY.BLUEPRINT.RAW_MATERIALS}</span>
              <span className="font-mono text-muted">-{formatCurrency(materialCost || 0)}</span>
           </div>
           <div className="calc-row">
              <span>{TERMINOLOGY.BLUEPRINT.SHIPPING_LABEL}</span>
              <span className="font-mono text-muted">-{formatCurrency(economics.shippingCost || 0)}</span>
           </div>
           <div className="calc-row">
              <span>{TERMINOLOGY.BLUEPRINT.PLATFORM_FEES}</span>
              <span className="font-mono text-muted">-{formatCurrency(platformFees || 0)}</span>
           </div>
           <div className="calc-row final">
              <span className="text-neon-teal">{TERMINOLOGY.BLUEPRINT.PROFIT}</span>
              <span className={`font-mono ${netProfit > 0 ? 'text-good' : 'text-alert'}`}>
                 {formatCurrency(netProfit || 0)}
              </span>
           </div>
           <div className="text-center mt-10">
              <span className="label-industrial">{TERMINOLOGY.BLUEPRINT.MARGIN}</span>
              <div className={`text-xl font-bold mt-5 ${marginPercent >= 50 ? 'text-good' : marginPercent >= 25 ? 'text-warning' : 'text-alert'}`}>
                 {marginPercent || 0}%
              </div>
           </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: BRANDING & SPECS --- */}
      <div className="blueprint-card no-margin flex-col h-full">
         <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BRAND_SPECS}</div>

         <div className="flex-between gap-20 mb-20">
             <div className="flex-col w-full">
                <label className="label-industrial">{TERMINOLOGY.WORKSHOP.LABEL_SIZE}</label>
                <input 
                    type="text" 
                    className="input-industrial" 
                    placeholder="e.g. 2x3 Rectangle" 
                    value={brand_specs.label_size || ''} 
                    onChange={e => handleUpdate('brand_specs', e.target.value, 'label_size')} 
                />
             </div>
             <div className="flex-col w-full">
                <label className="label-industrial">{TERMINOLOGY.WORKSHOP.PRIMARY_FONT}</label>
                <input 
                    type="text" 
                    className="input-industrial" 
                    placeholder="e.g. Helvetica" 
                    value={brand_specs.font_main || ''} 
                    onChange={e => handleUpdate('brand_specs', e.target.value, 'font_main')} 
                />
             </div>
         </div>

         <div className="flex-col w-full mb-20">
            <label className="label-industrial">{TERMINOLOGY.WORKSHOP.HEX_COLOR}</label>
            <div className="flex-center gap-10">
                <div 
                  className="color-swatch-wrapper" 
                  style={{ backgroundColor: brand_specs.hex_code || '#ffffff' }}
                >
                    <input 
                        type="color" 
                        className="invisible-color-picker clickable" 
                        value={brand_specs.hex_code || '#ffffff'} 
                        onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} 
                    />
                </div>
                <input 
                    type="text" 
                    className="input-industrial flex-1 font-mono uppercase" 
                    value={brand_specs.hex_code || '#ffffff'} 
                    onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} 
                />
            </div>
         </div>

         <div className="flex-col w-full h-full">
            <label className="label-industrial">{TERMINOLOGY.WORKSHOP.MAKER_NOTES}</label>
            <textarea 
                className="input-industrial textarea-tall flex-1" 
                placeholder="Notes on packaging, brand aesthetics, inspiration..." 
                value={brand_specs.notes || ''} 
                onChange={e => handleUpdate('brand_specs', e.target.value, 'notes')} 
            />
         </div>
      </div>

    </div>
  );
};