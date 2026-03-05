/* src/packages/beta-engine/components/GlitchBotCommsLink.jsx */
import React, { useState, useEffect } from 'react';
import { BotCore } from './BotCore';
import { GLITCHBOT_DICT } from '../dictionary';

export const GlitchBotCommsLink = ({ delay = 600 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = GLITCHBOT_DICT.PROMPTS.BOOT_SEQUENCE;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typedText.length < fullText.length) {
      const typeTimer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(typeTimer);
    }
  }, [isVisible, typedText, fullText]);

  if (!isVisible) return null;

  return (
    <div className="space-terminal-container crt-power-on mx-auto">
        
        {/* Removed font-mono and the // */}
        <div className="space-terminal-header">
            <span className="terminal-title text-teal text-tiny">GlitchBot Comm Link</span>
            <span className="blink text-accent text-tiny">●</span>
        </div>
        
        <div className="space-terminal-screen">
            <BotCore expression="idle" interactive={false} />
        </div>
        
        {/* Removed font-mono and the blinking cursor entirely */}
        <div className="space-terminal-text-deck text-tiny">
            <span className="text-main">{typedText}</span>
        </div>

    </div>
  );
};