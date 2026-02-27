/* src/packages/beta-engine/GlitchBot.jsx */
import React, { useState } from 'react';
import './GlitchBot.css';
import { GLITCHBOT_DICT } from './dictionary'; 

export const GlitchBot = ({ currentContext = "APP" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveDialogue(null); 
  };

  const handleFeedback = (type) => {
    setActiveDialogue(type);
    
    // Simulate logging to the Beta Database to track XP
    setTimeout(() => {
        setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="glitchbot-wrapper">
      
      {isOpen && (
        <div className="glitchbot-dialogue">
          {!activeDialogue ? (
              <>
                <div className="dialogue-text">
                   <span className="text-teal font-bold font-mono">{GLITCHBOT_DICT.UI.NAME}</span>
                   <br/>
                   {GLITCHBOT_DICT.PROMPTS.START} 
                   <strong className="text-accent uppercase">{currentContext}</strong> 
                   {GLITCHBOT_DICT.PROMPTS.END}
                </div>
                <button className="reaction-btn oof" onClick={() => handleFeedback('OOF')}>
                    {GLITCHBOT_DICT.REACTIONS.OOF}
                </button>
                <button className="reaction-btn eyesore" onClick={() => handleFeedback('EYESORE')}>
                    {GLITCHBOT_DICT.REACTIONS.EYESORE}
                </button>
                <button className="reaction-btn lightbulb" onClick={() => handleFeedback('IDEA')}>
                    {GLITCHBOT_DICT.REACTIONS.IDEA}
                </button>
              </>
          ) : (
              <div className="dialogue-text text-center text-teal font-mono">
                  {GLITCHBOT_DICT.UI.LOGGING} <br/>
                  <span className="text-main font-small">{GLITCHBOT_DICT.UI.XP_GAIN}</span>
              </div>
          )}
        </div>
      )}

      <div className="glitchbot-core-container">
          <div className="bot-id-badge">
              {GLITCHBOT_DICT.UI.BADGE}
          </div>

          <div className="glitchbot-core" onClick={handleToggle}>
              <div className="bot-arm left"></div>
              
              <div className="bot-eyes">
                  <div className="bot-eye"></div>
                  <div className="bot-eye"></div>
              </div>

              <div className="bot-arm right"></div>
          </div>
      </div>
      
    </div>
  );
};