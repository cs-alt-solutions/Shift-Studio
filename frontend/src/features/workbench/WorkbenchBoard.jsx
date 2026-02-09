/* src/features/workbench/WorkbenchBoard.jsx */
import React, { useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { MOCK_PROJECTS, MOCK_SECTOR_INTEL } from '../../data/mockData';

import './ConsoleLayout.css'; 
import './MissionModal.css';

export const WorkbenchBoard = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [sectorIntel] = useState(MOCK_SECTOR_INTEL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProject = {
      id: Date.now(),
      title: newProjectTitle,
      status: 'active',
      demand: 'High', 
      competition: 'Low',
      created_at: new Date().toISOString(),
      missions: []
    };

    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div className="radar-scroll-area">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
        <div>
          <h2 style={{margin:0, color:'white', fontSize:'2rem', letterSpacing:'-1px'}}>LABORATORY</h2>
          <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>ACTIVE MISSIONS: {projects.length}</span>
        </div>
        <button className="btn-ghost" onClick={() => setIsModalOpen(true)}>+ INITIALIZE PROJECT</button>
      </div>

      <div style={{ marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
        <div className="ticker-wrap">
          <div className="ticker-move" style={{color:'var(--neon-orange)', fontSize:'0.85rem', fontWeight:'600'}}>
            SECTOR INTEL: {sectorIntel.seasonal} • TRENDING: {sectorIntel.trending.join(', ')} •
          </div>
        </div>
      </div>

      <div className="ops-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card-wrapper">
             <ProjectCard 
               project={project} 
               onDelete={() => handleDeleteProject(project.id)} 
             />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--neon-orange)', marginTop: 0 }}>NEW RESEARCH MISSION</h2>
            <form onSubmit={handleCreateProject}>
              <input 
                type="text" 
                placeholder="Target Product Name..." 
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                autoFocus
                className="tag-row" 
                style={{ width: '100%', marginBottom: '20px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white' }}
              />
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                <button type="submit" className="btn-primary" style={{width: 'auto', padding: '10px 20px'}}>INITIALIZE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};