import React, { useState } from 'react';
import { MOCK_PROJECTS, MOCK_SECTOR_INTEL } from '../../data/mockData';
import { ProjectCard } from '../../components/ProjectCard';
import './InventoryManager.css'; // Re-use standard panel styles
import './Laboratory.css'; // Re-use lab styles

// --- ICONS ---
const Icons = {
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Back: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>,
  Save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
};

// --- HELPER: ID GENERATION (Outside Component) ---
// Defined outside the component to satisfy strict purity linters
const generateUUID = () => {
  if (typeof self !== 'undefined' && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  // Simple fallback that is deterministic enough for mocks if crypto is missing
  return 'id-' + Math.floor(Math.random() * 1000000); 
};

// --- MOCK INVENTORY FOR RECIPE BUILDER ---
const AVAILABLE_MATERIALS = [
  { id: 101, name: 'Soy Wax', unit: 'lbs', stock: 45 },
  { id: 102, name: 'Glass Jars', unit: 'count', stock: 120 },
  { id: 104, name: 'Brass Rods', unit: 'ft', stock: 0 },
  { id: 105, name: 'Cotton Wicks', unit: 'count', stock: 500 },
  { id: 106, name: 'Fragrance Oil', unit: 'oz', stock: 32 },
];

export const Workshop = () => {
  // --- STATE: HUB vs STUDIO ---
  // If activeProject is null, we show the Grid (Hub). If set, we show the Editor (Studio).
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // --- STUDIO STATE (Details for the active project) ---
  const [attributes, setAttributes] = useState({ style: 'Vintage', dimensions: '', vesselSize: '8', vesselUnit: 'oz' });
  const [recipe, setRecipe] = useState([]); // Composition Matrix
  const [protocols, setProtocols] = useState([]); // Instructions
  const [tags, setTags] = useState([]); // Marketing Tags
  const [newTagInput, setNewTagInput] = useState('');
  const [newIngredientId, setNewIngredientId] = useState('');

  // --- ACTIONS: HUB ---
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    
    // FIX: Call external helper
    const newId = generateUUID();
    
    const newProj = {
      id: newId, 
      title: newProjectTitle, 
      status: 'active', 
      demand: 'High', 
      competition: 'Low',
      created_at: new Date().toISOString(), 
      missions: []
    };
    
    setProjects([newProj, ...projects]);
    setNewProjectTitle('');
    setIsCreateOpen(false);
    // Auto-enter the studio for the new project
    openStudio(newProj);
  };

  const deleteProject = (id) => {
    if(window.confirm("Delete this mission?")) setProjects(projects.filter(p => p.id !== id));
  };

  // --- ACTIONS: STUDIO ---
  const openStudio = (project) => {
    // In a real app, you'd fetch these details. We'll reset them for now.
    setActiveProject(project);
    setAttributes({ style: 'Standard', dimensions: '', vesselSize: '8', vesselUnit: 'oz' });
    setRecipe([]);
    setProtocols(project.missions?.map(m => m.title) || []); // Mocking protocols from missions
    setTags(project.tags || []);
  };

  const closeStudio = () => {
    setActiveProject(null);
  };

  const handleSaveProject = () => {
    // Update the project list with new status/data
    setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, status: 'completed', tags: tags } : p));
    alert("Project saved and marked as Market Ready!");
    closeStudio();
  };

  // Recipe Handlers
  const addIngredient = () => {
    const mat = AVAILABLE_MATERIALS.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      // FIX: Call external helper
      const newId = generateUUID();
      setRecipe([...recipe, { id: newId, matId: mat.id, name: mat.name, reqPerUnit: 0, unit: mat.unit }]);
      setNewIngredientId('');
    }
  };
  const updateRecipeUsage = (id, val) => setRecipe(recipe.map(r => r.id === id ? { ...r, reqPerUnit: val } : r));
  const removeIngredient = (id) => setRecipe(recipe.filter(r => r.id !== id));

  // Protocol Handlers
  const addProtocol = () => setProtocols([...protocols, '']);
  const updateProtocol = (idx, val) => { const n = [...protocols]; n[idx] = val; setProtocols(n); };
  const removeProtocol = (idx) => setProtocols(protocols.filter((_, i) => i !== idx));

  // Tag Handlers
  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  // --- RENDER ---
  return (
    <div className="radar-grid-layout">
      {/* GLOBAL GRID STYLES FOR THIS COMPONENT */}
      <style>{`
        .workshop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding-bottom: 40px; }
        .studio-container { display: grid; grid-template-columns: 350px 1fr; gap: 25px; height: 100%; overflow: hidden; padding-bottom: 20px; }
        .studio-col { display: flex; flex-direction: column; gap: 20px; overflow-y: auto; max-height: 100%; padding-right: 5px; }
      `}</style>

      <div className="radar-scroll-area">
        
        {/* --- VIEW 1: PROJECT HUB (The Grid) --- */}
        {!activeProject && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="inventory-header">
              <div>
                <h2 className="header-title">WORKSHOP</h2>
                <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>ACTIVE MISSIONS: {projects.length}</span>
              </div>
              <button className="btn-primary" onClick={() => setIsCreateOpen(true)}><Icons.Plus /> NEW MISSION</button>
            </div>

            {/* Intel Ticker */}
            <div className="panel-industrial" style={{padding:'15px 20px', marginBottom:'30px', borderLeft:'4px solid var(--neon-orange)', background:'rgba(251, 146, 60, 0.05)'}}>
               <div style={{color:'var(--neon-orange)', fontSize:'0.85rem', fontWeight:'600'}}>
                 SECTOR INTEL: {MOCK_SECTOR_INTEL.seasonal}
               </div>
            </div>

            {/* Project Grid */}
            <div className="workshop-grid">
              {projects.map(p => (
                <div key={p.id} onClick={() => openStudio(p)}>
                  <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                </div>
              ))}
            </div>
            
            {/* Create Modal */}
            {isCreateOpen && (
              <div className="blueprint-overlay" style={{justifyContent:'center', alignItems:'center'}}>
                <div className="panel-industrial" style={{width:'400px', padding:'30px', zIndex:2001}}>
                  <h2 style={{ color: 'var(--neon-orange)', marginTop: 0, fontSize:'1.2rem' }}>NEW MISSION</h2>
                  <form onSubmit={handleCreateProject}>
                    <input autoFocus type="text" placeholder="Project Title..." value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} className="input-industrial" style={{ marginBottom: '20px' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" className="btn-ghost" onClick={() => setIsCreateOpen(false)}>CANCEL</button>
                      <button type="submit" className="btn-primary">INITIALIZE</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW 2: THE STUDIO (Detailed Editor) --- */}
        {activeProject && (
          <div className="animate-fade-in" style={{height:'100%'}}>
            {/* Studio Header */}
            <div className="inventory-header" style={{marginBottom:'20px'}}>
               <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                 <button onClick={closeStudio} className="btn-icon" style={{border:'1px solid var(--border-subtle)', padding:'8px'}}><Icons.Back /></button>
                 <div>
                   <h2 className="header-title" style={{color:'var(--neon-teal)'}}>{activeProject.title}</h2>
                   <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>PROJECT ID: {activeProject.id}</span>
                 </div>
               </div>
               <button onClick={handleSaveProject} className="btn-primary" style={{background:'var(--neon-purple)', color:'#fff'}}>
                 <Icons.Save /> COMPLETE & POST
               </button>
            </div>

            <div className="studio-container">
               
               {/* LEFT COLUMN: SPECS & TAGS */}
               <div className="studio-col">
                  {/* A. PRODUCT SPECS */}
                  <div className="blueprint-section panel-base" style={{padding:'20px', marginTop:0}}>
                     <div className="floating-manifest-label" style={{color:'var(--neon-cyan)', borderColor:'var(--neon-cyan)'}}>PRODUCT SPECS</div>
                     <div className="lab-form-group">
                       <label className="lab-label">VARIANT / STYLE</label>
                       <select className="input-industrial" value={attributes.style} onChange={e => setAttributes({...attributes, style: e.target.value})}>
                         <option>Vintage / Decorative</option><option>Minimalist</option><option>Rustic</option>
                       </select>
                     </div>
                     <div className="lab-form-row">
                        <div><label className="lab-label">CAPACITY</label><input className="input-industrial" value={attributes.vesselSize} onChange={e => setAttributes({...attributes, vesselSize: e.target.value})} /></div>
                        <div><label className="lab-label">UNIT</label><select className="input-industrial" value={attributes.vesselUnit} onChange={e => setAttributes({...attributes, vesselUnit: e.target.value})}><option>oz</option><option>ml</option></select></div>
                     </div>
                  </div>

                  {/* B. MARKETING / TAGS */}
                  <div className="blueprint-section panel-base" style={{padding:'20px', marginTop:'10px'}}>
                     <div className="floating-manifest-label" style={{color:'var(--neon-orange)', borderColor:'var(--neon-orange)'}}>MARKETING DATA</div>
                     <label className="lab-label">TAG ARRAY ({tags.length}/13)</label>
                     <div className="tag-input-area" style={{marginBottom:'10px'}}>
                        {tags.map(t => <div key={t} className="tag-chip"><span>{t}</span><span className="tag-remove" onClick={() => setTags(tags.filter(tag => tag !== t))}>×</span></div>)}
                        <input className="tag-entry" placeholder="Add tag..." value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={addTag} />
                     </div>
                  </div>
               </div>

               {/* RIGHT COLUMN: RECIPE & PROTOCOLS */}
               <div className="studio-col">
                  {/* C. COMPOSITION MATRIX (Recipe) */}
                  <div className="blueprint-section panel-base" style={{padding:'0', marginTop:0, display:'flex', flexDirection:'column'}}>
                     <div className="floating-manifest-label" style={{color:'var(--neon-purple)', borderColor:'var(--neon-purple)'}}>COMPOSITION MATRIX</div>
                     {/* Add Bar */}
                     <div style={{padding:'20px', borderBottom:'1px solid var(--border-subtle)', display:'flex', gap:'10px'}}>
                        <select className="input-industrial" value={newIngredientId} onChange={e => setNewIngredientId(e.target.value)}>
                          <option value="">+ Add Component...</option>
                          {AVAILABLE_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <button onClick={addIngredient} className="btn-primary" style={{padding:'5px 15px'}}>ADD</button>
                     </div>
                     {/* List */}
                     <div style={{padding:'0'}}>
                       {recipe.length === 0 && <div style={{padding:'20px', color:'var(--text-muted)', fontStyle:'italic'}}>No materials added yet.</div>}
                       {recipe.map(r => (
                         <div key={r.id} className="recipe-row">
                           <div style={{flex:2}}><div className="recipe-name">{r.name}</div></div>
                           <div style={{flex:1, display:'flex', alignItems:'center', gap:'5px'}}>
                             <input className="input-industrial" type="number" placeholder="0" value={r.reqPerUnit} onChange={e => updateRecipeUsage(r.id, e.target.value)} style={{textAlign:'center'}} />
                             <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>{r.unit}</span>
                           </div>
                           <button onClick={() => removeIngredient(r.id)} className="btn-icon" style={{color:'red', marginLeft:'10px'}}>×</button>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* D. ASSEMBLY PROTOCOLS */}
                  <div className="blueprint-section panel-base" style={{padding:'20px', marginTop:0}}>
                     <div className="floating-manifest-label">ASSEMBLY PROTOCOLS</div>
                     {protocols.map((step, idx) => (
                       <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                         <div style={{fontWeight:800, color:'var(--text-muted)', paddingTop:'5px'}}>{idx + 1}</div>
                         <textarea className="input-industrial" value={step} onChange={e => updateProtocol(idx, e.target.value)} style={{minHeight:'50px', fontSize:'0.9rem'}} />
                         <button onClick={() => removeProtocol(idx)} className="btn-icon" style={{height:'30px'}}>×</button>
                       </div>
                     ))}
                     <button onClick={addProtocol} className="btn-ghost" style={{width:'100%', borderStyle:'dashed'}}>+ ADD STEP</button>
                  </div>
               </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};