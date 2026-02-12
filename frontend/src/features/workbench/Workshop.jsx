/* src/features/workbench/Workshop.jsx */
import React, { useState } from 'react';
import './Workshop.css';
import { useInventory } from '../../context/InventoryContext';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { StampHeader } from '../../components/ui/StampHeader';
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { TERMINOLOGY } from '../../utils/glossary';

export const Workshop = () => {
  const { activeProjects, draftProjects, completedProjects, deleteProject, addProject } = useInventory();
  const [selectedProject, setSelectedProject] = useState(null); 

  return (
    <div className="workshop-container radar-scroll-area">
      {selectedProject && (
        <ProjectBlueprint 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
        />
      )}

      <div className="flex-between mb-20">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <button className="btn-primary" onClick={() => addProject()}>
           + {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
        </button>
      </div>

      <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />
      <div className="workshop-grid">
        {activeProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => setSelectedProject(project)} 
            onDelete={() => deleteProject(project.id)}
            showStatus={false} 
          />
        ))}
      </div>

      <StampHeader status="draft" label={TERMINOLOGY.STATUS.DRAFT} />
      <div className="workshop-grid">
        {draftProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => setSelectedProject(project)} 
            onDelete={() => deleteProject(project.id)}
            showStatus={false} 
          />
        ))}
      </div>

      <div className="section-separator mt-20">
          <span className="separator-label text-muted">{TERMINOLOGY.WORKSHOP.VAULT_HEADER}</span>
          <div className="separator-line" />
      </div>

      <div className="workshop-grid">
        {completedProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              readOnly={true}
              showStatus={false} 
              onClick={() => setSelectedProject(project)} 
            />
        ))}
      </div>
    </div>
  );
};