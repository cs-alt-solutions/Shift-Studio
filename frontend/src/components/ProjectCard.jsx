import React from 'react';
import './ProjectCard.css';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Box } from './Icons'; 

export const ProjectCard = ({ project, onDelete }) => {
  // 1. Calculate Progress
  const totalMissions = project.missions.length;
  const completedMissions = project.missions.filter(m => m.status === 'completed').length;
  const progressPercent = totalMissions === 0 ? 0 : (completedMissions / totalMissions) * 100;

  // 2. IS CATALOGED?
  const isCatalog = project.status === 'completed';

  // 3. MAPPING STATUS TO DISPLAY TERMS (Only for Active/Draft)
  const getDisplayStatus = (s) => {
    if (s === 'active') return 'WIP'; 
    if (s === 'draft') return 'DRAFT';
    return s;
  };

  const getStatusClass = (s) => {
    if (s === 'active') return 'active';
    if (s === 'draft') return 'draft';
    return '';
  };

  return (
    <div className="folder-container">
      
      {/* --- 1. THE FOLDER TAB --- */}
      <div className="folder-tab">
         <span className="folder-tab-text">FILE: {project.id}</span>
      </div>

      {/* --- 2. THE MAIN FOLDER BODY --- */}
      <div className={`folder-body card-hover-effect ${isCatalog ? 'catalog-mode' : ''}`}>
          
          {/* THE TOP STAMP (Only for WIP/Draft) */}
          {!isCatalog && (
            <div className={`status-stamp ${getStatusClass(project.status)}`}>
                {getDisplayStatus(project.status)}
            </div>
          )}

          {/* THE BOTTOM STAMP (Only for Catalog) */}
          {isCatalog && (
             <div className="catalog-stamp-large">
                CATALOGED
             </div>
          )}

          {/* HEADER IMAGE */}
          <ImagePlaceholder 
            height="180px" 
            label="REFERENCE IMAGE" 
            onUpload={(e) => { e.stopPropagation(); alert('Upload Logic Coming Soon'); }} 
          />

          <div className="folder-content">
            
            {/* TITLE & DELETE */}
            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '20px' }}>
               <h3 className="card-title">
                 {project.title}
               </h3>
               <button className="btn-icon-hover" onClick={onDelete} title="Archive File">×</button>
            </div>

            {/* STOCK INDICATOR (Always Relevant) */}
            <div style={{ marginBottom: '25px' }}>
               {project.stockQty !== undefined && project.stockQty > 0 ? (
                    <div className="stock-indicator-clean" style={{display:'inline-flex'}}>
                      <Box size={14} />
                      <span style={{ color: 'var(--neon-teal)', fontWeight: 800 }}>
                        {project.stockQty}
                      </span>
                      <span>UNITS IN STOCK</span>
                    </div>
                 ) : (
                    <div style={{fontSize:'0.7rem', color:'var(--text-muted)', fontStyle:'italic', opacity: 0.5}}>
                       NO PHYSICAL STOCK
                    </div>
                 )}
            </div>

            {/* PROGRESS BAR (Only for WIP/Draft) */}
            {/* Catalog items are done, so we don't need to track R&D milestones */}
            {!isCatalog && (
                <div style={{ marginTop: 'auto' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span className="label-industrial" style={{ fontSize: '0.6rem', margin:0 }}>MILESTONES</span>
                    <span style={{ fontSize: '0.75rem', color: completedMissions === totalMissions && totalMissions > 0 ? 'var(--neon-teal)' : 'var(--text-main)', fontWeight: 700 }}>
                        {progressPercent.toFixed(0)}%
                    </span>
                </div>
                <div className="progress-track">
                    <div 
                        className="progress-fill" 
                        style={{ 
                            width: `${progressPercent}%`,
                            background: completedMissions === totalMissions && totalMissions > 0 ? 'var(--neon-teal)' : 'var(--neon-purple)',
                            boxShadow: completedMissions === totalMissions && totalMissions > 0 ? '0 0 10px var(--neon-teal)' : '0 0 5px var(--neon-purple)'
                        }}
                    ></div>
                </div>
                </div>
            )}
            
            {/* Extra Spacer for Catalog Items so they have same height */}
            {isCatalog && <div style={{marginTop:'auto', height:'20px'}}></div>}

          </div>
      </div>
    </div>
  );
};