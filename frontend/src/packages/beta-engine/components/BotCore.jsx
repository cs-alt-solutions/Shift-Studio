/* src/packages/beta-engine/components/BotCore.jsx */
import React from 'react';

export const BotCore = ({ 
  onClick, 
  expression = "idle", 
  interactive = true 
}) => {
  // Points directly to the public folder snippet
  const videoSource = `/glitchbot_${expression}.mp4`;

  return (
    <div className="glitchbot-core-mascot" onClick={interactive ? onClick : undefined}>
        <div className="bot-orientation-flip">
            {/* THE RAW VIDEO FEED */}
            <video 
              key={videoSource} 
              className="bot-video-render-clean" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={videoSource} type="video/mp4" />
            </video>
        </div>
    </div>
  );
};