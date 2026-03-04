/* src/packages/beta-engine/admin/TheBridge.jsx */
import React, { useState, useMemo } from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import '../tabs/VaultTab.css'; 

export const TheBridge = () => {
  const { BRIDGE, LAB } = GLITCHBOT_DICT.HUB;
  const { REACTIONS } = GLITCHBOT_DICT;
  
  const [activeBucket, setActiveBucket] = useState('ALL');
  const [selectedOperative, setSelectedOperative] = useState(null);

  const buckets = ['ALL', 'DASHBOARD', 'WORKSHOP', 'INVENTORY', 'PROFIT MATRIX'];

  const triageBoard = useMemo(() => {
    const filteredLogs = LAB.MOCK_TRANSMISSIONS.filter(
      tx => activeBucket === 'ALL' || tx.context === activeBucket
    );
    return {
      LIGHTBULB: filteredLogs.filter(tx => tx.type === 'LIGHTBULB'),
      OOF: filteredLogs.filter(tx => tx.type === 'OOF'),
      EYESORE: filteredLogs.filter(tx => tx.type === 'EYESORE')
    };
  }, [activeBucket, LAB.MOCK_TRANSMISSIONS]);

  const TransmissionCard = ({ tx, borderColor }) => (
    <div className={`bg-row-odd p-15 border-radius-2 border-subtle border-left-${borderColor} mb-10`}>
      <div className="flex-between mb-5">
        <button 
          className="font-bold text-main btn-icon-hover-clean" 
          onClick={() => setSelectedOperative(tx.user)}
        >
          {tx.user}
        </button>
        <span className="font-tiny text-muted">{tx.time}</span>
      </div>
      <div className="font-small text-muted mb-10">"{tx.message}"</div>
      <div className="flex gap-10">
        <button className="btn-primary flex-1 py-5 font-tiny">{BRIDGE.ACTIONS.APPROVE}</button>
        <button className="btn-ghost flex-1 py-5 font-tiny text-alert border-alert">{BRIDGE.ACTIONS.REJECT}</button>
      </div>
    </div>
  );

  return (
    <div className="vault-container animate-fade-in">
      <div className="vault-header border-bottom-subtle pb-15 mb-20 flex-between">
        <h2 className="font-mono text-neon-teal m-0">{BRIDGE.HEADER_TITLE}</h2>
        <div className="flex gap-15">
          <div className="stat-pill border-teal text-teal">
            {BRIDGE.STATS.ACTIVE_USERS}: 12
          </div>
          <div className="stat-pill border-orange text-orange">
            {BRIDGE.STATS.PENDING_TICKETS}: {LAB.MOCK_TRANSMISSIONS.length}
          </div>
        </div>
      </div>

      <div className="grid-2-col gap-20">
        
        {/* LEFT: THE BUCKET TRIAGE */}
        <div className="panel-industrial p-15 flex-col gap-10">
          <div className="flex-between align-end border-bottom-subtle pb-5 m-0 mb-10">
            <h3 className="label-industrial text-main m-0">{BRIDGE.SECTIONS.QUEUE}</h3>
            <span className="font-tiny text-muted font-mono">SORTING BY: BUCKET</span>
          </div>

          <div className="selector-group overflow-x-auto mb-10">
             {buckets.map(b => (
                 <button 
                    key={b} type="button" 
                    className={`btn-selector ${activeBucket === b ? 'active' : ''}`}
                    onClick={() => setActiveBucket(b)}
                 >
                    {b}
                 </button>
             ))}
          </div>
          
          <div className="flex-col gap-20 overflow-y-auto max-h-500 pr-5">
            {triageBoard.LIGHTBULB.length > 0 && (
              <div className="triage-section">
                <h4 className="label-industrial text-teal mb-10 border-bottom-subtle pb-5 m-0">{REACTIONS.IDEA}</h4>
                {triageBoard.LIGHTBULB.map(tx => <TransmissionCard key={tx.id} tx={tx} borderColor="teal" />)}
              </div>
            )}
            {triageBoard.OOF.length > 0 && (
              <div className="triage-section mt-10">
                <h4 className="label-industrial text-orange mb-10 border-bottom-subtle pb-5 m-0">{REACTIONS.OOF}</h4>
                {triageBoard.OOF.map(tx => <TransmissionCard key={tx.id} tx={tx} borderColor="orange" />)}
              </div>
            )}
            {triageBoard.EYESORE.length > 0 && (
              <div className="triage-section mt-10">
                <h4 className="label-industrial text-purple mb-10 border-bottom-subtle pb-5 m-0">{REACTIONS.EYESORE}</h4>
                {triageBoard.EYESORE.map(tx => <TransmissionCard key={tx.id} tx={tx} borderColor="purple" />)}
              </div>
            )}
            {triageBoard.LIGHTBULB.length === 0 && triageBoard.OOF.length === 0 && triageBoard.EYESORE.length === 0 && (
              <div className="text-center p-20 text-muted italic font-small border-subtle border-radius-2 bg-row-even">
                No logs found in this bucket. The system is flawless... for now.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ROSTER & TALENT RADAR */}
        <div className="flex-col gap-20">
          
          <div className="panel-industrial p-15 flex-col gap-15">
            <h3 className="label-industrial text-main border-bottom-subtle pb-5 m-0">
              {BRIDGE.SECTIONS.ROSTER}
            </h3>
            
            {selectedOperative ? (
                <div className="bg-bg-app p-15 border-radius-2 border-teal border-subtle animate-fade-in">
                    <div className="flex-between mb-10">
                        <h4 className="m-0 text-neon-teal font-mono">{selectedOperative}</h4>
                        <button className="btn-icon-hover-clean text-muted" onClick={() => setSelectedOperative(null)}>×</button>
                    </div>
                    <div className="grid-2-col gap-10 mb-10">
                        <div className="bg-row-odd p-10 border-radius-2"><div className="font-tiny text-muted">XP LEVEL</div><div className="font-bold">LVL 4 (2450 XP)</div></div>
                        <div className="bg-row-odd p-10 border-radius-2"><div className="font-tiny text-muted">LOG QUALITY</div><div className="text-good font-bold">94% ACTIONABLE</div></div>
                    </div>
                    <div className="font-small text-muted mb-15">This operative consistently identifies backend friction points before they cascade. High potential for systems architecture role.</div>
                    <button className="btn-ghost w-full py-10 text-teal border-teal font-small">FLAG FOR RECRUITMENT</button>
                </div>
            ) : (
                <div className="flex-col gap-5 max-h-300 overflow-y-auto pr-5">
                {LAB.MOCK_LEADERBOARD.map(user => (
                    <div 
                        key={user.rank} 
                        className="flex-between bg-bg-app p-10 border-radius-2 border-subtle cursor-pointer hover-border-teal transition-all"
                        onClick={() => setSelectedOperative(user.name)}
                    >
                    <div className="flex-col">
                        <span className="font-bold text-main">{user.name}</span>
                        <span className="font-tiny text-teal">{user.xp} XP // {user.badge}</span>
                    </div>
                    <span className="font-tiny text-muted">Profile ↗</span>
                    </div>
                ))}
                </div>
            )}
          </div>

          <div className="panel-industrial p-15 flex-col gap-15">
            <h3 className="label-industrial text-main border-bottom-subtle pb-5 m-0">
              {BRIDGE.SECTIONS.BROADCAST}
            </h3>
            <textarea className="input-industrial w-full font-small" rows="3" placeholder="Deploy a system-wide transmission..." />
            <button className="btn-primary w-full py-10 font-small">{BRIDGE.ACTIONS.SEND}</button>
          </div>

        </div>

      </div>
    </div>
  );
};