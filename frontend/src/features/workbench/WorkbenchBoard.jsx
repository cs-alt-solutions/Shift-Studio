import React, { useState, useEffect } from 'react';
import './ConsoleLayout.css';
import './MissionModal.css';
import { MOCK_PROJECTS } from '../../data/mockData';

const generateId = () => Date.now();

// --- MOCK SECTOR DATA ---
const SECTOR_INTEL = {
  "Jewelry": [
    { title: "Minimalist Gold Stacking Rings", price: 24.00, heat: 98, trend: "↑" },
    { title: "Raw Crystal Pendants", price: 35.00, heat: 85, trend: "→" },
    { title: "Personalized Name Necklaces", price: 45.00, heat: 92, trend: "↑" }
  ],
  "Home Decor": [
    { title: "Geometric Concrete Planters", price: 18.50, heat: 75, trend: "↑" },
    { title: "Boho Macrame Wall Hanging", price: 42.00, heat: 60, trend: "↓" },
    { title: "Soy Wax Bubble Candles", price: 22.00, heat: 88, trend: "↑" }
  ],
  "Clothing": [
    { title: "Embroidered Sweatshirts", price: 55.00, heat: 90, trend: "↑" },
    { title: "Linen Lounge Sets", price: 85.00, heat: 70, trend: "→" }
  ],
  "Digital Prints": [
    { title: "Abstract Wall Art Set", price: 8.00, heat: 95, trend: "↑" },
    { title: "Wedding Invitation Templates", price: 12.00, heat: 82, trend: "↑" }
  ],
  "Woodworking": [
    { title: "Epoxy River Coasters", price: 45.00, heat: 60, trend: "↓" },
    { title: "Monitor Stand Riser", price: 65.00, heat: 55, trend: "→" }
  ]
};

// --- API HELPER ---
const fetchRadarAPI = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/market-radar');
    return await response.json();
  } catch (err) {
    console.error("Radar Offline:", err);
    return null;
  }
};

