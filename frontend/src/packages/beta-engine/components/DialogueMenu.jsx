/* src/packages/beta-engine/components/DialogueMenu.jsx */
import React, { useState } from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

/**
 * DIALOGUE_MENU: Refactored to eliminate unused variables and 
 * connect submission logic to the UI.
 */
export const DialogueMenu = ({ 
  currentContext = "APP", 
  activeDialogue, 
  onReactionClick, 
  onSubmit, 
  onCancel // Prop now fully utilized to reset state
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Context Translator
  const normalizedContext = currentContext.toUpperCase().trim();
  const friendlyContext = GLITCHBOT_DICT.CONTEXT_MAP[normalizedContext] || currentContext.toLowerCase();

  // Submission logic for the feedback form
  const handleSend = () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    
    // Simulate a secure sync to the lab
    setTimeout(() => {
      onSubmit({ type: activeDialogue, text, context: currentContext });
      setIsSubmitting(false);
      setText('');
    }, 1500);
  };

  // --- STATE: SYNCING DATA ---
  if (isSubmitting) {
      return (
          <div className="glitchbot-dialogue">
              <div className="text-center py-10">
                  <div className="font-mono text-teal mb-5">{GLITCHBOT_DICT.UI.LOGGING}</div>
                  <div className="text-main font-tiny opacity-60">{GLITCHBOT_DICT.UI.XP_GAIN}</div>
              </div>
          </div>
      );
  }

  // --- STATE: FEEDBACK FORM (Visible after a reaction is clicked) ---
  if (activeDialogue) {
      return (
          <div className="glitchbot-dialogue">
              <div className="dialogue-inner">
                  <div className="mb-15">
                      <span className="font-bold font-mono text-tiny text-teal">
                          // FEEDBACK_MODE: {activeDialogue}
                      </span>
                  </div>
                  
                  <textarea
                      className="feedback-textarea"
                      placeholder={GLITCHBOT_DICT.UI.INPUT_PLACEHOLDER}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      autoFocus
                  />
                  
                  <div className="flex gap-10 mt-15">
                      {/* ESLint Fix: onCancel is now wired to the button */}
                      <button className="btn-cancel flex-1 py-8 font-tiny" onClick={onCancel}>
                          {GLITCHBOT_DICT.UI.BTN_CANCEL}
                      </button>
                      {/* ESLint Fix: handleSend is now wired to the button */}
                      <button 
                        className="btn-submit flex-1 py-8 font-tiny" 
                        onClick={handleSend}
                        disabled={!text.trim()}
                      >
                          {GLITCHBOT_DICT.UI.BTN_SUBMIT}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- STATE: BASE COMMUNICATOR (Speech Bubble) ---
  return (
      <div className="glitchbot-dialogue">
        <div className="dialogue-inner">
            <div className="text-teal font-mono text-tiny font-bold mb-10 opacity-60">
                {GLITCHBOT_DICT.UI.NAME}
            </div>
            
            <div className="mb-20">
               <p className="m-0 text-main font-small line-height-1-6">
                  {GLITCHBOT_DICT.PROMPTS.START} 
                  <span className="text-accent font-bold">{friendlyContext}</span> 
                  {GLITCHBOT_DICT.PROMPTS.END}
               </p>
            </div>

            <div className="reaction-list flex-col">
                <button className="reaction-btn" onClick={() => onReactionClick('OOF')}>
                    {GLITCHBOT_DICT.REACTIONS.OOF}
                </button>
                <button className="reaction-btn" onClick={() => onReactionClick('EYESORE')}>
                    {GLITCHBOT_DICT.REACTIONS.EYESORE}
                </button>
                <button className="reaction-btn" onClick={() => onReactionClick('IDEA')}>
                    {GLITCHBOT_DICT.REACTIONS.IDEA}
                </button>
            </div>
        </div>
      </div>
  );
};