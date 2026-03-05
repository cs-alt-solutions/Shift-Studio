/* src/packages/beta-engine/GlitchBot.jsx */
import React, { useState } from 'react';
import { BotCore } from './components/BotCore';
import { DialogueMenu } from './components/DialogueMenu';
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

  const handleCommandClick = (type) => {
      setActiveMenuType(type);
      setIsMenuOpen(true);
  };

  // --- THE NEW SUBMISSION HANDLER ---
  const handleDialogueSubmit = (payload) => {
      // 1. Log the payload like a high-performance terminal
      console.group("🤖 GLITCHBOT // INCOMING TRANSMISSION");
      console.log(`[ACTION]:  ${payload.type}`);
      console.log(`[SYS_LOC]: ${payload.context.toUpperCase()}`);
      console.log(`[FLAG]:    ${payload.category.toUpperCase()}`);
      console.log(`[DATA]:    "${payload.text}"`);
      console.groupEnd();

      // 2. TODO: Inject Supabase insertion logic here in the future
      // const { error } = await supabase.from('beta_feedback').insert({...})

      // 3. Reset the UI back to idle
      setActiveMenuType(null);
      setIsMenuOpen(false);
  };

  return (
    <div className={`glitchbot-wrapper layout-${layout}`}>
      
      {isMenuOpen && (
        <DialogueMenu 
            currentContext={currentContext} 
            menuType={activeMenuType} 
            onCancel={() => {
                setActiveMenuType(null);
                setIsMenuOpen(false);
            }}
            onSubmit={handleDialogueSubmit} // Wired up the new handler!
        />
      )}

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

          {!isMinimized && (
              <div className="space-terminal-screen">
                  <BotCore expression="idle" interactive={false} />
              </div>
          )}

          <div className="space-terminal-command-deck">
              <button 
                  className={`command-btn text-accent ${activeMenuType === 'FEEDBACK' ? 'active' : ''}`}
                  onClick={() => handleCommandClick('FEEDBACK')}
              >
                  {GLITCHBOT_DICT.COMMAND_DECK.FEEDBACK}
              </button>
              
              <button 
                  className={`command-btn text-teal ${activeMenuType === 'HUB' ? 'active' : ''}`}
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
    </div>
  );
};