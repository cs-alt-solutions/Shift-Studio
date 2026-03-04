/* src/packages/beta-engine/PublicBlueprint.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from './dictionary';
import { BotCore } from './components/BotCore';
import './tabs/BlueprintTab.css'; // You can rename this CSS file to BlueprintTab.css later

export const PublicBlueprint = () => {
  const { BLUEPRINT } = GLITCHBOT_DICT.HUB;

  return (
    <div className="bg-bg-app min-h-screen flex-center p-20">
      <div className="max-w-800 w-full animate-fade-in">
        
        {/* HEADER */}
        <div className="text-center mb-40">
          <div className="font-mono text-neon-teal letter-spacing-2 mb-10 font-bold">
            // ALTERNATIVE SOLUTIONS
          </div>
          <h1 className="text-main font-xlarge m-0 text-shadow-glow">
            {BLUEPRINT.HEADING}
          </h1>
        </div>

        {/* SECTION 1: THE MISSION */}
        <div className="panel-industrial p-30 mb-40 border-left-teal">
          <div className="text-muted font-large line-height-1-5 mb-20">
            <p className="mb-15">{BLUEPRINT.BODY_1}</p>
            <p className="text-main font-bold">{BLUEPRINT.BODY_2}</p>
          </div>
        </div>

        {/* SECTION 2: THE RULES */}
        <div className="mb-40">
            <h3 className="font-mono text-teal mb-20 letter-spacing-1 border-bottom-subtle pb-10">
              {BLUEPRINT.RULES_HEADING}
            </h3>
            <div className="grid-2-col gap-20">
                {BLUEPRINT.RULES.map(rule => (
                    <div key={rule.id} className="bg-row-odd p-20 border-radius-2 border-subtle hover-border-teal transition-all">
                        <div className="font-mono text-teal font-large mb-10 opacity-50">0{rule.id}</div>
                        <h4 className="text-main m-0 mb-10 font-bold">{rule.title}</h4>
                        <p className="text-muted font-small m-0 line-height-1-5">{rule.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION 3: THE LORE */}
        <div className="panel-industrial p-30 flex gap-30 align-center mb-40 bg-darker">
          <div className="flex-shrink-0">
            <BotCore scale="large" interactive={true} />
          </div>
          
          <div>
            <div className="badge-purple mb-10">{BLUEPRINT.LORE.SUBTITLE}</div>
            <h3 className="text-main m-0 mb-15">{BLUEPRINT.LORE.TITLE}</h3>
            <p className="text-muted font-small mb-10">{BLUEPRINT.LORE.PARAGRAPH_1}</p>
            <p className="text-muted font-small">{BLUEPRINT.LORE.PARAGRAPH_2}</p>
          </div>
        </div>

        {/* FOOTER: CTA */}
        <div className="text-center mt-50 mb-50">
          <h2 className="text-main font-mono mb-20">{BLUEPRINT.LORE.CALL_TO_ACTION}</h2>
          <button 
            className="btn-primary py-15 px-40 font-large font-bold letter-spacing-1 glow-teal mb-10"
            onClick={() => window.alert('Application Flow Initiated')}
          >
            {BLUEPRINT.PUBLIC_CTA.BUTTON}
          </button>
          <div className="text-muted font-tiny font-mono">
            {BLUEPRINT.PUBLIC_CTA.SUBTEXT}
          </div>
        </div>

      </div>
    </div>
  );
};