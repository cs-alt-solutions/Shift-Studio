/* src/features/workbench/ConsoleLayout.jsx */
import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY, NAV_LINKS, MARKET_TICKER_DATA } from '../../utils/glossary';
import { DashboardHome } from './DashboardHome';
import { Workshop } from './Workshop';
import { InventoryManager } from './InventoryManager';
import { ProfitMatrix } from './ProfitMatrix';
import { MarketRadar } from './MarketRadar';

// Import our cross-product Beta Engine packages
import { GlitchBot } from '../../packages/beta-engine/GlitchBot';
import { BetaHub } from '../../packages/beta-engine/BetaHub';

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // NEW: State to control the Beta Hub overlay
  const [showBetaHub, setShowBetaHub] = useState(false);

  const handleNavigate = (view) => setActiveView(view);

  // View Router Logic
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome onNavigate={handleNavigate} />;
      case 'workshop': return <Workshop />;
      case 'inventory': return <InventoryManager />;
      case 'matrix': return <ProfitMatrix />;
      case 'radar': return <MarketRadar />;
      default: return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="console-container">
      {/* --- SIDEBAR --- */}
      <div className={`console-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="app-title">
            <span>{TERMINOLOGY.GENERAL.APP_NAME}</span>
          </div>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </button>
        </div>
        
        <div className="nav-group">
          {NAV_LINKS.map((navItem) => {
             const IconComponent = navItem.Icon;
             return (
              <div 
                key={navItem.id}
                className={`nav-link ${activeView === navItem.id ? 'active' : ''}`}
                onClick={() => handleNavigate(navItem.id)}
              >
                <IconComponent />
                <span className="nav-text">
                  {navItem.category ? TERMINOLOGY[navItem.category][navItem.label] : TERMINOLOGY.GENERAL[navItem.label]}
                </span>
              </div>
             );
          })}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        
        <div className="console-content-scroll">
          {renderContent()}
        </div>

        {/* --- GLOBAL BOTTOM BAR --- */}
        <div className="global-bottom-bar bg-panel flex-between align-center px-20 border-top-subtle">
          
          <div className="ticker-container flex-1 overflow-hidden flex-center justify-start">
            <div className="ticker-fixed-label bg-panel-header px-20 font-mono font-tiny text-teal border-right-subtle h-full flex-center z-layer-top">
              STREET_PRICES //
            </div>

            <div className="ticker-scroll-window flex-1 overflow-hidden relative">
              <div className="ticker-scroll flex-center gap-30">
                {MARKET_TICKER_DATA.map((item) => (
                  <div key={item.id} className="ticker-item flex-center gap-5 font-mono font-small">
                    <span className="text-muted">{item.symbol}</span>
                    <span className="text-main">{item.value}</span>
                    <span className={item.trend === 'up' ? 'text-good' : item.trend === 'down' ? 'text-alert' : 'text-muted'}>
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="top-bar-actions flex-center gap-15 pl-20 border-left-subtle">
            {/* NEW: The Beta Tag is now a clickable button to open the Hub */}
            <button 
              className="beta-tag text-orange font-mono font-tiny text-blink bg-row-odd px-10 py-5 border-radius-2 border-subtle clickable glow-orange-hover"
              style={{ border: '1px solid var(--neon-orange)', cursor: 'pointer' }}
              onClick={() => setShowBetaHub(true)}
            >
              ● BETA_ACTIVE // OPEN HUB
            </button>
          </div>
        </div>
      </div>

      {/* --- INJECT THE BETA ENGINE COMPONENTS --- */}
      <GlitchBot currentContext={activeView} />
      
      {showBetaHub && <BetaHub onClose={() => setShowBetaHub(false)} />}

    </div>
  );
};