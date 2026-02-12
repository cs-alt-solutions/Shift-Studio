/* src/components/ui/IndustrialButton.jsx */
import React from 'react';

export const IndustrialButton = ({ label, icon: Icon, variant = 'primary', onClick, width = 'auto', disabled = false }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  
  return (
    <button 
        className={`${className} flex-center gap-10`} 
        style={{ '--btn-width': width, width: 'var(--btn-width)' }} 
        onClick={onClick} 
        disabled={disabled}
    >
      {Icon && <Icon />} {label}
    </button>
  );
};