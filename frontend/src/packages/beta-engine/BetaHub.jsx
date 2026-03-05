/* src/packages/beta-engine/GlitchBot.jsx */
import React, { useState } from 'react';
import { BotCore } from './components/BotCore';
import { DialogueMenu } from './components/DialogueMenu';
import { BetaHub } from './BetaHub';
import { GLITCHBOT_DICT } from './dictionary';
import './GlitchBot.css';

export const GlitchBot = ({ 
    currentContext = "APP", 
    autoGreet = false, 
    layout = "anchor-bottom" 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(autoGreet); 
  const [isMinimized, setIsMinimized] = useState(false); 
  const [activeMenuType, setActiveMenuType] = useState(null); 
  const [showFullHub, setShowFullHub] = useState(false); // Controls the massive Hub overlay

  // --- THE SMART COMMAND ROUTER ---
  const handleCommandClick = (type) => {
      if (type === 'HUB') {
          // Launch the full Hub and close the tiny menu
          setShowFullHub(true);
          setIsMenuOpen(false);
          setActiveMenuType(null);
      } else {
          // Open the tiny context menus (Feedback / Help)
          setActiveMenuType(type);
          setIsMenuOpen(true);
      }
  };

  // --- THE SUBMISSION HANDLER ---
  const handleDialogueSubmit = (payload) => {
      // 1. Log the payload like a high-performance terminal
      console.group("🤖 GLITCHBOT // INCOMING TRANSMISSION");
      console.log(`[ACTION]:  ${payload.type}`);
      console.log(`[SYS_LOC]: ${payload.context.toUpperCase()}`);
      console.log(`[FLAG]:    ${payload.category.toUpperCase()}`);
      console.log(`[DATA]:    "${payload.text}"`);
      console.groupEnd();

      // 2. TODO: Inject Supabase insertion logic here in the future

      // 3. Reset the UI back to idle
      setActiveMenuType(null);
      setIsMenuOpen(false);
  };

  return (
    <div className={`glitchbot-wrapper layout-${layout}`}>
      
      {/* THE DYNAMIC DIALOGUE BUBBLE */}
      {isMenuOpen && (
        <DialogueMenu 
            currentContext={currentContext} 
            menuType={activeMenuType} 
            onCancel={() => {
                setActiveMenuType(null);
                setIsMenuOpen(false);
            }}
            onSubmit={handleDialogueSubmit} 
        />
      )}

      {/* THE UNIFIED COMMAND MODULE */}
      <div className="space-terminal-container animate-slide-up">
          
          <div className="space-terminal-header">
              <span className="terminal-title text-teal text-tiny">GlitchBot Comm Link</span>
              <button 
                  className="terminal-minimize-btn" 
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand Feed" : "Collapse Feed"}
              >
                  {isMinimized ? '□' : '−'}
              </button>
          </div>

          {/* THE VIDEO FEED */}
          {!isMinimized && (
              <div className="space-terminal-screen">
                  <BotCore expression="idle" interactive={false} />
              </div>
          )}

          {/* THE HORIZONTAL COMMAND DECK */}
          <div className="space-terminal-command-deck">
              <button 
                  className={`command-btn text-accent ${activeMenuType === 'FEEDBACK' ? 'active' : ''}`}
                  onClick={() => handleCommandClick('FEEDBACK')}
              >
                  {GLITCHBOT_DICT.COMMAND_DECK.FEEDBACK}
              </button>
              
              <button 
                  className={`command-btn text-teal ${showFullHub ? 'active' : ''}`}
                  onClick={() => handleCommandClick('HUB')}
              >
                  {GLITCHBOT_DICT.COMMAND_DECK.COMMUNITY}
              </button>
              
              <button 
                  className={`command-btn text-main ${activeMenuType === 'HELP' ? 'active' : ''}`}
                  onClick={() => handleCommandClick('HELP')}
              >
                  {GLITCHBOT_DICT.COMMAND_DECK.HELP}
              </button>
          </div>

      </div>

      {/* THE MASSIVE BETA HUB OVERLAY */}
      {showFullHub && <BetaHub onClose={() => setShowFullHub(false)} />}
      
    </div>
  );
};