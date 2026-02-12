/* src/features/workbench/DashboardHome.jsx */
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats } from '../../context/FinancialContext';
import { StatCard } from '../../components/cards/StatCard';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { StampHeader } from '../../components/ui/StampHeader';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { Dial } from '../../components/charts/Dial';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary'; 
import { MARKET_TICKER_DATA } from '../../utils/glossary'; 
import './DashboardHome.css'; 

export const DashboardHome = ({ onNavigate }) => {
  const { projects, materials } = useInventory();
  const { netProfit } = useFinancialStats();
  const [uptime, setUptime] = useState("00:00:00");

  // Telemetry: System Uptime Counter
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const h = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeProjects = projects.filter(p => p.status === 'active');
  const lowStockItems = materials.filter(m => m.qty > 0 && m.qty < 10);
  const outOfStockItems = materials.filter(m => m.qty === 0);

  // Telemetry: Calculated System Load
  const systemLoad = Math.min(Math.floor((activeProjects.length / 10) * 100), 100);

  return (
    <div className="radar-scroll-area scanline-effect">
      <div className="scanline-overlay" />

      {/* TOP TELEMETRY STRIP */}
      <div className="telemetry-strip flex-between mb-20 z-layer-top">
        <div className="flex-center gap-20">
            <div className="telemetry-item">
                <span className="label-industrial font-small">{TERMINOLOGY.DASHBOARD.UPTIME}</span>
                <span className="text-accent font-mono">{uptime}</span>
            </div>
            <div className="telemetry-item">
                <span className="label-industrial font-small">{TERMINOLOGY.DASHBOARD.SYNC}</span>
                <span className="text-good font-mono animate-pulse">STABLE</span>
            </div>
        </div>
        <div className="text-right">
            <span className="label-industrial font-small">NODE_ID: ALTERNATIVE_SOLUTIONS_01</span>
        </div>
      </div>

      <div className="inventory-header z-layer-top">
        <div>
          <h2 className="header-title flicker-heavy">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</h2>
          <span className="header-subtitle">{TERMINOLOGY.DASHBOARD.TELEMETRY}</span>
        </div>
      </div>

      <div className="inventory-metrics z-layer-top">
         <StatCard 
            label={TERMINOLOGY.FINANCE.NET} 
            value={<AnimatedNumber value={netProfit} formatter={formatCurrency} />} 
            glowColor={netProfit >= 0 ? "teal" : "red"} 
            trend={14.2}
            onClick={() => onNavigate('matrix')}
         />
         <StatCard 
            label={TERMINOLOGY.WORKSHOP.ACTIVE_OPS} 
            value={<AnimatedNumber value={activeProjects.length} />} 
            glowColor="purple" 
            trend={5}
            onClick={() => onNavigate('workshop')}
         />
         <div className="panel-industrial flex-center pad-10 min-w-200 hover-glow cursor-pointer">
            <Dial value={systemLoad} label={TERMINOLOGY.DASHBOARD.LOAD} colorVar="--neon-cyan" />
         </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-col-left">
            <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />
            <div className="workshop-grid">
                {activeProjects.map(p => (
                    <ProjectCard 
                        key={p.id} 
                        project={p} 
                        readOnly={true} 
                        showStatus={false} 
                        onClick={() => onNavigate('workshop')} 
                    />
                ))}
            </div>
        </div>

        <div className="dashboard-col-right">
            <div className="panel-industrial scanline-effect">
                <div className="panel-header">
                    <span className="label-industrial pulse-warning">{TERMINOLOGY.INVENTORY.NOTIFICATIONS}</span>
                </div>
                <div className="panel-content no-pad">
                    <table className="inventory-table dashboard-alert-table">
                        <tbody>
                            {outOfStockItems.map(m => (
                                <tr key={m.id} className="inventory-row status-alert" onClick={() => onNavigate('inventory')}>
                                    <td className="td-cell font-bold pulse-critical">{TERMINOLOGY.STATUS.OUT_OF_STOCK}</td>
                                    <td className="td-cell">{m.name}</td>
                                </tr>
                            ))}
                            {lowStockItems.map(m => (
                                <tr key={m.id} className="inventory-row status-warning" onClick={() => onNavigate('inventory')}>
                                    <td className="td-cell text-warning font-bold">{TERMINOLOGY.STATUS.LOW_STOCK}</td>
                                    <td className="td-cell">{m.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

       <div className="mt-20 z-layer-top">
         <div className="panel-industrial pad-10 flex-between">
            <div className="ticker-container w-full">
                <div className="ticker-content">
                    {MARKET_TICKER_DATA.map((item, idx) => (
                        <span key={idx} className="ticker-item font-mono">
                            {item.label} :: <span className={`ticker-value ticker-trend-${item.trend}`}>{item.value}</span>
                        </span>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};