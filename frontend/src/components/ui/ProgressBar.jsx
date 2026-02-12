import React from 'react';
import './ProgressBar.css';
export const ProgressBar = ({ value, max = 100, colorVar = '--neon-purple' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-track-universal">
      <div className="progress-fill-universal" style={{ width: `${percentage}%`, backgroundColor: `var(${colorVar})`, boxShadow: `0 0 10px var(${colorVar})` }} />
    </div>
  );
};
