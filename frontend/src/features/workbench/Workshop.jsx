import React, { useState, useEffect, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext'; 
import { ProjectCard } from '../../components/ProjectCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { InputGroup } from '../../components/InputGroup'; 
import { Plus, Back, Save, Box } from '../../components/Icons'; 
import { formatCurrency, formatPercent } from '../../utils/formatters'; 
import './Workshop.css';

// --- UNIT CATEGORY DEFINITIONS ---
const UNIT_GROUPS = {
  'Weight': ['lbs', 'oz', 'kg', 'g'],
  'Volume': ['gal', 'fl oz', 'L', 'ml'],
  'Length': ['ft', 'in', 'yd', 'cm'],
  'Count': ['count', 'ea', 'box']
};

const getUnitOptions = (currentUnit) => {
  for (const group in UNIT_GROUPS) {
    if (UNIT_GROUPS[group].includes(currentUnit)) {
      return UNIT_GROUPS[group];
    }
  }
  return [currentUnit]; 
};

// --- HELPER: CALCULATE RECIPE COST ---
const calculateRecipeCost = (recipe, materials) => {
  return recipe.reduce((total, item) => {
    const mat = materials.find(m => m.id === item.matId);
    if (!mat) return total;
    return total + (item.reqPerUnit * mat.costPerUnit); 
  }, 0);
};

export const Workshop = ({ onRequestFullWidth }) => {
  const { projects, addProject, deleteProject, updateProject, materials, manufactureProduct } = useInventory();
  
  const [activeProject, setActiveProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // Studio State
  const [recipe, setRecipe] = useState([]);
  const [missions, setMissions] = useState([]); 
  const [tags, setTags] = useState([]); 
  const [notes, setNotes] = useState(''); 
  const [newTagInput, setNewTagInput] = useState('');
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newMissionTitle, setNewMissionTitle] = useState('');

  // Derived State
  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const draftProjects = useMemo(() => projects.filter(p => p.status === 'draft'), [projects]);
  const archiveProjects = useMemo(() => projects.filter(p => ['completed', 'on_hold'].includes(p.status)), [projects]);

  const totalUnitCost = useMemo(() => calculateRecipeCost(recipe, materials), [recipe, materials]);
  const projectedMargin = activeProject ? (activeProject.retailPrice - totalUnitCost) : 0;
  
  // Use Formatter for Margin %
  const marginPercentValue = activeProject && activeProject.retailPrice > 0 
    ? (projectedMargin / activeProject.retailPrice) * 100 
    : 0;

  useEffect(() => {
    if (onRequestFullWidth) onRequestFullWidth(!!activeProject); 
  }, [activeProject, onRequestFullWidth]);

  // --- ACTIONS ---
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    addProject(newProjectTitle);
    setNewProjectTitle('');
    setIsCreateOpen(false);
  };

  const openStudio = (project) => {
    setActiveProject(project);
    setRecipe(project.recipe || []); 
    setMissions(project.missions || []);
    setTags(project.tags || []);
    setNotes(project.notes || '');
  };

  const closeStudio = () => setActiveProject(null);

  const handleSaveProject = () => {
    const updated = { ...activeProject, tags, missions, notes, recipe, updated_at: new Date().toISOString() };
    updateProject(updated);
    alert("FILE SAVED SUCCESSFULLY.");
  };

  const handleCompleteProject = () => {
    const result = manufactureProduct(activeProject.id, recipe);
    if (result.success) {
      updateProject({ ...activeProject, status: 'completed', tags, missions, notes, recipe });
      alert(result.message);
      closeStudio();
    } else {
      alert("ERROR: " + result.message);
    }
  };

  // Field Handlers
  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value);
    const updated = { ...activeProject, retailPrice: isNaN(val) ? 0 : val };
    setActiveProject(updated);
  };

  const addIngredient = () => {
    const mat = materials.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      setRecipe([...recipe, { 
        id: crypto.randomUUID(), 
        matId: mat.id, 
        name: mat.name, 
        reqPerUnit: 1, 
        unit: mat.unit 
      }]);
      setNewIngredientId('');
    }
  };

  const updateRecipeUsage = (id, field, val) => {
    setRecipe(recipe.map(r => r.id === id ? { ...r, [field]: val } : r));
  };
  const removeIngredient = (id) => setRecipe(recipe.filter(r => r.id !== id));

  const addMission = (e) => {
    if (e.key === 'Enter' && newMissionTitle.trim()) {
        e.preventDefault();
        setMissions([...missions, { id: Date.now(), title: newMissionTitle, status: 'pending' }]);
        setNewMissionTitle('');
    }
  };
  const toggleMission = (id) => {
      setMissions(missions.map(m => m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m));
  };
  const deleteMission = (id) => setMissions(missions.filter(m => m.id !== id));

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  return (
    <div className={`radar-grid-layout ${activeProject ? 'layout-full-width' : ''}`}>
      
      {/* --- VIEW 1: PROJECT HUB --- */}
      {!activeProject && (
        <div className="radar-scroll-area">
          <div className="animate-fade-in">
            <div className="inventory-header">
              <div>
                <h2 className="header-title">WORKSHOP</h2>
                <span className="header-subtitle">R&D OPERATIONS</span>
              </div>
              <button className="btn-primary" onClick={() => setIsCreateOpen(true)}><Plus /> NEW PROJECT</button>
            </div>

            {/* SECTION 1: ACTIVE */}
            <div className="section-separator">
               <span className="separator-label">ACTIVE OPERATIONS</span>
               <div className="separator-line"></div>
               <span className="separator-count active">{activeProjects.length} ACTIVE</span>
            </div>
            
            {activeProjects.length === 0 ? (
                <div className="workshop-empty-state">No active operations. Initiate a protocol above.</div>
            ) : (
                <div className="workshop-grid">
                  {activeProjects.map(p => (
                    <div key={p.id} onClick={() => openStudio(p)}>
                      <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                    </div>
                  ))}
                </div>
            )}

            {/* SECTION 2: DRAFTS */}
            <div className="section-separator mt-20">
               <span className="separator-label draft">CONCEPT BLUEPRINTS</span>
               <div className="separator-line"></div>
               <span className="separator-count">{draftProjects.length} DRAFTS</span>
            </div>

            {draftProjects.length === 0 ? (
                <div className="workshop-empty-state muted">Draft queue empty.</div>
            ) : (
                <div className="workshop-grid opacity-90">
                  {draftProjects.map(p => (
                    <div key={p.id} onClick={() => openStudio(p)}>
                      <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                    </div>
                  ))}
                </div>
            )}
            
            {/* CREATE MODAL */}
            {isCreateOpen && (
              <div className="blueprint-overlay">
                <div className="panel-industrial modal-panel">
                  <h2 className="modal-title">INITIATE PROTOCOL</h2>
                  <form onSubmit={handleCreateProject}>
                    <InputGroup 
                      autoFocus 
                      placeholder="Project Title..." 
                      value={newProjectTitle} 
                      onChange={e => setNewProjectTitle(e.target.value)} 
                    />
                    <div className="flex-end gap-10 mt-20">
                      <button type="button" className="btn-ghost" onClick={() => setIsCreateOpen(false)}>CANCEL</button>
                      <button type="submit" className="btn-primary">CREATE</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW 2: THE STUDIO (EDITOR) --- */}
      {activeProject && (
        <div className="studio-animate-enter studio-container">
            
            {/* FILE HEADER */}
            <div className="file-header-strip">
                <button onClick={closeStudio} className="btn-icon header-close-btn">
                    <Back /> <span className="ml-5 font-bold">CLOSE FILE</span>
                </button>
                <div className="flex-1">
                   <div className="project-id">PROJECT ID: {activeProject.id}</div>
                   <div className="project-title-large">{activeProject.title}</div>
                </div>
                <div className="flex-gap-10">
                    <button onClick={handleSaveProject} className="btn-ghost btn-save">
                        <Save /> SAVE PROGRESS
                    </button>
                    <button onClick={handleCompleteProject} className="btn-primary btn-finalize">
                        <Box /> FINALIZE
                    </button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="studio-layout-wrapper">
                <div className="studio-grid">
                    
                    {/* LEFT COL */}
                    <div className="studio-col left-col">
                        <div className="panel-industrial studio-panel no-pad overflow-hidden min-h-200">
                             <ImagePlaceholder height="100%" label="REFERENCE VISUAL" />
                        </div>

                        <div className="panel-industrial studio-panel pad-20">
                             <div className="floating-manifest-label text-teal border-teal">MARKET CALIBRATION</div>
                             
                             <div className="flex-between mb-20 mt-10">
                                 <div>
                                     <div className="label-industrial">TARGET RETAIL</div>
                                     <div className="flex-center gap-5">
                                         <span className="currency-symbol">$</span>
                                         <input 
                                            className="input-chromeless" 
                                            type="number" 
                                            step="0.01" 
                                            placeholder="0.00"
                                            value={activeProject.retailPrice || ''}
                                            onChange={handlePriceChange}
                                         />
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="label-industrial">UNIT COST</div>
                                     <div className="cost-display">{formatCurrency(totalUnitCost)}</div>
                                 </div>
                             </div>

                             <div className="margin-indicator">
                                 <span className="label-industrial no-margin">PROJ. MARGIN</span>
                                 <span className={`margin-value ${projectedMargin > 0 ? 'text-teal' : 'text-alert'}`}>
                                     {formatPercent(marginPercentValue)}
                                 </span>
                             </div>
                        </div>

                        <div className="panel-industrial studio-panel pad-20 flex-1">
                             <div className="floating-manifest-label">FIELD NOTES</div>
                             <div className="mt-10 h-full">
                               <textarea 
                                  className="input-area-industrial" 
                                  placeholder="Enter project details, dimensions, or observations..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                               ></textarea>
                             </div>
                        </div>

                        <div className="panel-industrial studio-panel pad-20">
                            <div className="floating-manifest-label text-cyan border-cyan">TAGS</div>
                            <div className="tag-input-area mt-10">
                                {tags.map(t => <div key={t} className="unit-badge"><span>{t}</span></div>)}
                                <input 
                                    className="input-chromeless tag-input"
                                    placeholder="+ Add tag..." 
                                    value={newTagInput} 
                                    onChange={e => setNewTagInput(e.target.value)} 
                                    onKeyDown={addTag} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL */}
                    <div className="studio-col right-col">
                        
                        {/* MISSIONS */}
                        <div className="panel-industrial studio-panel no-pad min-h-250">
                            <div className="floating-manifest-label text-blue border-blue">MISSION OBJECTIVES</div>
                            <div className="mission-input-area mt-10">
                                <input 
                                    className="input-industrial" 
                                    placeholder="+ Add new milestone (Press Enter)" 
                                    value={newMissionTitle} 
                                    onChange={e => setNewMissionTitle(e.target.value)}
                                    onKeyDown={addMission}
                                />
                            </div>
                            <div className="checklist-container">
                                {missions.length === 0 && <div className="empty-state">No active missions.</div>}
                                {missions.map(m => (
                                    <div key={m.id} className={`checklist-item ${m.status === 'completed' ? 'completed' : ''}`}>
                                        <div onClick={() => toggleMission(m.id)} className="checklist-click-area">
                                            <div className="checkbox-industrial">{m.status === 'completed' && <div className="check-mark"/>}</div>
                                            <span className="mission-text">{m.title}</span>
                                        </div>
                                        <button onClick={() => deleteMission(m.id)} className="btn-icon-hover remove-mission">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BOM */}
                        <div className="panel-industrial studio-panel no-pad flex-col flex-1">
                            <div className="floating-manifest-label text-purple border-purple">BILL OF MATERIALS</div>
                            
                            <div className="bom-toolbar mt-10">
                                <select className="input-industrial bom-select" value={newIngredientId} onChange={e => setNewIngredientId(e.target.value)}>
                                <option value="">+ Select Material...</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.costPerUnit)}/{m.unit})</option>)}
                                </select>
                                <button onClick={addIngredient} className="btn-primary bom-add-btn">ADD</button>
                            </div>

                            <div className="bom-header">
                                <div className="flex-2">ITEM</div>
                                <div className="flex-1 text-center">QTY</div>
                                <div className="flex-1 text-right">EST COST</div>
                                <div className="w-30"></div>
                            </div>

                            <div className="bom-body">
                                {recipe.length === 0 && <div className="empty-state">No materials defined.</div>}
                                {recipe.map(r => {
                                    const mat = materials.find(m => m.id === r.matId);
                                    const cost = mat ? (r.reqPerUnit * mat.costPerUnit) : 0;
                                    const unitOptions = getUnitOptions(r.unit);
                                    return (
                                        <div key={r.id} className="bom-row">
                                            <div className="bom-name">{r.name}</div>
                                            <div className="bom-qty-group">
                                                <input 
                                                    className="input-chromeless bom-qty-input" 
                                                    type="number" 
                                                    value={r.reqPerUnit} 
                                                    onChange={e => updateRecipeUsage(r.id, 'reqPerUnit', e.target.value)} 
                                                />
                                                <select 
                                                    className="input-chromeless bom-unit-select" 
                                                    value={r.unit} 
                                                    onChange={e => updateRecipeUsage(r.id, 'unit', e.target.value)}
                                                >
                                                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                                </select>
                                            </div>
                                            <div className="bom-cost">
                                                {formatCurrency(cost)}
                                            </div>
                                            <div className="text-right w-30">
                                                <button onClick={() => removeIngredient(r.id)} className="btn-icon text-alert font-small">×</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

      {/* --- SIDEBAR --- */}
      {!activeProject && (
        <div className="sidebar-col">
             <div className="keyword-header sidebar-header-pad">
                <h3 className="label-industrial glow-purple no-margin">THE VAULT</h3>
                <span className="sidebar-subtitle">ARCHIVED & HALTED</span>
             </div>
             
             <div className="folder-stack">
                {archiveProjects.length === 0 ? (
                    <div className="vault-empty">Vault empty.</div>
                ) : (
                    archiveProjects.map((p, index) => (
                        <div 
                          key={p.id} 
                          className="folder-stack-item" 
                          style={{ zIndex: index + 1 }}
                          onClick={() => openStudio(p)}
                        >
                            <ProjectCard 
                              project={p} 
                              readOnly={true} 
                              onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} 
                            />
                        </div>
                    ))
                )}
             </div>
        </div>
      )}
    </div>
  );
};