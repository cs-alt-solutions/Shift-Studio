import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { DashboardHome } from './DashboardHome';
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';
import { InventoryManager } from './InventoryManager';
import { Workshop } from './Workshop';
import { Radar, WorkshopIcon, Box, Finance, Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY } from '../../utils/glossary';

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullWidthMode, setIsFullWidthMode] = useState(false);

  const sidebarCollapsed = isCollapsed || isFullWidthMode;

  const handleNavigate = (view) => {
    setActiveView(view);
    setIsFullWidthMode(false);
  };

  return (
    <div className="console-container">
      
      <div className={`console-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="app-title">
            <span>{TERMINOLOGY.GENERAL.APP_NAME} {TERMINOLOGY.GENERAL.VERSION}</span>
          </div>
          <button 
            className="toggle-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </button>
        </div>
        
        <div className="nav-group">
          <div className="section-label">{TERMINOLOGY.GENERAL.MODULES || "SECTIONS"}</div>
          
          <div 
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <DashboardIcon />
            <span className="nav-text">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workshop' ? 'active' : ''}`}
            onClick={() => handleNavigate('workshop')}
          >
            <WorkshopIcon />
            <span className="nav-text">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => handleNavigate('inventory')}
          >
            <Box />
            <span className="nav-text">{TERMINOLOGY.INVENTORY.HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => handleNavigate('matrix')}
          >
            <Finance />
            <span className="nav-text">{TERMINOLOGY.FINANCE.HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => handleNavigate('radar')}
          >
            <Radar />
            <span className="nav-text">{TERMINOLOGY.MARKET.HEADER}</span>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-compliance-footer">
            <p className="compliance-text">
              The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
            </p>
          </div>
        )}
      </div>

      <div className="console-main">
        {activeView === 'dashboard' && <DashboardHome onNavigate={handleNavigate} />}
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workshop' && <Workshop />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};