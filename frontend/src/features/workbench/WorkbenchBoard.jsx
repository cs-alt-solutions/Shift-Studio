import React, { useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { MOCK_PROJECTS, MOCK_SECTOR_INTEL } from '../../data/mockData';

// Styles - Using relative paths to find your global file
import '../../styles/global.css'; 
import './WorkbenchBoard.css';
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
    <div className="workbench-container">
      <header className="workbench-header">
        <h1 className="brand-text">MarketLens <span className="highlight">Workbench</span></h1>
        <button className="btn-primary main-action" onClick={() => setIsModalOpen(true)}>
          + New Project
        </button>
      </header>

      <div className="intel-ticker glass-panel">
        <span className="label">SECTOR INTEL:</span>
        <span className="ticker-text">
            {sectorIntel.seasonal} | <span className="accent-text">Trending: {sectorIntel.trending.join(', ')}</span>
        </span>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onDelete={() => handleDeleteProject(project.id)}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2 className="accent-text">New Research Mission</h2>
            <form onSubmit={handleCreateProject}>
              <input 
                className="brand-input"
                type="text" 
                placeholder="Target Product Name..." 
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};