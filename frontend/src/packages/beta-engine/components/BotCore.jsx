/* packages/beta-engine/components/BotCore.jsx */
import React from 'react';

export const BotCore = ({ 
  onClick, 
  scale = "normal", 
  expression = "idle", // Default to idle
  interactive = true 
}) => {
  const containerClass = `glitchbot-core-container scale-${scale} state-${expression}`;
  
  // The system now looks for MP4 snippets
  const videoSource = `/glitchbot_${expression}.mp4`;

  return (
    <div className={containerClass}>
      <div className="glitchbot-core-mascot" onClick={interactive ? onClick : undefined}>
          <div className="bot-orientation-flip">
              {/* THE VIDEO ENGINE */}
              <video 
                key={videoSource} 
                className="bot-video-render"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src={videoSource} type="video/mp4" />
              </video>
          </div>
      </div>
    </div>
  );
};