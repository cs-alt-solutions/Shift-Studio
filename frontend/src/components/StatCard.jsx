import React from 'react';
import '../styles/global.css'; // Ensure access to variables

export const StatCard = ({ label, value, trend, glowColor = "teal", onClick, isAlert = false }) => {
  
  // Map prop colors to CSS variables
  const getGlowVar = (c) => {
    switch(c) {
      case 'purple': return 'var(--neon-purple)';
      case 'orange': return 'var(--neon-orange)';
      case 'red': return 'var(--status-alert)';
      case 'cyan': return 'var(--neon-cyan)';
      default: return 'var(--neon-teal)';
    }
  };

  const glowStyle = {
    borderColor: isAlert ? 'var(--status-alert)' : 'var(--border-subtle)',
    boxShadow: isAlert 
      ? `0 0 15px rgba(239, 68, 68, 0.3)` 
      : `0 4px 20px rgba(0,0,0,0.5)`
  };

  return (
    <div 
      className={`panel-industrial ${onClick ? 'hover-glow' : ''}`}
      style={{ 
        padding: '20px', 
        minWidth: '200px', 
        cursor: onClick ? 'pointer' : 'default',
        ...glowStyle
      }}
      onClick={onClick}
    >
      <div className="flex-between">
        <span className="label-industrial" style={{ color: getGlowVar(glowColor) }}>{label}</span>
        {trend && (
          <span style={{ 
            fontSize: '0.7rem', 
            color: trend > 0 ? 'var(--status-good)' : 'var(--status-alert)',
            fontWeight: 'bold' 
          }}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <div style={{ 
        fontSize: '1.8rem', 
        fontWeight: '800', 
        marginTop: '5px',
        color: '#fff',
        letterSpacing: '1px'
      }}>
        {value}
      </div>
    </div>
  );
};