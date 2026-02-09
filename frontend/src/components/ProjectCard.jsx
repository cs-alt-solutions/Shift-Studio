import React, { useState } from 'react';
import './ProjectCard.css';

export const ProjectCard = ({ project, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`project-card ${isFlipped ? 'flipped' : ''}`}>
      
      <div className="card-front">
        <div className="card-header">
          <h3>{project.title}</h3>
          <span className={`status-badge ${project.status}`}>{project.status}</span>
        </div>
        
        <div className="card-metrics">
           <div className="metric">
              <label>Demand</label>
              <span>{project.demand}</span>
           </div>
           <div className="metric">
              <label>Comp</label>
              <span>{project.competition}</span>
           </div>
        </div>

        <div className="card-actions">
           <button className="btn-secondary" onClick={() => setIsFlipped(true)}>
             View Missions
           </button>
           <button className="btn-icon delete" onClick={onDelete} title="Delete Project">
             🗑️
           </button>
        </div>
      </div>

      <div className="card-back">
        <h4>Active Missions</h4>
        <ul className="mission-list">
          {project.missions && project.missions.length > 0 ? (
             project.missions.map(m => (
               <li key={m.id} className={m.status}>{m.title}</li>
             ))
          ) : (
             <li className="empty">No missions started</li>
          )}
        </ul>
        <button className="btn-text" onClick={() => setIsFlipped(false)}>
          ← Back to Overview
        </button>
      </div>

    </div>
  );
};