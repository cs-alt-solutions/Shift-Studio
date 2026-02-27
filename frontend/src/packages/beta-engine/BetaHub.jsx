/* src/packages/beta-engine/BetaHub.jsx */
import React, { useState } from 'react';
import './BetaHub.css';
import { GLITCHBOT_DICT } from './dictionary';

// NEW: Importing our modular tab components
import { ManifestoTab } from './tabs/ManifestoTab';
import { LabTab } from './tabs/LabTab';
import { VaultTab } from './tabs/VaultTab';

export const BetaHub = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('MANIFESTO');

  const renderContent = () => {
    switch (activeTab) {
      case 'MANIFESTO': return <ManifestoTab />;
      case 'LAB':       return <LabTab />;
      case 'VAULT':     return <VaultTab />;
      default:          return null;
    }
  };

  return (
    <div className="beta-hub-overlay">
      <div className="beta-hub-window">
        
        {/* HEADER & EVOLUTION BAR */}
        <div className="hub-header">
          <div className="font-mono font-bold text-orange">
            {GLITCHBOT_DICT.HUB.TITLE}
          </div>
          
          <div className="evolution-container">
            <div className="evolution-label">
              <span>{GLITCHBOT_DICT.HUB.EVOLUTION_PHASE}</span>
              <span>34% / 100%</span>
            </div>
            <div className="evolution-track">
              <div className="evolution-fill"></div>
            </div>
          </div>

          <button className="btn-icon-hover-clean text-main font-large" onClick={onClose}>
            ×
          </button>
        </div>

        {/* MAIN INTERFACE */}
        <div className="hub-content">
          
          {/* SIDEBAR TABS */}
          <div className="hub-sidebar">
            <button 
              className={`hub-tab ${activeTab === 'MANIFESTO' ? 'active' : ''}`}
              onClick={() => setActiveTab('MANIFESTO')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.MANIFESTO}
            </button>
            <button 
              className={`hub-tab ${activeTab === 'LAB' ? 'active' : ''}`}
              onClick={() => setActiveTab('LAB')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.LAB}
            </button>
            <button 
              className={`hub-tab ${activeTab === 'VAULT' ? 'active' : ''}`}
              onClick={() => setActiveTab('VAULT')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.VAULT}
            </button>
          </div>

          {/* CONTENT PANEL */}
          <div className="hub-main-panel">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};