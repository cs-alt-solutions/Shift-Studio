import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ProjectCard = ({ project, onClick, onDelete, readOnly = false }) => {
  const { title, status, retailPrice, updated_at, thumbnail } = project;

  // Status Color Logic
  const getStatusColor = (s) => {
    switch(s) {
      case 'active': return 'var(--neon-teal)';
      case 'completed': return 'var(--neon-purple)';
      case 'draft': return 'var(--neon-blue)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="project-card" onClick={onClick}>
      {/* THUMBNAIL AREA */}
      <div className="card-image-area">
         {thumbnail ? (
            <img src={thumbnail} alt={title} className="card-img" />
         ) : (
            <div className="card-placeholder-pattern">
               <span className="placeholder-id">ID: {project.id.toString().slice(-4)}</span>
            </div>
         )}
         <div className="card-status-badge" style={{ borderColor: getStatusColor(status), color: getStatusColor(status) }}>
            {status}
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        
        <div className="card-meta-row">
           <span className="card-label">RETAIL TARGET</span>
           <span className="card-value text-accent">{formatCurrency(retailPrice)}</span>
        </div>

        <div className="card-meta-row">
           <span className="card-label">LAST UPDATED</span>
           <span className="card-value text-muted">{formatDate(updated_at)}</span>
        </div>
        
        {!readOnly && (
            <div className="card-actions">
                <button 
                    className="btn-icon-hover text-alert"
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete(e); }}
                >
                    DELETE FILE
                </button>
            </div>
        )}
      </div>
    </div>
  );
};