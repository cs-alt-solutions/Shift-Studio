import React from 'react';
import { Plus } from './Icons';

export const ImagePlaceholder = ({ height = '150px', label = 'ADD PHOTO', onUpload }) => {
  return (
    <div 
      onClick={onUpload}
      className="panel-industrial"
      style={{
        height: height,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Use the global "Row Odd" variable for that subtle transparent feel
        background: 'var(--bg-row-odd)', 
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--neon-teal)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
      {/* Background Icon */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          color: 'var(--text-muted)',
          opacity: 0.1, // Slight opacity adjustment for the icon itself
          transform: 'rotate(-10deg) scale(1.5)'
        }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>

      {/* Active Layer */}
      <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
            padding: '8px', 
            borderRadius: '50%', 
            border: '1px solid var(--border-subtle)', 
            color: 'var(--text-muted)' 
        }}>
           <Plus />
        </div>
        <span style={{ 
          fontSize: '0.65rem', 
          color: 'var(--text-muted)', 
          fontFamily: 'var(--font-mono)', // Enforce Mono font
          letterSpacing: '1px', 
          fontWeight: 700 
        }}>
          {label}
        </span>
      </div>
    </div>
  );
};