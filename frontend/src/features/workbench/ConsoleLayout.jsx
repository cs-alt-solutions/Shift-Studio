import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { WorkbenchBoard } from './WorkbenchBoard';
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';

// --- 2D WIREFRAME ICONS (SVG) ---
const Icons = {
  Radar: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  ),
  Lab: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <path d="M10 2h4" />
      <path d="M12 2v4" />
      <path d="M5 21h14" />
      <path d="M6 21l3-11h6l3 11" />
      <path d="M10 13l-1.5 2" />
    </svg>
  ),
  Money: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Menu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
};

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('radar');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="console-container">
      
      {/* --- LEFT NAVIGATION RAIL --- */}
      <div className={`console-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Header & Toggle */}
        <div className="sidebar-header">
          <div className="app-title">
            <span>MARKETLENS v1.0</span>
          </div>
          <button 
            className="toggle-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Icons.Menu /> : <Icons.ChevronLeft />}
          </button>
        </div>
        
        {/* Nav Links */}
        <div className="nav-group">
          <div className="section-label">Main Modules</div>
          
          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveView('radar')}
            title="Vibe Check"
          >
            <Icons.Radar />
            <span className="nav-text">Vibe Check</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveView('workspace')}
            title="The Kitchen"
          >
            <Icons.Lab />
            <span className="nav-text">The Kitchen</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveView('matrix')}
            title="Secure The Bag"
          >
            <Icons.Money />
            <span className="nav-text">Secure The Bag</span>
          </div>
        </div>

      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workspace' && <WorkbenchBoard />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};