/* src/packages/beta-engine/components/DialogueMenu.jsx */
import React, { useState } from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import './DialogueMenu.css';

export const DialogueMenu = ({ currentContext, menuType, onCancel, onSubmit }) => {
    const [feedbackType, setFeedbackType] = useState('bug');
    const [feedbackText, setFeedbackText] = useState('');

    const handleFeedbackSubmit = () => {
        if (!feedbackText.trim()) return;
        onSubmit({ 
            type: 'FEEDBACK_LOGGED', 
            category: feedbackType, 
            text: feedbackText, 
            context: currentContext 
        });
    };

    // --- 1. THE SMART FEEDBACK FORM ---
    const renderFeedbackForm = () => {
        // Translate the raw context ID (e.g., 'matrix') to the readable name. 
        // Fallback to "Main Console" if unknown.
        const readableContext = GLITCHBOT_DICT.CONTEXT_MAP[currentContext] || "Main Console";

        return (
            <div className="dialogue-panel animate-fade-in">
                <h4 className="dialogue-title text-accent">{GLITCHBOT_DICT.DIALOGUE.FEEDBACK_TITLE}</h4>
                
                {/* THE CONTEXT-AWARE GREETING */}
                <p className="dialogue-subtitle">
                    {GLITCHBOT_DICT.DIALOGUE.FEEDBACK_GREETING_1}
                    <strong className="text-teal">{readableContext}</strong>
                    {GLITCHBOT_DICT.DIALOGUE.FEEDBACK_GREETING_2}
                </p>
                
                <div className="feedback-type-selector mt-15">
                    <button 
                        className={`type-btn ${feedbackType === 'bug' ? 'active' : ''}`} 
                        onClick={() => setFeedbackType('bug')}
                    >
                        {GLITCHBOT_DICT.DIALOGUE.FEEDBACK_BTN_BUG}
                    </button>
                    <button 
                        className={`type-btn ${feedbackType === 'idea' ? 'active' : ''}`} 
                        onClick={() => setFeedbackType('idea')}
                    >
                        {GLITCHBOT_DICT.DIALOGUE.FEEDBACK_BTN_IDEA}
                    </button>
                </div>

                <textarea 
                    className="feedback-textarea" 
                    placeholder={GLITCHBOT_DICT.DIALOGUE.FEEDBACK_PLACEHOLDER}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                />

                <div className="dialogue-actions">
                    <button className="btn-cancel" onClick={onCancel}>{GLITCHBOT_DICT.DIALOGUE.CANCEL}</button>
                    <button className="btn-submit" onClick={handleFeedbackSubmit}>
                        {GLITCHBOT_DICT.DIALOGUE.FEEDBACK_SUBMIT}
                    </button>
                </div>
            </div>
        );
    };

    // --- 2. THE BETA HUB VIEW ---
    const renderHubView = () => (
        <div className="dialogue-panel animate-fade-in">
            <h4 className="dialogue-title text-teal">{GLITCHBOT_DICT.DIALOGUE.HUB_TITLE}</h4>
            <p className="dialogue-subtitle">{GLITCHBOT_DICT.DIALOGUE.HUB_DESC}</p>
            
            <div className="hub-placeholder-card">
                <span className="text-muted text-tiny font-mono">{GLITCHBOT_DICT.DIALOGUE.HUB_VERSION}</span>
            </div>
            
            <div className="dialogue-actions mt-15">
                <button className="btn-cancel w-full" onClick={onCancel}>{GLITCHBOT_DICT.DIALOGUE.CANCEL}</button>
            </div>
        </div>
    );

    // --- 3. THE SYSTEM HELP VIEW ---
    const renderHelpView = () => (
        <div className="dialogue-panel animate-fade-in">
            <h4 className="dialogue-title text-main">{GLITCHBOT_DICT.DIALOGUE.HELP_TITLE}</h4>
            <p className="dialogue-subtitle">{GLITCHBOT_DICT.DIALOGUE.HELP_DESC}</p>
            
            <div className="help-links">
                <button className="help-link-btn">{GLITCHBOT_DICT.DIALOGUE.HELP_DOCS}</button>
                <button className="help-link-btn">{GLITCHBOT_DICT.DIALOGUE.HELP_SUPPORT}</button>
            </div>
            
            <div className="dialogue-actions mt-15">
                <button className="btn-cancel w-full" onClick={onCancel}>{GLITCHBOT_DICT.DIALOGUE.CANCEL}</button>
            </div>
        </div>
    );

    // --- ROUTER ---
    const renderContent = () => {
        switch (menuType) {
            case 'FEEDBACK': return renderFeedbackForm();
            case 'HUB': return renderHubView();
            case 'HELP': return renderHelpView();
            default: return null;
        }
    };

    return (
        <div className="glitchbot-dialogue z-layer-top">
            {renderContent()}
        </div>
    );
};