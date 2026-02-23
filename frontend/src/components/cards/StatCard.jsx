/* src/components/cards/StatCard.jsx */
import React from 'react';
import './StatCard.css'; // This matches the file created above

export const StatCard = ({ label, value, icon: Icon, trend, glowColor = 'teal' }) => {
  const glowClass = `glow-${glowColor}`;

  return (
    <div className={`panel-industrial stat-card-glow ${glowClass} pad-20`}>
      <div className="flex-between mb-15">
        <span className="label-industrial text-muted uppercase font-small tracking-wider">
          {label}
        </span>
        <div className="text-accent">
          {Icon && <Icon size={20} />}
        </div>
      </div>
      
      <div className="flex-align-end gap-10">
        <span className="font-large font-bold font-mono leading-tight">
          {value}
        </span>
        {trend && (
          <span className={`font-tiny mb-5 ${trend.includes('+') ? 'text-good' : 'text-warning'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};