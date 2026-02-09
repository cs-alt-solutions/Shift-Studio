/* src/features/workbench/ProfitMatrix.jsx */
import React, { useState } from 'react';
import './ConsoleLayout.css';

export const ProfitMatrix = () => {
  const [salePrice, setSalePrice] = useState(120);
  const [materialCost, setMaterialCost] = useState(45);
  const [shippingCost, setShippingCost] = useState(8.50);

  const etsyFee = salePrice * 0.095; 
  const profit = salePrice - materialCost - shippingCost - etsyFee;
  const margin = (profit / salePrice) * 100;

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        <div className="section-header-row">
          <h2 className="section-title" style={{fontSize: '2rem'}}>PROFIT MATRIX</h2>
        </div>

        <div className="cockpit-grid" style={{marginBottom: '40px'}}>
          <div className="timeframe-tag">LIVE SIMULATION</div>
          <div className="cockpit-dial-wrapper">
            <div className="dial-value" style={{color: profit > 0 ? 'var(--neon-teal)' : 'var(--neon-orange)'}}>
              ${profit.toFixed(2)}
            </div>
            <div className="dial-label">EST. NET PROFIT</div>
          </div>
          <div className="cockpit-dial-wrapper">
            <div className="dial-value">${etsyFee.toFixed(2)}</div>
            <div className="dial-label">PLATFORM FEES</div>
          </div>
          <div className="cockpit-dial-wrapper">
            <div className="dial-value">${(materialCost + shippingCost).toFixed(2)}</div>
            <div className="dial-label">TOTAL OVERHEAD</div>
          </div>
        </div>

        <div className="ops-grid">
          <div className="ops-panel" style={{borderLeftColor: 'var(--neon-cyan)'}}>
            <div className="ops-panel-inner">
              <h3 className="panel-title">REVENUE</h3>
              <div style={{marginTop: '20px'}}>
                <label className="mini-label">Target Sale Price ($)</label>
                <input 
                  type="number" 
                  className="tag-row" 
                  style={{width:'100%', background:'transparent', border:'1px solid var(--border-subtle)', color:'white', marginTop: '10px'}} 
                  value={salePrice} 
                  onChange={(e) => setSalePrice(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>

          <div className="ops-panel" style={{borderLeftColor: 'var(--neon-purple)'}}>
            <div className="ops-panel-inner">
              <h3 className="panel-title">PRODUCTION</h3>
              <div style={{marginTop: '20px'}}>
                <label className="mini-label">Material Cost ($)</label>
                <input 
                  type="number" 
                  className="tag-row" 
                  style={{width:'100%', background:'transparent', border:'1px solid var(--border-subtle)', color:'white', marginTop: '10px'}} 
                  value={materialCost} 
                  onChange={(e) => setMaterialCost(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>

          <div className="ops-panel" style={{borderLeftColor: 'var(--neon-blue)'}}>
            <div className="ops-panel-inner">
              <h3 className="panel-title">LOGISTICS</h3>
              <div style={{marginTop: '20px'}}>
                <label className="mini-label">Est. Shipping ($)</label>
                <input 
                  type="number" 
                  className="tag-row" 
                  style={{width:'100%', background:'transparent', border:'1px solid var(--border-subtle)', color:'white', marginTop: '10px'}} 
                  value={shippingCost} 
                  onChange={(e) => setShippingCost(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="keyword-sidebar">
        <div className="keyword-header">
          <h3 style={{color: 'var(--neon-cyan)', fontSize:'1rem', letterSpacing:'1px', textTransform:'uppercase'}}>
            DATA BREAKDOWN
          </h3>
        </div>
        <div className="keyword-list">
          <div className="tag-row">
            <div className="tag-row-content">
              <span style={{fontFamily:'Inter, monospace', fontWeight:'600'}}>Profit Margin</span>
              <span style={{color: margin > 20 ? 'var(--neon-teal)' : 'var(--neon-orange)', fontWeight: '800'}}>
                {margin.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="tag-row">
            <div className="tag-row-content">
              <span>Etsy Fee (9.5%)</span>
              <span className="tag-score-val">${etsyFee.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};