/* src/features/workbench/DashboardHome.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats } from '../../context/FinancialContext';
import { StatCard } from '../../components/cards/StatCard';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, MARKET_TICKER_DATA } from '../../utils/glossary'; 
import { Alert, History, Box, Finance, WorkshopIcon, Radar } from '../../components/Icons';
import './DashboardHome.css'; 

export const DashboardHome = ({ onNavigate }) => {
  const { activeProjects, materials } = useInventory();
  const { netProfit, totalRev, totalCost } = useFinancialStats();
  const [invTab, setInvTab] = useState('LOGISTICS'); // Default to the new simulation view

  // --- LOGIC: INVENTORY INTELLIGENCE & LOGISTICS ENGINE ---
  const { inventoryIntel, logisticsIntel } = useMemo(() => {
    const today = new Date();
    const STAGNANT_THRESHOLD_DAYS = 30;

    // 1. Core Inventory Logic
    const inv = materials.reduce((acc, m) => {
      if (m.qty === 0) acc.out.push(m);
      else if (m.qty < 10) acc.low.push(m);
      else acc.good.push(m);

      if (m.lastUsed) {
        const lastDate = new Date(m.lastUsed);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > STAGNANT_THRESHOLD_DAYS && m.qty > 0) {
          acc.stagnant.push({ ...m, daysInactive: diffDays });
        }
      }
      return acc;
    }, { out: [], low: [], good: [], stagnant: [] });

    // 2. Logistics Simulation Logic (The Bottleneck Engine)
    const shippingItems = materials.filter(m => m.category === 'Shipping');
    
    // We calculate "Shipment Capacity" based on the lowest stock of critical items
    let maxShipments = 9999;
    let limitingFactor = 'None';
    
    // Define critical types needed for 1 shipment
    const criticalTypes = [
        { pattern: /box|mailer/i, name: 'Containers' },
        { pattern: /label/i, name: 'Labels' },
        { pattern: /tape/i, name: 'Tape' } 
    ];

    criticalTypes.forEach(type => {
        const items = shippingItems.filter(m => type.pattern.test(m.name));
        const totalStock = items.reduce((sum, m) => sum + m.qty, 0);
        
        if (totalStock < maxShipments) {
            maxShipments = totalStock;
            limitingFactor = items.length > 0 ? items[0].name : type.name;
        }
    });
    
    if (shippingItems.length === 0) { maxShipments = 0; limitingFactor = "No Data"; }

    return { 
        inventoryIntel: inv, 
        logisticsIntel: { maxShipments, limitingFactor, shippingItems } 
    };
  }, [materials]);

  return (
    <div className="dashboard-container">
      <div className="scanline-overlay" />

      {/* --- SECTOR A: FINANCIAL HUD --- */}
      <div className="hud-top-bar z-layer-top">
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.REVENUE}</div>
            <div className="hud-value text-teal">
                <AnimatedNumber value={totalRev} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.EXPENSE}</div>
            <div className="hud-value text-orange">
                <AnimatedNumber value={totalCost} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.NET}</div>
            <div className={`hud-value ${netProfit >= 0 ? 'text-good' : 'text-alert'}`}>
                <AnimatedNumber value={netProfit} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-spacer" />
        <div className="hud-status">
            <span className="status-indicator-dot active"></span> {TERMINOLOGY.DASHBOARD.TELEMETRY}: ONLINE
        </div>
      </div>

      <div className="dashboard-content-scroll">
          <div className="dashboard-grid z-layer-top relative">
            
            {/* --- SECTOR B: ACTIVE PRODUCTION --- */}
            <div className="dashboard-col-main">
                <div className="panel-header-simple mb-15">
                    <WorkshopIcon /> <span className="ml-10">{TERMINOLOGY.WORKSHOP.ACTIVE_OPS}</span>
                    <span className="badge-count ml-10">{activeProjects.length}</span>
                </div>
                
                <div className="dashboard-deck">
                    {activeProjects.map(p => (
                        <ProjectCard 
                            key={p.id} 
                            project={p} 
                            readOnly={true} 
                            showStatus={true} 
                            onClick={() => onNavigate('workshop')} 
                        />
                    ))}
                     {activeProjects.length === 0 && (
                        <div className="empty-state-panel">
                            <span>{TERMINOLOGY.GENERAL.NO_DATA}</span>
                            <button className="btn-ghost mt-10" onClick={() => onNavigate('workshop')}>
                                + {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SECTOR C: INTELLIGENCE CENTER --- */}
            <div className="dashboard-col-side">
                <div className="panel-industrial full-height-panel">
                    <div className="panel-tabs">
                        <button 
                            className={`tab-btn ${invTab === 'LOGISTICS' ? 'active teal' : ''}`}
                            onClick={() => setInvTab('LOGISTICS')}
                        >
                            <Radar /> {TERMINOLOGY.LOGISTICS.TAB}
                        </button>
                        <button 
                            className={`tab-btn ${invTab === 'CRITICAL' ? 'active alert' : ''}`}
                            onClick={() => setInvTab('CRITICAL')}
                        >
                            <Alert /> OUT ({inventoryIntel.out.length})
                        </button>
                    </div>

                    <div className="panel-content no-pad overflow-y-auto">
                        
                        {/* 1. THE LOGISTICS SIMULATION VIEW */}
                        {invTab === 'LOGISTICS' && (
                            <div className="logistics-sim-view">
                                <div className="sim-header pad-20">
                                    <div className="label-industrial text-muted">{TERMINOLOGY.LOGISTICS.CAPACITY}</div>
                                    <div className={`sim-big-number ${logisticsIntel.maxShipments < 20 ? 'text-alert' : 'text-accent'}`}>
                                        {Math.floor(logisticsIntel.maxShipments)} <span className="text-muted font-small">PACKAGES</span>
                                    </div>
                                    {logisticsIntel.maxShipments < 50 && (
                                        <div className="sim-bottleneck">
                                            <span className="text-warning">⚠ {TERMINOLOGY.LOGISTICS.BOTTLENECK}:</span>
                                            <span className="font-bold ml-5">{logisticsIntel.limitingFactor}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="logistics-divider" />
                                <div className="pad-20">
                                    <div className="label-industrial mb-10 text-muted">{TERMINOLOGY.LOGISTICS.SIM}</div>
                                    <table className="inventory-table simple">
                                        <tbody>
                                            {logisticsIntel.shippingItems.map(m => (
                                                <tr key={m.id} className="inventory-row">
                                                    <td className="td-cell">{m.name}</td>
                                                    <td className={`td-cell text-right font-mono ${m.qty < 20 ? 'text-alert' : 'text-good'}`}>
                                                        {m.qty} {m.unit}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 2. THE CRITICAL STOCK VIEW */}
                        {invTab === 'CRITICAL' && (
                            inventoryIntel.out.length > 0 ? (
                                <table className="inventory-table dashboard-alert-table">
                                    <tbody>
                                        {inventoryIntel.out.map(m => (
                                            <tr key={m.id} className="inventory-row status-alert clickable" onClick={() => onNavigate('inventory')}>
                                                <td className="td-cell font-bold text-alert">{m.name}</td>
                                                <td className="td-cell text-right">0 {m.unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="good-state">
                                    <Box className="opacity-50 mb-10" />
                                    NO CRITICAL SHORTAGES
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>

      {/* --- FOOTER: TICKER --- */}
       <div className="dashboard-footer z-layer-top">
         <div className="ticker-panel">
            <div className="ticker-label"><Finance /> MARKET DATA //</div>
            <div className="ticker-wrap">
                <div className="ticker-move">
                    {[...MARKET_TICKER_DATA, ...MARKET_TICKER_DATA].map((item, idx) => (
                        <div key={idx} className="ticker-item">
                            <span className="label-industrial no-margin text-muted">{item.label}</span> 
                            <span className={`ticker-value ticker-trend-${item.trend} font-mono ml-10`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};