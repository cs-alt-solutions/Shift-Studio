import React from 'react';

export const StatCard = ({ label, value, trend, glowColor = "teal", onClick, isAlert = false }) => {
  // Logic for dynamic class calculation (Permitted under Rule 3)
  const statusClass = isAlert ? 'status-alert' : '';
  const interactiveClass = onClick ? 'hover-glow cursor-pointer' : '';
  
  return (
    <div 
      className={`panel-industrial pad-20 min-w-200 ${interactiveClass} ${statusClass}`}
      onClick={onClick}
    >
      <div className="flex-between">
        <span className={`label-industrial text-${glowColor}`}>{label}</span>
        {trend && (
          <span className={`font-small font-bold ${trend > 0 ? 'text-good' : 'text-alert'}`}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <div className="stat-value-large">
        {value}
      </div>
    </div>
  );
};