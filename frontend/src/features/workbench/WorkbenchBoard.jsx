import React, { useState, useEffect } from 'react';
import './ConsoleLayout.css';
import './MissionModal.css';
import { supabase } from '../../supabaseClient';

export const WorkbenchBoard = () => {
  const [projects, setProjects] = useState([]);
  const [sectorIntel, setSectorIntel] = useState({});
  
  // NAVIGATION
  const [activeView, setActiveView] = useState('radar'); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null); 
  
  // MODAL & MISSION STATE
  const [showModal, setShowModal] = useState(false);
  const [missionName, setMissionName] = useState('');
  const [strategy, setStrategy] = useState('sniper');

  // WORKSPACE STATE
  const [keywordInput, setKeywordInput] = useState(''); 

  const activeProject = projects.find(p => p.id === selectedProjectId);

  // --- HELPER FUNCTIONS ---
  // We define these outside useEffect so buttons can use them too
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
    if (error) console.error("Error loading projects:", error.message);
  };

  const fetchSectorIntel = async () => {
    const { data } = await supabase.from('market_sectors').select('*');
    if (data) {
      const grouped = data.reduce((acc, item) => {
        if (!acc[item.sector_name]) acc[item.sector_name] = [];
        acc[item.sector_name].push(item);
        return acc;
      }, {});
      setSectorIntel(grouped);
    }
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    // Wrap calls in a local async function to satisfy React/ESLint rules
    const initData = async () => {
      await fetchProjects();
      await fetchSectorIntel();
    };
    initData();
    // _eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- ACTIONS ---
  const createDraft = async (itemTitle, price, source) => {
    const newProject = {
      name: itemTitle.length > 40 ? itemTitle.substring(0, 40) + "..." : itemTitle,
      status: 'Idea', // KANBAN STARTING POINT
      source: source,
      selling_price: price,
      labor_time: 60,
      hourly_wage: 20
    };
    const { data, error } = await supabase.from('projects').insert([newProject]).select();
    if (!error && data) {
      setProjects([data[0], ...projects]);
      openProject(data[0].id);
    }
  };

  const launchMission = async () => {
    if (!missionName) return;
    setShowModal(false);
    createDraft(missionName, 0, strategy === 'sniper' ? 'SNIPER_PROBE' : 'SECTOR_SCAN');
    setMissionName('');
  };

  const updateProjectField = async (id, field, value) => {
    // Optimistic Update (Update UI immediately)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    
    // Database Update
    const { error } = await supabase.from('projects').update({ [field]: value }).eq('id', id);
    if (error) console.error(`Failed to update ${field}:`, error.message);
  };

  const moveStage = async (id, currentStage, direction) => {
    const stages = ['Idea', 'Drafting', 'Sourcing', 'Building', 'Ready'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex === -1) return; // Unknown stage

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stages.length) {
      updateProjectField(id, 'status', stages[newIndex]);
    }
  };

  const addKeyword = async () => {
    if (!keywordInput || !activeProject) return;
    const currentTags = activeProject.target_keywords || [];
    const newTags = [...currentTags, keywordInput];
    
    await updateProjectField(activeProject.id, 'target_keywords', newTags);
    setKeywordInput('');
  };

  const removeKeyword = async (tagToRemove) => {
    if (!activeProject) return;
    const newTags = activeProject.target_keywords.filter(t => t !== tagToRemove);
    await updateProjectField(activeProject.id, 'target_keywords', newTags);
  };

  // --- NAVIGATION ---
  const openProject = (id) => { setSelectedProjectId(id); setActiveView('project'); };
  const openSectorDetail = (name) => { setSelectedSector(name); setActiveView('sector-detail'); };

  // --- VIEWS ---
  const renderKanbanView = () => {
    const stages = ['Idea', 'Drafting', 'Sourcing', 'Building', 'Ready'];
    return (
      <div className="animate-fade-in" style={{overflowX: 'auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
           <div>
             <h1 style={{fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '5px'}}>The Laboratory</h1>
             <div style={{color: '#888'}}>Drag operations and active protocols.</div>
           </div>
           <button onClick={() => setShowModal(true)} className="btn-launch">+ NEW MISSION</button>
        </div>
        
        <div style={{display: 'flex', gap: '20px', minWidth: '1000px', paddingBottom: '20px'}}>
          {stages.map(stage => {
            const stageProjects = projects.filter(p => p.status === stage);
            return (
              <div key={stage} style={{flex: 1, minWidth: '200px', background: 'var(--bg-subtle)', borderRadius: '8px', padding: '15px'}}>
                <div style={{color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '15px', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
                  {stage} <span style={{color: '#666', float: 'right'}}>{stageProjects.length}</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {stageProjects.map(p => (
                    <div key={p.id} onClick={() => openProject(p.id)} className="ops-card" style={{cursor: 'pointer', borderLeft: '3px solid #555'}}>
                      <div style={{fontWeight: 'bold', color: 'white', marginBottom: '5px'}}>{p.name}</div>
                      <div style={{fontSize: '0.7rem', color: '#888'}}>{p.source || 'MANUAL'}</div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                        <button onClick={(e) => {e.stopPropagation(); moveStage(p.id, stage, 'back')}} style={{background: 'none', border:'none', cursor:'pointer', color: '#666'}}>←</button>
                        <button onClick={(e) => {e.stopPropagation(); moveStage(p.id, stage, 'next')}} style={{background: 'none', border:'none', cursor:'pointer', color: 'var(--accent-success)'}}>→</button>
                      </div>
                    </div>
                  ))}
                  {stageProjects.length === 0 && <div style={{color: '#444', fontSize: '0.8rem', textAlign: 'center', padding: '20px'}}>Empty</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const renderProjectView = () => {
    if (!activeProject) return <div>Loading...</div>;
    return (
      <div className="animate-fade-in" style={{paddingBottom: '100px'}}>
        {/* HEADER */}
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
          <button onClick={() => setActiveView('workspace')} className="btn-ghost">← Back to Board</button>
          <div style={{height: '20px', width: '1px', background: '#333'}}></div>
          <span style={{color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold'}}>{activeProject.status} PHASE</span>
        </div>
        <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '30px'}}>{activeProject.name}</h1>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
          
          {/* LEFT COLUMN: NOTEBOOK & RECIPES */}
          <div>
            {/* DIGITAL NOTEBOOK */}
            <div className="module-panel">
              <div className="module-header"><span>Digital Notebook</span><span>NOTES & SKETCHES</span></div>
              <textarea 
                style={{width: '100%', height: '200px', background: 'transparent', border: 'none', color: '#ddd', fontSize: '1rem', lineHeight: '1.5', resize: 'none', outline: 'none'}} 
                placeholder="Type your observations, ideas, and design notes here..."
                value={activeProject.description || ''}
                onChange={(e) => updateProjectField(activeProject.id, 'description', e.target.value)}
              />
            </div>

            {/* KEYWORD BUCKET */}
            <div className="module-panel">
              <div className="module-header"><span>Keyword Bucket</span><span>TARGET TAGS</span></div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px'}}>
                {activeProject.target_keywords && activeProject.target_keywords.map((tag, i) => (
                  <span key={i} style={{background: 'rgba(0, 243, 255, 0.1)', color: 'var(--accent-primary)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    #{tag}
                    <span onClick={() => removeKeyword(tag)} style={{cursor: 'pointer', fontWeight: 'bold'}}>×</span>
                  </span>
                ))}
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  value={keywordInput} 
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="Add new tag..." 
                  className="mission-input" 
                  style={{padding: '8px', fontSize: '0.9rem'}}
                />
                <button onClick={addKeyword} className="btn-ghost">ADD</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FINANCIALS (Snapshot) */}
          <div>
            <div className="module-panel" style={{border: '1px solid var(--accent-success)'}}>
              <div className="module-header" style={{borderBottomColor: 'var(--accent-success)'}}>
                <span style={{color: 'var(--accent-success)'}}>Project Ledger</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label className="metric-label">Sale Price ($)</label>
                  <input className="cost-input" type="number" value={activeProject.selling_price || 0} onChange={(e) => updateProjectField(activeProject.id, 'selling_price', e.target.value)} />
                </div>
                <div>
                  <label className="metric-label">Shipping ($)</label>
                  <input className="cost-input" type="number" value={activeProject.shipping_charge || 0} onChange={(e) => updateProjectField(activeProject.id, 'shipping_charge', e.target.value)} />
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                 <button onClick={() => setActiveView('matrix')} style={{width: '100%', padding: '12px', background: 'var(--accent-success)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                   OPEN PROFIT MATRIX ↗
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderRadarView = () => (
     <div className="animate-fade-in">
        <div style={{marginBottom: '40px'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '10px', letterSpacing: '-1px'}}>Market Radar</h1>
          <div style={{color: '#888', fontSize: '0.9rem'}}>Live Database Intelligence</div>
        </div>
        <div className="module-panel">
          <div className="module-header"><span>Active Sectors</span></div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
            {Object.keys(sectorIntel).map((name, idx) => (
              <div key={idx} onClick={() => openSectorDetail(name)} className="ops-card" style={{cursor: 'pointer', borderLeft: '4px solid var(--accent-primary)'}}>
                <div style={{color: 'white', fontWeight: 'bold'}}>{name}</div>
                <div style={{fontSize: '0.7rem', color: '#666'}}>{sectorIntel[name].length} High Performers</div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );

  const renderSectorDetail = () => {
    const sectorItems = sectorIntel[selectedSector] || [];
    return (
      <div className="animate-fade-in">
        <button onClick={() => setActiveView('radar')} className="btn-ghost" style={{marginBottom: '20px'}}>← Back to Radar</button>
        <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '20px'}}>{selectedSector} Intelligence</h1>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
           {sectorItems.map((item, idx) => (
             <div key={idx} className="ops-card" style={{borderLeft: '4px solid var(--accent-success)'}}>
                <div style={{fontWeight: '700', color: 'white', marginBottom: '10px'}}>{item.title}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '15px'}}>
                  <span>Avg: ${item.price}</span><span style={{color: 'var(--accent-success)'}}>{item.heat}% Heat</span>
                </div>
                <button onClick={() => createDraft(item.title, item.price, 'RADAR_DB')} className="btn-launch" style={{width: '100%', padding: '8px', fontSize: '0.7rem'}}>+ DRAFT</button>
             </div>
           ))}
        </div>
      </div>
    )
  };

  // --- MAIN RENDER ---
  return (
    <div className="console-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="mission-modal">
            <div className="modal-title">Initialize Mission Protocol</div>
            <div className="strategy-grid">
              <div className={`strategy-card ${strategy === 'sniper' ? 'selected' : ''}`} onClick={() => setStrategy('sniper')}>
                <span className="strategy-icon">🎯</span><span className="strategy-name">Sniper Probe</span>
              </div>
              <div className={`strategy-card ${strategy === 'radar' ? 'selected' : ''}`} onClick={() => setStrategy('radar')}>
                <span className="strategy-icon">📡</span><span className="strategy-name">Sector Scan</span>
              </div>
            </div>
            <input 
                className="mission-input" 
                placeholder="Target Name..."
                value={missionName} 
                onChange={(e) => setMissionName(e.target.value)} 
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>ABORT</button>
              <button className="btn-launch" onClick={launchMission}>LAUNCH</button>
            </div>
          </div>
        </div>
      )}

      <aside className="console-sidebar">
        <div className={`nav-link ${activeView === 'radar' ? 'active' : ''}`} onClick={() => setActiveView('radar')}>
          <span className="nav-icon">📡</span><span>RADAR</span>
        </div>
        <div className={`nav-link ${activeView === 'workspace' || activeView === 'project' ? 'active' : ''}`} onClick={() => setActiveView('workspace')}>
          <span className="nav-icon">☷</span><span>LABORATORY</span>
        </div>
        <div className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveView('matrix')}>
          <span className="nav-icon">📊</span><span>PROFIT MATRIX</span>
        </div>
      </aside>

      <main className="console-main">
        {activeView === 'radar' && renderRadarView()}
        {activeView === 'sector-detail' && renderSectorDetail()}
        {activeView === 'workspace' && renderKanbanView()}
        {activeView === 'project' && renderProjectView()}
        {activeView === 'matrix' && <div className="console-empty">Profit Matrix Loading...</div>}
      </main>
    </div>
  );
};