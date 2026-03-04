/* packages/beta-engine/GlitchBot.jsx */
import React, { useState, useEffect } from 'react';
import './GlitchBot.css';
import { BotCore } from './components/BotCore';
import { DialogueMenu } from './components/DialogueMenu';

export const GlitchBot = ({ 
  currentContext = "APP", 
  mode = "floating", 
  layout = "anchor-bottom",
  autoGreet = false // New prop to trigger a greeting on first load
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState(null);

  // Automatically open the greeting if autoGreet is passed (e.g., on Dashboard mount)
  useEffect(() => {
    if (autoGreet) {
      const timer = setTimeout(() => setIsOpen(true), 2000); // 2s delay after loading
      return () => clearTimeout(timer);
    }
  }, [autoGreet]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveDialogue(null); 
  };

  const handleReactionClick = (type) => setActiveDialogue(type);
  const handleCancel = () => setActiveDialogue(null);
  
  const handleSubmit = (feedbackData) => {
    console.log("🔥 GLITCHBOT CAPTURED FEEDBACK:", feedbackData);
    setIsOpen(false);
    setActiveDialogue(null);
  };

  return (
    <div className={`glitchbot-wrapper mode-${mode} layout-${layout}`}>
      {isOpen && (
        <DialogueMenu 
            currentContext={currentContext} 
            activeDialogue={activeDialogue} 
            onReactionClick={handleReactionClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
      )}
      <BotCore 
        onClick={handleToggle} 
        showBadge={mode !== "cinematic"}
        scale="normal"
      />
    </div>
  );
};