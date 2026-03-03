/* src/components/cards/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { TrashIcon } from '../Icons';

export const ProjectCard = ({ project, onClick, onDelete, readOnly = false, showStatus = true }) => {
  const { title, status = 'draft', retailPrice, updated_at, stockQty, recipe } = project;
  const isDraft = status === 'draft' || status === 'idea' || status === 'Planning';
  const normalizedStatus = status.toLowerCase();

  return (
    <div className={`project-card-container card-hover-effect status-${normalizedStatus}`} onClick={onClick}>
      
      <div className="project-card-header">
        {showStatus ? (
          <StatusBadge status={status} />
        ) : (
          <span className="text-muted font-small font-mono">
            {TERMINOLOGY.GENERAL.ID_LABEL}: {project.id ? project.id.toString().slice(-4) : 'NEW'}
          </span>
        )}

        <h3 className="project-title">{title || 'Untitled Project'}</h3>
        
        {!readOnly && onDelete && (
          <button 
            className="btn-icon-hover-clean z-layer-top" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(project.id); 
            }}
            title={TERMINOLOGY.GENERAL.DELETE}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="project-card-body">
        <div className="project-metrics">
            <div className="metric-item">
                <span className="metric-label">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</span>
                <span className="metric-value">{recipe?.length || 0} Items</span>
            </div>
            <div className="metric-item text-right">
                <span className="metric-label">{TERMINOLOGY.BLUEPRINT.STOCK}</span>
                <span className="metric-value stock-units">{stockQty || 0} {TERMINOLOGY.GENERAL.UNITS}</span>
            </div>
        </div>

        {!isDraft && (
            <div className="mt-10 mb-10">
              <ProgressBar 
                  value={status === 'completed' ? 100 : 45} 
                  colorVar={status === 'active' ? '--neon-teal' : '--neon-purple'}
              />
            </div>
        )}

        <div className="project-footer mt-20 pt-15">
           <div>
              <span className="metric-label">{TERMINOLOGY.WORKSHOP.TARGET_RETAIL}</span>
              <div className="retail-price-display font-bold font-large">{formatCurrency(retailPrice || 0)}</div>
           </div>
           <div className="text-right">
              <span className="metric-label">{TERMINOLOGY.WORKSHOP.LAST_EDIT}</span>
              <div className="text-muted font-small">{updated_at ? formatDate(updated_at) : 'Just Now'}</div>
           </div>
        </div>
      </div>
    </div>
  );
};