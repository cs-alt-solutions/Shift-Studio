/* uploaded file: src/components/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Box } from './Icons'; 

export const ProjectCard = ({ project, onDelete, readOnly = false }) => {
  const totalMissions = project.missions.length;
  const completedMissions = project.missions.filter(m => m.status === 'completed').length;
  const progressPercent = totalMissions === 0 ? 0 : (completedMissions / totalMissions) * 100;
  const isCatalog = project.status === 'completed';

  const getDisplayStatus = (s) => {
    if (s === 'active') return 'IN PROGRESS'; 
    if (s === 'draft') return 'BLUEPRINT';
    if (s === 'on_hold') return 'HALTED';
    return s;
  };

  const getStatusClass = (s) => {
    if (s === 'active') return 'active';
    if (s === 'draft') return 'draft';
    if (s === 'on_hold') return 'halted';
    return '';
  };

  return (
    <div className={`folder-container ${readOnly ? 'read-only-mode' : ''}`}>
      <div className="folder-tab">
         <span className="folder-tab-text">FILE: {project.id}</span>
      </div>

      <div className={`folder-body card-hover-effect ${isCatalog ? 'catalog-mode' : ''}`}>
          
          {!isCatalog && (
            <div className={`status-stamp ${getStatusClass(project.status)}`}>
                {getDisplayStatus(project.status)}
            </div>
          )}

          {isCatalog && (
             <div className="catalog-stamp-large">CATALOGED</div>
          )}

          <div style={{ pointerEvents: readOnly ? 'none' : 'auto' }}>
            <ImagePlaceholder 
              height="180px" 
              label="REFERENCE IMAGE" 
              onUpload={(e) => { 
                if(!readOnly) {
                   e.stopPropagation(); 
                   alert('Upload Logic Coming Soon'); 
                }
              }} 
            />
          </div>

          <div className="folder-content">
            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '20px' }}>
               {/* UPDATED CLASS NAME HERE */}
               <h3 className="folder-title">
                 {project.title}
               </h3>
               {!readOnly && (
                 <button className="btn-icon-hover" onClick={onDelete} title="Archive File">×</button>
               )}
            </div>

            <div style={{ marginBottom: '25px' }}>
               {project.stockQty !== undefined && project.stockQty > 0 ? (
                    <div className="stock-indicator-clean" style={{display:'inline-flex'}}>
                      <Box size={14} />
                      <span style={{ color: 'var(--neon-teal)', fontWeight: 800 }}>{project.stockQty}</span>
                      <span>UNITS IN STOCK</span>
                    </div>
                 ) : (
                    <div style={{fontSize:'0.7rem', color:'var(--text-muted)', fontStyle:'italic', opacity: 0.5}}>NO PHYSICAL STOCK</div>
                 )}
            </div>

            {project.status === 'active' && (
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
            
            {project.status !== 'active' && <div style={{marginTop:'auto', height:'20px'}}></div>}
          </div>
      </div>
    </div>
  );
};