export const WorkbenchBoard = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  
  // NAVIGATION: 'radar', 'sector-detail', 'workspace', 'project', 'matrix'
  const [activeView, setActiveView] = useState('radar'); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null); 
  
  // DATA
  const [marketRadar, setMarketRadar] = useState(null);
  // _eslint-disable-next-line no-unused-vars
  const [radarTimeframe, setRadarTimeframe] = useState('live'); 
  const activeProject = projects.find(p => p.id === selectedProjectId);

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [missionName, setMissionName] = useState('');
  const [strategy, setStrategy] = useState('sniper');

  // --- INITIAL LOAD ---
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const data = await fetchRadarAPI();
      if (isMounted && data) setMarketRadar(data);
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  // --- NAVIGATION ACTIONS ---
  const navigateTo = (view) => {
    setActiveView(view);
    setSelectedProjectId(null);
    setSelectedSector(null);
    if (view === 'radar') fetchRadarAPI().then(data => data && setMarketRadar(data));
  };

  const openSectorDetail = (sectorName) => {
    setSelectedSector(sectorName);
    setActiveView('sector-detail');
  };

  const openProject = (id) => {
    setSelectedProjectId(id);
    setActiveView('project');
  };

  // --- ACTIONS ---
  const createDraft = (itemTitle, itemPrice, sourceTag = 'MANUAL') => {
    const tempId = generateId();
    const newProject = {
      id: tempId, 
      name: itemTitle.length > 40 ? itemTitle.substring(0, 40) + "..." : itemTitle, 
      status: 'draft', 
      demand: 'High (Inferred)', 
      competition: 'Analyzing...', 
      profit: itemPrice, 
      source: sourceTag, 
      listings: [], 
      materials: [],
      salesHistory: [], 
      sellingPrice: itemPrice, 
      shippingCost: 0, 
      shippingCharge: 0, 
      laborTime: 60, 
      hourlyWage: 20
    };
    setProjects(prev => [...prev, newProject]);
    openProject(tempId);
  };

  const changeProjectStatus = (id, newStatus) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const recordSale = () => {
    if (!activeProject) return;
    const newSale = {
      id: generateId(),
      date: new Date().toLocaleDateString(),
      qty: 1, 
      revenue: activeProject.sellingPrice + activeProject.shippingCharge
    };
    const updatedSales = activeProject.salesHistory ? [...activeProject.salesHistory, newSale] : [newSale];
    setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...p, salesHistory: updatedSales } : p));
  };

  const refreshFleet = async (currentProjects) => {
    const updates = currentProjects.map(async (p) => {
      if (p.status === 'draft' || p.status === 'validated') return p;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/search?query=${p.name}`);
        const data = await response.json();
        return { ...p, demand: data.data.demand, competition: data.data.competition, profit: data.data.profit_estimate, source: data.source };
      } catch (err) { console.warn("Skip refresh", err); return p; }
    });
    setProjects(await Promise.all(updates));
  };

  const launchMission = async () => {
    if (!missionName) return;
    setShowModal(false);
    const tempId = generateId();
    const newProject = { 
      id: tempId, name: missionName, status: 'watchlist', demand: null, competition: null, profit: null, source: 'CONNECTING...',
      listings: [], materials: [], salesHistory: [], sellingPrice: 0, shippingCost: 0, shippingCharge: 0, laborTime: 30, hourlyWage: 15.00
    };
    const updatedList = [...projects, newProject];
    setProjects(updatedList);
    openProject(tempId);
    setMissionName('');
    refreshFleet(updatedList); 
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search?query=${missionName}`);
      const data = await response.json();
      setProjects(prev => prev.map(p => (p.id === tempId ? { ...p, demand: data.data.demand, competition: data.data.competition, profit: data.data.profit_estimate, status: 'active', source: data.source, listings: data.data.listings || [] } : p)));
    } catch (error) { console.error("Uplink Failed:", error); }
  };

  const deleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    navigateTo('workspace'); 
  };

  // --- FINANCIAL HELPERS ---
  const updateFinancials = (field, value) => setProjects(prev => prev.map(p => (p.id === selectedProjectId ? { ...p, [field]: parseFloat(value) || 0 } : p)));
  const handleMaterialChange = (matId, field, value) => updateProjectMaterials(selectedProjectId, activeProject.materials.map(m => (m.id === matId ? { ...m, [field]: value } : m)));
  const updateProjectMaterials = (projId, newMaterials) => setProjects(prev => prev.map(p => (p.id === projId ? { ...p, materials: newMaterials } : p)));
  const addMaterialRow = () => updateProjectMaterials(selectedProjectId, [...activeProject.materials, { id: generateId(), name: '', price: '', bought: '', unit: 'lbs', used: '', calculated: null }]);
  const calculateRow = async (material) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/calculate-cost', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_price: parseFloat(material.price), purchase_amount: parseFloat(material.bought), purchase_unit: material.unit, recipe_amount: parseFloat(material.used), recipe_unit: material.unit })
      });
      const data = await response.json();
      updateProjectMaterials(selectedProjectId, activeProject.materials.map(m => (m.id === material.id ? { ...m, calculated: data.cost } : m)));
    } catch (err) { console.error("Calc Error", err); }
  };

  // --- RENDER HELPERS ---
  const getSourceBadge = (code) => {
    if (code === 'REAL_ETSY') return <span className="uplink-badge status-live">● LIVE DATA</span>;
    if (code === 'RADAR_PICK') return <span className="uplink-badge" style={{color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)'}}>⚡ RADAR PICK</span>;
    return <span className="uplink-badge" style={{color: '#94a3b8'}}>MANUAL ENTRY</span>;
  };

  const getProjectStatus = (p) => {
    if (p.status === 'draft') return 'draft';
    if (p.status === 'watchlist' || p.status === 'scanning' || p.status === 'new' || p.status === 'active') return 'watchlist';
    if (p.status === 'validated' || p.status === 'trending') return 'validated';
    return 'stable'; 
  };

  // --- VIEW: MARKET RADAR ---
  const renderRadarView = () => (
    <div className="animate-fade-in">
      <div style={{marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
        <div>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '10px', letterSpacing: '-1px'}}>Market Radar</h1>
          <div style={{color: '#888', fontSize: '0.9rem', fontWeight: '500'}}>Global Market Intelligence</div>
        </div>
        <div style={{display: 'flex', background: 'var(--bg-subtle)', borderRadius: '6px', padding: '4px'}}>
           <button onClick={() => setRadarTimeframe('live')} style={{background: radarTimeframe === 'live' ? 'var(--accent-primary)' : 'transparent', color: radarTimeframe === 'live' ? 'black' : '#666', border:'none', padding:'8px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'0.75rem'}}>LIVE SIGNAL</button>
           <button onClick={() => setRadarTimeframe('weekly')} style={{background: radarTimeframe === 'weekly' ? 'var(--accent-primary)' : 'transparent', color: radarTimeframe === 'weekly' ? 'black' : '#666', border:'none', padding:'8px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'0.75rem'}}>7-DAY TREND</button>
        </div>
      </div>
      <div className="module-panel">
        <div className="module-header"><span>Sector Activity</span><span>CLICK TO DRILL DOWN</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
          {marketRadar?.categories ? marketRadar.categories.map((cat, idx) => (
            <div key={idx} onClick={() => openSectorDetail(cat.name)} style={{background: 'var(--bg-subtle)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{color: 'white', fontWeight: 'bold'}}>{cat.name}</span>
                <span style={{color: cat.trend === '↑' ? 'var(--accent-success)' : '#666'}}>{cat.trend}</span>
              </div>
              <div style={{fontSize: '2rem', fontWeight: '700', color: cat.heat > 80 ? 'var(--accent-primary)' : 'var(--text-muted)'}}>{cat.heat}%</div>
              <div style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginTop: '5px'}}>Demand Index</div>
              <div style={{position: 'absolute', bottom: 0, left: 0, height: '4px', background: cat.heat > 80 ? 'var(--accent-primary)' : '#333', width: `${cat.heat}%`}}></div>
            </div>
          )) : <div style={{color: '#666'}}>Scanning Frequencies...</div>}
        </div>
      </div>
      <div className="module-panel">
        <div className="module-header"><span style={{color: 'var(--accent-success)'}}>Global High Performers</span><span>TOP MOVERS</span></div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
          {marketRadar?.trending_items ? marketRadar.trending_items.map((item) => (
             <div key={item.id} style={{display: 'flex', background: 'var(--bg-subtle)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)'}}>
                <div style={{padding: '20px', flex: 1}}>
                   <div style={{color: 'white', fontWeight: 'bold', marginBottom: '5px', fontSize: '1rem'}}>{item.title.length > 40 ? item.title.substring(0, 40) + "..." : item.title}</div>
                   <div style={{display: 'flex', gap: '15px', color: '#888', fontSize: '0.8rem', marginBottom: '15px'}}>
                      <span style={{color: 'var(--accent-success)'}}>${item.price}</span><span>♥ {item.likes} Likes</span>
                   </div>
                   <div style={{display: 'flex', gap: '10px'}}>
                      <button onClick={() => createDraft(item.title, item.price, 'RADAR_PICK')} style={{background: 'rgba(0, 243, 255, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem'}}>+ DRAFT THIS</button>
                      <a href={item.url} target="_blank" rel="noreferrer" style={{background: 'rgba(255,255,255,0.05)', color: '#aaa', textDecoration: 'none', padding: '8px', fontSize: '0.7rem', fontWeight:'600', borderRadius:'4px'}}>VIEW ↗</a>
                   </div>
                </div>
             </div>
          )) : <div style={{color: '#666'}}>Intercepting Data Packets...</div>}
        </div>
      </div>
    </div>
  );

  // --- VIEW 2: SECTOR DETAIL ---
  const renderSectorDetail = () => {
    const sectorItems = SECTOR_INTEL[selectedSector] || []; 
    return (
      <div className="animate-fade-in">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
            <button onClick={() => navigateTo('radar')} className="btn-ghost" style={{border: 'none', padding: 0, fontSize: '1.2rem'}}>← Back to Radar</button>
            <div style={{height: '20px', width: '1px', background: '#333'}}></div>
            <span style={{color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px'}}>Sector Intelligence: {selectedSector}</span>
        </div>
        <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '20px'}}>{selectedSector} Breakdown</h1>
        <div className="module-panel">
          <div className="module-header"><span>Top Performers in this Sector</span></div>
          {sectorItems.length > 0 ? (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
              {sectorItems.map((item, idx) => (
                <div key={idx} style={{background: 'var(--bg-subtle)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-subtle)'}}>
                  <div style={{fontWeight: '700', color: 'white', marginBottom: '10px'}}>{item.title}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '20px'}}>
                    <span>Avg Price: ${item.price}</span><span style={{color: 'var(--accent-success)'}}>Heat: {item.heat}%</span>
                  </div>
                  <button onClick={() => createDraft(item.title, item.price, 'RADAR_PICK')} style={{width: '100%', background: 'var(--accent-primary)', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}>+ DRAFT THIS</button>
                </div>
              ))}
            </div>
          ) : ( <div style={{padding: '20px', color: '#666', textAlign: 'center'}}>No detailed intel available for this sector yet.</div> )}
        </div>
      </div>
    );
  };

  // --- VIEW 3: WORKSPACE ---
  const renderWorkspaceView = () => {
    const renderSection = (title, subtitle, statusKey, color) => {
      const groupProjects = projects.filter(p => getProjectStatus(p) === statusKey);
      if (groupProjects.length === 0) return null;
      return (
        <div style={{marginBottom: '50px'}}>
          <div style={{borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
             <div>
                <div style={{color: color, fontWeight: '800', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase'}}>{title}</div>
                <div style={{color: '#666', fontSize: '0.8rem', marginTop: '5px'}}>{subtitle}</div>
             </div>
             <div style={{color: color, fontWeight: 'bold'}}>{groupProjects.length}</div>
          </div>
          <div className="ops-grid">
            {groupProjects.map(p => (
              <div key={p.id} className="ops-card" onClick={() => openProject(p.id)} style={{borderLeft: `4px solid ${color}`}}>
                <div className="ops-card-header"><div className="ops-title">{p.name}</div><div className="status-dot" style={{backgroundColor: color}}></div></div>
                <div className="ops-meta">
                  <span>{p.source.replace('_', ' ')}</span>
                  <span style={{color: color, fontWeight: 'bold'}}>{p.profit ? `$${p.profit}` : '---'}</span>
                </div>
                {statusKey === 'validated' && p.salesHistory && p.salesHistory.length > 0 && (
                   <div style={{marginTop:'10px', fontSize:'0.7rem', color:'var(--accent-success)', fontWeight:'bold'}}>
                     🛒 {p.salesHistory.length} SOLD
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="animate-fade-in">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
          <div>
            <h1 style={{fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '5px'}}>My Workspace</h1>
            <div style={{color: '#888'}}>Manage your investigation lifecycle.</div>
          </div>
          <button onClick={() => setShowModal(true)} style={{background: 'var(--accent-primary)', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>+ NEW TRACKER</button>
        </div>
        {renderSection("📝 Drafting Board", "New ideas and radar picks", "draft", "#ffffff")}
        {renderSection("👁️ Active Tracking", "Live market monitoring", "watchlist", "#00f3ff")}
        {renderSection("✅ Validated Concepts", "Ready for production", "validated", "#00ff9d")}
        {renderSection("⚖️ Stable / Moderate", "Consistent performers", "stable", "#bd00ff")}
        {projects.length === 0 && <div className="console-empty"><div>WORKSPACE EMPTY</div><div style={{fontSize: '0.9rem', marginTop: '10px'}}>Go to Market Radar to find opportunities.</div></div>}
      </div>
    );
  };

  // --- VIEW 4: THE PROFIT MATRIX (NEW!) ---
  const renderMatrixView = () => {
    // 1. Prepare data for the Matrix
    const matrixData = projects.map(p => {
        const materialCost = p.materials ? p.materials.reduce((sum, m) => sum + (m.calculated || 0), 0) : 0;
        const laborCost = (p.laborTime / 60) * p.hourlyWage;
        const totalRevenue = (p.sellingPrice || 0) + (p.shippingCharge || 0);
        const fees = totalRevenue * 0.095 + 0.45;
        const netProfit = totalRevenue - (materialCost + laborCost + fees + (p.shippingCost || 0));
        
        // Return on Time Calculation: (Net Profit + Labor Cost) / Hours Spent
        // We add Labor Cost back in because that's money you pay yourself.
        const hoursSpent = p.laborTime / 60;
        const effectiveHourlyRate = hoursSpent > 0 ? (netProfit + laborCost) / hoursSpent : 0;

        return { ...p, netProfit, hoursSpent, effectiveHourlyRate };
    }).sort((a, b) => b.effectiveHourlyRate - a.effectiveHourlyRate); // Sort by Efficiency

    const bestHourly = matrixData.length > 0 ? matrixData[0] : null;
    const bestTotal = matrixData.sort((a,b) => b.netProfit - a.netProfit)[0];

    return (
      <div className="animate-fade-in">
        <div style={{marginBottom: '40px'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '10px', letterSpacing: '-1px'}}>Profit Matrix</h1>
          <div style={{color: '#888', fontSize: '0.9rem', fontWeight: '500'}}>Efficiency & Time Analysis</div>
        </div>

        {/* HIGHLIGHTS */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px'}}>
            <div className="module-panel" style={{border: '1px solid var(--accent-success)', background: 'rgba(0, 255, 157, 0.05)', marginBottom: 0}}>
                <div style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-success)', fontWeight: 'bold'}}>Most Efficient (Best Use of Time)</div>
                <div style={{fontSize: '1.5rem', fontWeight: '800', color: 'white', marginTop: '10px'}}>{bestHourly ? bestHourly.name : '---'}</div>
                <div style={{fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-success)'}}>${bestHourly ? bestHourly.effectiveHourlyRate.toFixed(2) : '0.00'}<span style={{fontSize: '1rem', color: '#888'}}>/hr</span></div>
            </div>
            <div className="module-panel" style={{border: '1px solid var(--accent-primary)', background: 'rgba(0, 243, 255, 0.05)', marginBottom: 0}}>
                <div style={{fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 'bold'}}>Highest Profit (Cash Cow)</div>
                <div style={{fontSize: '1.5rem', fontWeight: '800', color: 'white', marginTop: '10px'}}>{bestTotal ? bestTotal.name : '---'}</div>
                <div style={{fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-primary)'}}>${bestTotal ? bestTotal.netProfit.toFixed(2) : '0.00'}<span style={{fontSize: '1rem', color: '#888'}}> net</span></div>
            </div>
        </div>

        {/* THE MATRIX TABLE */}
        <div className="module-panel">
            <div className="module-header"><span>Efficiency Leaderboard</span><span>RANKED BY HOURLY RETURN</span></div>
            <table className="cost-table">
                <thead>
                    <tr>
                        <th style={{width: '30%'}}>Project Name</th>
                        <th>Status</th>
                        <th>Time to Make</th>
                        <th>Net Profit</th>
                        <th style={{color: 'var(--accent-success)'}}>Real Hourly Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {matrixData.map(p => (
                        <tr key={p.id}>
                            <td style={{fontWeight: '600', color: 'white'}}>{p.name}</td>
                            <td style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#888'}}>{getProjectStatus(p)}</td>
                            <td>{p.laborTime} mins</td>
                            <td>${p.netProfit.toFixed(2)}</td>
                            <td style={{fontWeight: '800', fontSize: '1.1rem', color: p.effectiveHourlyRate > 30 ? 'var(--accent-success)' : p.effectiveHourlyRate > 15 ? 'var(--accent-warn)' : 'var(--accent-danger)'}}>
                                ${p.effectiveHourlyRate.toFixed(2)}/hr
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
  };

  // --- VIEW 5: PROJECT DETAILS ---
  const renderProjectView = () => {
    if (!activeProject) return <div className="console-empty">PROJECT NOT FOUND</div>;
    const materialCost = activeProject.materials ? activeProject.materials.reduce((sum, m) => sum + (m.calculated || 0), 0) : 0;
    const laborCost = (activeProject.laborTime / 60) * activeProject.hourlyWage;
    const totalRevenue = (activeProject.sellingPrice || 0) + (activeProject.shippingCharge || 0);
    const platformFees = totalRevenue > 0 ? (totalRevenue * 0.095) + 0.45 : 0;
    const netProfit = totalRevenue - (materialCost + laborCost + platformFees + (activeProject.shippingCost || 0));
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const currentStatus = getProjectStatus(activeProject);

    const totalSold = activeProject.salesHistory ? activeProject.salesHistory.length : 0;
    const realRevenue = activeProject.salesHistory ? activeProject.salesHistory.reduce((sum, s) => sum + s.revenue, 0) : 0;

    return (
      <div className="animate-fade-in" style={{paddingBottom: '100px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
          <button onClick={() => navigateTo('workspace')} className="btn-ghost" style={{border: 'none', padding: 0, fontSize: '1.2rem'}}>← Back to Workspace</button>
          <div style={{height: '20px', width: '1px', background: '#333'}}></div>
          <span style={{color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px'}}>Project Detail</span>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px'}}>
          <h1 style={{fontSize: '3rem', margin: 0, fontWeight: 700, color: 'white', letterSpacing: '-1px'}}>{activeProject.name}</h1>
          <div style={{textAlign: 'right'}}>
            <div style={{marginBottom: '10px'}}>{getSourceBadge(activeProject.source)}</div>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
               {currentStatus === 'draft' && <button onClick={() => changeProjectStatus(activeProject.id, 'watchlist')} style={{background: 'transparent', border: '1px solid #00f3ff', color: '#00f3ff', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold'}}>👁️ START TRACKING</button>}
               {currentStatus === 'watchlist' && <button onClick={() => changeProjectStatus(activeProject.id, 'validated')} style={{background: 'transparent', border: '1px solid #00ff9d', color: '#00ff9d', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold'}}>✅ VALIDATE THIS</button>}
               <button onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete this project?")) deleteProject(activeProject.id); }} style={{background: 'transparent', border: '1px solid #333', color: '#666', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'}} title="Delete Project">🗑️</button>
            </div>
          </div>
        </div>

        {currentStatus === 'validated' && (
          <div className="module-panel" style={{border: '1px solid var(--accent-success)', background: 'rgba(0, 255, 157, 0.02)'}}>
            <div className="module-header" style={{borderBottomColor: 'var(--accent-success)'}}>
              <span style={{color: 'var(--accent-success)'}}>Merchant's Ledger</span>
              <span>ACTIVE PRODUCTION</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', gap: '40px'}}>
                <div><div style={{fontSize: '0.8rem', color: '#888', textTransform: 'uppercase'}}>Total Sold</div><div style={{fontSize: '2rem', fontWeight: 'bold', color: 'white'}}>{totalSold} <span style={{fontSize: '1rem', color:'#666'}}>units</span></div></div>
                <div><div style={{fontSize: '0.8rem', color: '#888', textTransform: 'uppercase'}}>Real Revenue</div><div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)'}}>${realRevenue.toFixed(2)}</div></div>
              </div>
              <button onClick={recordSale} style={{background: 'var(--accent-success)', color: 'black', border: 'none', padding: '15px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'}}>
                + RECORD SALE (${(activeProject.sellingPrice + activeProject.shippingCharge).toFixed(2)})
              </button>
            </div>
          </div>
        )}

        <div className="module-panel">
          <div className="module-header"><span>Market Probe Data</span><span>STATUS: {activeProject.demand ? 'ONLINE' : 'SCANNING'}</span></div>
          <div className="data-grid">
            <div className="metric-box"><div className="metric-value">{activeProject.demand || '...'}</div><div className="metric-label">Demand Signal</div></div>
            <div className="metric-box"><div className="metric-value">{activeProject.competition || '...'}</div><div className="metric-label">Competition Density</div></div>
            <div className="metric-box"><div className="metric-value text-success">{activeProject.profit ? `$${activeProject.profit}` : '---'}</div><div className="metric-label">Est. Unit Profit</div></div>
          </div>
        </div>

        <div className="profit-container">
            <div>
              <h4 style={{color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginTop: 0}}>1. Value Your Time</h4>
              <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                <div style={{flex: 1}}><label className="metric-label" style={{display: 'block', marginBottom: '5px'}}>Minutes to Make</label><input className="cost-input" type="number" value={activeProject.laborTime} onChange={(e) => updateFinancials('laborTime', e.target.value)} /></div>
                <div style={{flex: 1}}><label className="metric-label" style={{display: 'block', marginBottom: '5px'}}>Hourly Wage ($)</label><input className="cost-input" type="number" value={activeProject.hourlyWage} onChange={(e) => updateFinancials('hourlyWage', e.target.value)} /></div>
              </div>
              <h4 style={{color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginTop: '30px'}}>2. Selling Strategy</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div><label className="metric-label" style={{display: 'block', marginBottom: '5px'}}>Retail Price ($)</label><input className="cost-input" type="number" value={activeProject.sellingPrice} onChange={(e) => updateFinancials('sellingPrice', e.target.value)} /></div>
                <div><label className="metric-label" style={{display: 'block', marginBottom: '5px'}}>Shipping Charged ($)</label><input className="cost-input" type="number" value={activeProject.shippingCharge} onChange={(e) => updateFinancials('shippingCharge', e.target.value)} /></div>
              </div>
              <div style={{marginTop: '20px'}}><label className="metric-label" style={{display: 'block', marginBottom: '5px'}}>Actual Cost to Ship ($)</label><input className="cost-input" type="number" value={activeProject.shippingCost} onChange={(e) => updateFinancials('shippingCost', e.target.value)} /></div>
            </div>
            <div className="profit-card">
              <h4 style={{color: 'white', textTransform: 'uppercase', fontSize: '0.9rem', marginTop: 0, textAlign: 'center', letterSpacing: '1px'}}>Projected Profit</h4>
              <div style={{marginBottom: '15px', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem'}}><span>Gross Revenue</span><span>${totalRevenue.toFixed(2)}</span></div>
              </div>
              <div style={{marginBottom: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)', marginBottom: '5px', fontSize: '0.9rem'}}><span>- Material Cost</span><span>${materialCost.toFixed(2)}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)', marginBottom: '5px', fontSize: '0.9rem'}}><span>- Labor Cost ({activeProject.laborTime} min)</span><span>${laborCost.toFixed(2)}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)', marginBottom: '5px', fontSize: '0.9rem'}}><span>- Platform Fees (~9.5%)</span><span>${platformFees.toFixed(2)}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)', marginBottom: '5px', fontSize: '0.9rem'}}><span>- Shipping Cost</span><span>${activeProject.shippingCost.toFixed(2)}</span></div>
              </div>
              <div style={{borderTop: '2px solid #444', paddingTop: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '1rem', fontWeight: 'bold', color: 'white'}}>TRUE NET PROFIT</span>
                  <span style={{fontSize: '2.2rem', fontWeight: '700', color: netProfit > 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}}>${netProfit.toFixed(2)}</span>
                </div>
                <div style={{textAlign: 'right', fontSize: '0.8rem', color: profitMargin > 20 ? 'var(--accent-success)' : 'var(--accent-warn)', marginTop: '5px', fontWeight: '600'}}>Margin: {profitMargin.toFixed(1)}% {profitMargin > 20 ? '✅ Healthy' : '⚠ Low'}</div>
              </div>
            </div>
        </div>

        <div className="module-panel" style={{marginTop: '40px'}}>
          <div className="module-header"><span>Material Cost Manifest</span><span>INPUT_MODE: ACTIVE</span></div>
          <table className="cost-table">
            <thead><tr><th style={{width: '20%'}}>Material Name</th><th>Cost ($)</th><th>Bought Qty</th><th>Unit</th><th>Used Qty</th><th>Item Cost</th><th>Action</th></tr></thead>
            <tbody>
              {activeProject.materials && activeProject.materials.map((mat) => (
                <tr key={mat.id}>
                  <td><input className="cost-input" value={mat.name} onChange={(e) => handleMaterialChange(mat.id, 'name', e.target.value)} /></td>
                  <td><input className="cost-input" type="number" value={mat.price} onChange={(e) => handleMaterialChange(mat.id, 'price', e.target.value)} /></td>
                  <td><input className="cost-input" type="number" value={mat.bought} onChange={(e) => handleMaterialChange(mat.id, 'bought', e.target.value)} /></td>
                  <td><select className="cost-input" value={mat.unit} onChange={(e) => handleMaterialChange(mat.id, 'unit', e.target.value)}><option value="lbs">lbs</option><option value="oz">oz</option><option value="g">g</option><option value="kg">kg</option></select></td>
                  <td><input className="cost-input" type="number" value={mat.used} onChange={(e) => handleMaterialChange(mat.id, 'used', e.target.value)} /></td>
                  <td style={{color: mat.calculated ? 'var(--accent-success)' : '#666', fontWeight: 'bold'}}>{mat.calculated ? `$${mat.calculated}` : '---'}</td>
                  <td><button onClick={() => calculateRow(mat)} className="btn-ghost">CALC</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:'20px', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
            <button onClick={addMaterialRow} className="btn-ghost">+ Add Row</button>
            <div style={{textAlign:'right', fontSize:'1.1rem', color:'#aaa', fontWeight: '500'}}>Material Subtotal: <span style={{color: 'white', fontWeight: 'bold'}}>${materialCost.toFixed(2)}</span></div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="console-container">
      {/* MISSION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="mission-modal">
            <div className="modal-title">Initialize Mission Protocol</div>
            <div className="strategy-grid">
              <div className={`strategy-card ${strategy === 'sniper' ? 'selected' : ''}`} onClick={() => setStrategy('sniper')}><span className="strategy-icon">🎯</span><span className="strategy-name">Sniper Probe</span></div>
              <div className={`strategy-card ${strategy === 'radar' ? 'selected' : ''}`} onClick={() => setStrategy('radar')}><span className="strategy-icon">📡</span><span className="strategy-name">Sector Scan</span></div>
            </div>
            <div className="input-group">
              <label className="input-label">{strategy === 'sniper' ? 'TARGET ITEM NAME' : 'MARKET SECTOR'}</label>
              <input className="mission-input" autoFocus value={missionName} onChange={(e) => setMissionName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && launchMission()} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>ABORT</button>
              <button className="btn-launch" onClick={launchMission}>LAUNCH</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="console-sidebar">
        <div style={{marginBottom: '20px'}}>
          <div className={`nav-link ${activeView === 'radar' || activeView === 'sector-detail' ? 'active' : ''}`} onClick={() => navigateTo('radar')}>
            <span className="nav-icon">📡</span><span>MARKET RADAR</span>
          </div>
          <div className={`nav-link ${activeView === 'workspace' || activeView === 'project' ? 'active' : ''}`} onClick={() => navigateTo('workspace')}>
            <span className="nav-icon">☷</span><span>MY WORKSPACE</span>
          </div>
          <div className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`} onClick={() => navigateTo('matrix')}>
            <span className="nav-icon">📊</span><span>PROFIT MATRIX</span>
          </div>
        </div>
      </aside>

      {/* MAIN STAGE */}
      <main className="console-main">
        {activeView === 'radar' && renderRadarView()}
        {activeView === 'sector-detail' && renderSectorDetail()}
        {activeView === 'workspace' && renderWorkspaceView()}
        {activeView === 'project' && renderProjectView()}
        {activeView === 'matrix' && renderMatrixView()}
      </main>
    </div>
  );
};