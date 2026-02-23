/* src/features/workbench/DashboardHome.jsx */
import React, { useState, useMemo } from 'react';
import './DashboardHome.css';

// Context & Utils
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats } from '../../context/FinancialContext';
import { useStudioIntelligence } from './hooks/useStudioIntelligence'; // Refined Architecture
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, MARKET_TICKER_DATA } from '../../utils/glossary';

// Components
import { StatCard } from '../../components/cards/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { MarketTicker } from '../../components/MarketTicker'; 
import { ProjectBlueprint } from './components/ProjectBlueprint';

// Icons - Cleaned up unused imports to resolve linting warnings
import { 
  Alert, 
  WorkshopIcon, 
  Box, 
  Radar 
} from '../../components/Icons';

export const DashboardHome = () => {
  const { 
    activeProjects = [], 
    draftProjects = [], 
    materials = [], 
    loading: inventoryLoading 
  } = useInventory() || {};

  const { 
    netProfit = 0, 
    totalRev = 0, 
    totalCost = 0,
    loading: financeLoading
  } = useFinancialStats() || {};
  
  // Logic Extraction: Moving heavy calculations to our specialized hook
  const { fleetAnalysis, inventoryIntel, logisticsIntel } = useStudioIntelligence(activeProjects, draftProjects, materials);

  const [workshopTab, setWorkshopTab] = useState('FLEET'); 
  const [invTab, setInvTab] = useState('LOGISTICS'); 
  const [selectedProject, setSelectedProject] = useState(null);

  // Engine 2: Live Ticker Data - Updated to follow the "Clean Slashes" protocol
  const liveTickerData = useMemo(() => {
    const materialTrends = materials.slice(0, 3).map(m => ({
      label: m.name,
      value: `${formatCurrency(m.costPerUnit)} PER ${m.unit.toUpperCase()}`,
      trend: 'neutral'
    }));
    return [...materialTrends, ...MARKET_TICKER_DATA];
  }, [materials]);

  const productionChartData = fleetAnalysis.map(p => ({ label: p.title.substring(0,6), value: p.stockQty }));

  if (inventoryLoading || financeLoading) {
    return (
      <div className="dashboard-container pad-20 text-center flex-center h-full">
         <div className="text-accent font-mono mt-20">{TERMINOLOGY.BOOT.KERNEL}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HUD TOP BAR */}
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
            <span className="status-indicator-dot active"></span> 
            {TERMINOLOGY.DASHBOARD.TELEMETRY}: ONLINE
        </div>
      </div>

      <div className="dashboard-content-scroll">
          <div className="dashboard-grid z-layer-top relative">
            <div className="dashboard-col-main">
                <div className="panel-tabs mb-15">
                     <button className={`tab-btn ${workshopTab === 'FLEET' ? 'active purple' : ''}`} onClick={() => setWorkshopTab('FLEET')}>
                        <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.TAB_FLEET} ({fleetAnalysis.length})
                    </button>
                    <button className={`tab-btn ${workshopTab === 'LAB' ? 'active dormant' : ''}`} onClick={() => setWorkshopTab('LAB')}>
                        <Box /> {TERMINOLOGY.WORKSHOP.TAB_LAB} ({draftProjects.length})
                    </button>
                </div>
                
                {workshopTab === 'FLEET' && (
                    <div className="dashboard-deck">
                        <div className="panel-industrial pad-20">
                            <div className="flex-between mb-10">
                                <span className="label-industrial text-muted">STOCK LEVELS</span>
                                <span className="text-accent font-mono font-small">REAL-TIME</span>
                            </div>
                            {productionChartData.length > 0 ? (
                                <BarChart data={productionChartData} maxVal={50} colorVar="--neon-purple" height={100} />
                            ) : <div className="text-muted italic">No active production.</div>}
                        </div>

                        {fleetAnalysis.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 clickable hover-glow" onClick={() => setSelectedProject(p)}>
                                <div className="project-title-link mb-15">{p.title}</div>
                                <div className="flex-between bg-row-odd p-10 border-radius-2 border-subtle font-mono">
                                    <div className="flex-col">
                                        <span className="text-muted mb-5 font-small">IN STOCK</span>
                                        <span className={`font-bold text-large ${p.health === 'CRITICAL' ? 'text-alert' : 'text-main'}`}>{p.stockQty || 0}</span>
                                    </div>
                                    <div className="flex-col text-center px-15 border-left-subtle border-right-subtle">
                                        <span className="text-muted mb-5 font-small">SOLD</span>
                                        <span className="text-good font-bold text-large">{p.soldQty || 0}</span>
                                    </div>
                                    <div className="flex-col text-right">
                                        <span className="text-muted mb-5 font-small">{TERMINOLOGY.WORKSHOP.CAN_BUILD}</span>
                                        <span className={`font-bold text-large ${p.productionStatus === 'HALTED' ? 'text-alert' : 'text-accent'}`}>
                                            {p.productionStatus === 'HALTED' ? '0' : `+${p.maxBuildable}`}
                                        </span>
                                    </div>
                                </div>
                                {p.productionStatus === 'HALTED' && p.limitingMaterial && (
                                    <div className="mt-15 font-small text-alert flex-center gap-5 justify-start"><Alert /> Bottleneck: {p.limitingMaterial}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {workshopTab === 'LAB' && (
                    <div className="dashboard-deck">
                        {draftProjects.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 opacity-80 clickable hover-glow" onClick={() => setSelectedProject(p)}>
                                <div className="flex-between mb-5">
                                    <span className="font-bold text-muted">{p.title}</span>
                                    <span className="label-industrial no-margin">{TERMINOLOGY.STATUS.DRAFT}</span>
                                </div>
                                <div className="mt-10 p-10 bg-darker border-subtle border-radius-2">
                                    <div className="flex-between align-start">
                                      <div className="font-small text-warning uppercase font-bold tracking-wider">{TERMINOLOGY.WORKSHOP.MISSING}</div>
                                      <div className="flex-wrap gap-5 flex-center justify-end max-w-150">
                                          {(!p.recipe || p.recipe.length === 0) && <span className="status-indicator-dot warning-text font-tiny">RECIPE</span>}
                                          {(!p.brand_specs || !p.brand_specs.label_size) && <span className="status-indicator-dot warning-text font-tiny">BRANDING</span>}
                                          {(!p.retailPrice) && <span className="status-indicator-dot warning-text font-tiny">PRICING</span>}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="dashboard-col-side">
                <div className="panel-industrial full-height-panel">
                    <div className="panel-tabs">
                        <button className={`tab-btn ${invTab === 'LOGISTICS' ? 'active teal' : ''}`} onClick={() => setInvTab('LOGISTICS')}><Radar /> {TERMINOLOGY.LOGISTICS.TAB}</button>
                        <button className={`tab-btn ${invTab === 'CRITICAL' ? 'active alert' : ''}`} onClick={() => setInvTab('CRITICAL')}><Alert /> OUT ({inventoryIntel.out.length})</button>
                    </div>

                    <div className="panel-content no-pad overflow-y-auto">
                        {invTab === 'LOGISTICS' && (
                            <div className="logistics-sim-view">
                                <div className="sim-header pad-20">
                                    <div className="label-industrial text-muted">{TERMINOLOGY.LOGISTICS.CAPACITY}</div>
                                    <div className={`sim-big-number ${logisticsIntel.maxShipments < 20 ? 'text-alert' : 'text-accent'}`}>{Math.floor(logisticsIntel.maxShipments)} <span className="text-muted font-small">PACKAGES</span></div>
                                    {logisticsIntel.maxShipments < 50 && (
                                        <div className="sim-bottleneck mt-10">
                                            <span className="text-warning font-small flex-center gap-5 justify-start"><Alert /> {TERMINOLOGY.LOGISTICS.BOTTLENECK}: {logisticsIntel.limitingFactor}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="logistics-divider" />
                                <div className="pad-20">
                                    <div className="label-industrial mb-10 text-muted">{TERMINOLOGY.LOGISTICS.SIM}</div>
                                    {logisticsIntel.shippingItems.map(m => (
                                        <div key={m.id} className="flex-between mb-5 font-small"><span>{m.name}</span><span className={m.qty < 20 ? 'text-alert font-bold' : 'text-good font-bold'}>{m.qty}</span></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div className="dashboard-footer z-layer-top">
         <MarketTicker items={liveTickerData} />
      </div>

      {selectedProject && <ProjectBlueprint project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
};