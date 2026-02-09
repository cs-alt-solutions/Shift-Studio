import React, { useState } from 'react';
import './ProjectCard.css';

export const ProjectCard = ({ project, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Front Face: Industrial Ops Panel
  if (!isFlipped) {
    return (
      <div className="ops-panel" style={{ borderLeftColor: 'var(--neon-cyan)' }}>
        <div className="ops-panel-inner">
          <div className="panel-header">
            <h3 className="panel-title">{project.title}</h3>
            <span className={`uplink-badge ${project.status}`}>{project.status}</span>
          </div>
          
          <div className="growth-big" style={{ fontSize: '1.2rem', marginTop: '10px' }}>
            DEMAND: {project.demand}
          </div>

          <div className="panel-footer" style={{ marginTop: '20px' }}>
            <div className="mini-stat">
              <span className="mini-label">COMPETITION</span>
              <span className="mini-val">{project.competition}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-ghost" onClick={() => setIsFlipped(true)}>MISSIONS</button>
              <button className="btn-icon delete" onClick={onDelete} title="Delete Project">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Back Face: Mission Details
  return (
    <div className="ops-panel" style={{ borderLeftColor: 'var(--neon-purple)' }}>
      <div className="ops-panel-inner">
        <h3 className="section-label" style={{ marginTop: 0 }}>ACTIVE MISSIONS</h3>
        <ul className="mission-list">
          {project.missions && project.missions.length > 0 ? (
            project.missions.map(m => (
              <li key={m.id} className={m.status}>{m.title}</li>
            ))
          ) : (
            <li className="empty">No missions initialized</li>
          )}
        </ul>
        <button className="btn-text" style={{ color: 'var(--neon-cyan)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} onClick={() => setIsFlipped(false)}>
          ← BACK TO OVERVIEW
        </button>
      </div>
    </div>
  );
};