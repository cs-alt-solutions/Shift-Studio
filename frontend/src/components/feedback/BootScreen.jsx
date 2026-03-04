/* src/components/feedback/BootScreen.jsx */
import React, { useState, useEffect } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import { GLITCHBOT_DICT } from '../../packages/beta-engine/dictionary'; // CRITICAL IMPORT
import { GlitchBot } from '../../packages/beta-engine/GlitchBot';
import './BootScreen.css';

export const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('landing');
  const [botSequence, setBotSequence] = useState('idle'); 
  const [isStamped, setIsStamped] = useState(false);
  const [status, setStatus] = useState(TERMINOLOGY.BOOT.KERNEL);
  const [isExiting, setIsExiting] = useState(false); 

  // --- THE CINEMATIC SEQUENCE ---
  useEffect(() => {
    if (phase === 'landing') {
      const entranceTimer = setTimeout(() => setBotSequence('entrance'), 500);
      const lookButtonTimer = setTimeout(() => setBotSequence('look-button'), 1500);
      const lookUserTimer = setTimeout(() => setBotSequence('look-user'), 2500);
      const stampTimer = setTimeout(() => {
        setBotSequence('stamp');
        setIsStamped(true);
      }, 3200);

      return () => {
        clearTimeout(entranceTimer); clearTimeout(lookButtonTimer);
        clearTimeout(lookUserTimer); clearTimeout(stampTimer);
      };
    }
  }, [phase]);

  // --- THE LOADING ENGINE ---
  useEffect(() => {
    if (phase === 'loading') {
      const timers = [
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.SECURE), 800),
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.ASSETS), 1600),
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.GRANTED), 2400),
        setTimeout(() => setIsExiting(true), 3200),
        setTimeout(() => onComplete(), 4000)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, onComplete]);

  return (
    <div className={`boot-container ${isExiting ? 'fade-out-main' : ''}`}>
      <div className="ambient-glow bg-splatter-1"></div>
      
      {phase === 'landing' && (
        <div className="pulse-center animate-fade-in text-center z-layer-top">
          <h1 className="boot-logo text-teal mb-15">SHIFT STUDIO</h1>
          <p className="boot-tagline font-mono mb-30">{TERMINOLOGY.GENERAL.TAGLINE}</p>
          
          <div className="boot-action-area relative">
             <div className="button-vault">
                <button 
                  className="btn-primary boot-enter-btn glow-teal font-bold font-mono" 
                  onClick={() => setPhase('loading')}
                >
                   ENTER WORKSPACE
                </button>
                
                {/* STAMP: Now properly using the Dictionary constant */}
                {isStamped && (
                  <div className="beta-stamp-overlay animate-stamp">
                    <div className="stamp-text">
                        {GLITCHBOT_DICT.TERMINOLOGY?.STAMP_TEXT || "BETA WORKSPACE"}
                    </div>
                  </div>
                )}
             </div>

             {/* SEQUENCE ANCHOR: Manages the bot's movements */}
             <div className={`boot-bot-sequence-anchor sequence-${botSequence}`}>
                <GlitchBot 
                    currentContext="BOOT" 
                    autoGreet={false} 
                />
             </div>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="pulse-center animate-fade-in text-center">
          <div className="glow-ring"></div>
          <div className="system-status font-mono">{status}...</div>
        </div>
      )}
    </div>
  );
};