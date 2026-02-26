/* src/components/feedback/BootScreen.jsx */
import React, { useState, useEffect } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import './BootScreen.css';

export const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('landing');
  const [status, setStatus] = useState(TERMINOLOGY.BOOT.KERNEL);
  const [hasAgreed, setHasAgreed] = useState(false);
  
  // NEW: State to trigger the smooth exit animation
  const [isExiting, setIsExiting] = useState(false); 

  useEffect(() => {
    if (phase === 'loading') {
      const timer1 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.SECURE), 800);
      const timer2 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.ASSETS), 1600);
      const timer3 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.GRANTED), 2400);
      
      // Step 1: Start the cinematic fade-out
      const timer4 = setTimeout(() => setIsExiting(true), 3200); 
      
      // Step 2: Wait for the fade to finish (800ms), THEN load the dashboard
      const timer5 = setTimeout(() => onComplete(), 4000); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [phase, onComplete]);

  return (
    // NEW: We apply the 'fade-out-main' class when isExiting becomes true
    <div className={`boot-container ${isExiting ? 'fade-out-main' : ''}`}>
      <div className="ambient-glow bg-splatter-1"></div>
      <div className="ambient-glow bg-splatter-2"></div>
      
      {/* PHASE 1: THE FRONT DOOR */}
      {phase === 'landing' && (
        <div className="pulse-center animate-fade-in text-center z-layer-top">
          <h1 className="boot-logo text-teal mb-15">
            <span className="shift-effect" data-text={TERMINOLOGY.GENERAL.APP_NAME.split(' ')[0]}>
              {TERMINOLOGY.GENERAL.APP_NAME.split(' ')[0]}
            </span> 
            {' ' + TERMINOLOGY.GENERAL.APP_NAME.split(' ').slice(1).join(' ')}
          </h1>
          <p className="boot-tagline font-mono mb-15">
            {TERMINOLOGY.GENERAL.TAGLINE}
          </p>
          <p className="boot-subtitle text-muted mb-30">
            BY ALTERNATIVE SOLUTIONS
          </p>
          <button className="btn-primary boot-enter-btn glow-teal font-bold font-mono" onClick={() => setPhase('agreement')}>
            ENTER WORKSPACE
          </button>
        </div>
      )}

      {/* PHASE 2: THE VIP ONBOARDING */}
      {phase === 'agreement' && (
        <div className="pulse-center animate-fade-in z-layer-top w-full px-20">
          <div className="beta-glass-card">
            
            <div className="flex-center flex-col mb-25 text-center">
               <span className="badge-purple mb-10">{TERMINOLOGY.GENERAL.VERSION}</span>
               <h2 className="text-main m-0 font-light letter-spacing-1">{TERMINOLOGY.BETA_AGREEMENT.TITLE}</h2>
               <p className="text-teal font-mono font-small mt-10 letter-spacing-1">
                 {TERMINOLOGY.BETA_AGREEMENT.SUBTITLE}
               </p>
            </div>
            
            <div className="vip-card-grid mb-30">
              <div className="vip-card border-alert">
                <span className="vip-card-title text-alert">{TERMINOLOGY.BETA_AGREEMENT.THE_PROBLEM_TITLE}</span>
                <span className="vip-card-text">{TERMINOLOGY.BETA_AGREEMENT.THE_PROBLEM_TEXT}</span>
              </div>

              <div className="vip-card border-teal">
                <span className="vip-card-title text-teal">{TERMINOLOGY.BETA_AGREEMENT.THE_SOLUTION_TITLE}</span>
                <span className="vip-card-text">{TERMINOLOGY.BETA_AGREEMENT.THE_SOLUTION_TEXT}</span>
              </div>

              <div className="vip-card border-purple">
                <span className="vip-card-title text-purple">{TERMINOLOGY.BETA_AGREEMENT.THE_MISSION_TITLE}</span>
                <span className="vip-card-text">{TERMINOLOGY.BETA_AGREEMENT.THE_MISSION_TEXT}</span>
              </div>
            </div>
            
            <label className="neon-checkbox-container mb-25">
              <input 
                type="checkbox" 
                checked={hasAgreed} 
                onChange={(e) => setHasAgreed(e.target.checked)} 
              />
              <span className="neon-checkmark"></span>
              <span className="neon-checkbox-text">{TERMINOLOGY.BETA_AGREEMENT.CONFIRMATION}</span>
            </label>

            <button 
              className={`btn-primary w-full py-15 font-bold letter-spacing-2 transition-all ${hasAgreed ? 'glow-teal' : 'btn-disabled'}`} 
              onClick={() => setPhase('loading')}
              disabled={!hasAgreed}
            >
              {hasAgreed ? "START BUILDING" : "AWAITING CONFIRMATION..."}
            </button>

          </div>
        </div>
      )}

      {/* PHASE 3: THE LOADING SEQUENCE */}
      {phase === 'loading' && (
        <div className="pulse-center animate-fade-in z-layer-top">
          <div className="glow-ring"></div>
          <div className="system-status font-mono">{status}</div>
        </div>
      )}

    </div>
  );
};