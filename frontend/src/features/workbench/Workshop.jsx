import React from 'react'; // Removed useState
import './Workshop.css';
import { useInventory } from '../../context/InventoryContext';
import { ProjectCard } from '../../components/ProjectCard';
import { StampHeader } from '../../components/StampHeader';
import { TERMINOLOGY } from '../../utils/glossary';

export const Workshop = () => { // Removed unused onRequestFullWidth prop
  const { projects, deleteProject, addProject } = useInventory();
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const draftProjects = projects.filter(p => p.status === 'draft');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const handleCreateNew = () => {
    addProject({
      title: "New Untitled Project",
      status: "draft",
      retailPrice: 0,
      stockQty: 0
    });
  };

  return (
    <div className="workshop-container radar-scroll-area">
      <div className="flex-between mb-20">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <button className="btn-primary" onClick={handleCreateNew}>
           + {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
        </button>
      </div>

      <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />
      <div className="workshop-grid">
        {activeProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
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
            />
        ))}
      </div>
    </div>
  );
};