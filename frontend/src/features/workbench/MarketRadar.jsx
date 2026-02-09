import React, { useState, useEffect } from 'react';
import './ConsoleLayout.css';
import './MissionModal.css';

// --- SUB-COMPONENT: COCKPIT DIAL ---
const CockpitDial = ({ label, value, subtext, color, percent, onClick }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percent / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div className="cockpit-dial-wrapper" onClick={onClick}>
       <svg className="dial-svg" viewBox="0 0 120 120">
         <circle className="dial-bg" cx="60" cy="60" r={radius} />
         <circle 
           className="dial-progress" 
           cx="60" cy="60" r={radius} 
           style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: `var(--${color})` }}
         />
       </svg>
       <div className="dial-center-content">
          <div className="dial-value" style={{color: `var(--${color})`}}>{value}</div>
       </div>
       <div className="dial-label">{label}</div>
       <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'4px'}}>{subtext}</div>
    </div>
  );
};

// --- SUB-COMPONENT: MINI RADAR ---
const MiniRadar = ({ color, percent }) => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="15" fill="none" stroke="var(--bg-hover)" strokeWidth="3" />
    <circle cx="20" cy="20" r="15" fill="none" stroke={`var(--${color})`} strokeWidth="3" 
            strokeDasharray={`${2 * Math.PI * 15}`} 
            strokeDashoffset={`${(2 * Math.PI * 15) * (1 - percent/100)}`} 
            transform="rotate(-90 20 20)" />
  </svg>
);

// --- SUB-COMPONENT: LIVE TICKER SIDEBAR ---
const KeywordSidebar = () => {
  // 1. Initial Data State
  const [marketList, setMarketList] = useState([
    { id: 'k1', t: "modern cat tower", s: 98, delta: 0 },
    { id: 'k2', t: "mushroom lamp", s: 95, delta: 0 },
    { id: 'k3', t: "bamboo organizer", s: 88, delta: 0 },
    { id: 'k4', t: "coffin shelf", s: 82, delta: 0 },
    { id: 'k5', t: "chunky knit blanket", s: 75, delta: 0 },
    { id: 'k6', t: "personalized mug", s: 64, delta: 0 },
    { id: 'k7', t: "linen dress", s: 55, delta: 0 },
    { id: 'k8', t: "brass candlestick", s: 48, delta: 0 },
  ]);

  // 2. The "Stock Market" Simulation Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketList(currentList => {
        // A. Randomly adjust scores
        const updated = currentList.map(item => {
          const change = Math.floor(Math.random() * 7) - 3; // Random shift between -3 and +3
          let newScore = item.s + change;
          // Clamp score between 0 and 100
          if (newScore > 100) newScore = 100;
          if (newScore < 0) newScore = 0;

          return {
            ...item,
            s: newScore,
            delta: change // Store the change to determine color (Green/Red)
          };
        });

        // B. Re-sort the list based on new scores (Leaderboard effect)
        return updated.sort((a, b) => b.s - a.s);
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="keyword-sidebar">
      <div className="keyword-header">
        <h3 style={{margin:0, color:'var(--neon-cyan)', fontSize:'1rem', letterSpacing:'1px', textTransform:'uppercase'}}>
          HYPE STREAM
        </h3>
        <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'5px'}}>
           <div className="live-dot pulse"></div>
           <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>REAL-TIME DRIP</span>
        </div>
      </div>
      
      <div className="keyword-list">
        {marketList.map((k) => (
          <div key={k.id} className={`tag-row ${k.delta > 0 ? 'flash-green' : (k.delta < 0 ? 'flash-red' : '')}`}>
            <span style={{fontFamily:'Inter, monospace', flex:1}}>#{k.t}</span>
            
            {/* The Stock Ticker Values */}
            <div style={{display:'flex', alignItems:'center', gap:'10px', minWidth:'60px', justifyContent:'flex-end'}}>
               {k.delta !== 0 && (
                 <span style={{
                    fontSize:'0.7rem', 
                    color: k.delta > 0 ? 'var(--neon-teal)' : 'var(--neon-orange)',
                    fontWeight:'bold'
                 }}>
                   {k.delta > 0 ? '▲' : '▼'} {Math.abs(k.delta)}
                 </span>
               )}
               <span className="tag-score" style={{
                  color: k.delta > 0 ? 'var(--neon-teal)' : (k.delta < 0 ? 'var(--neon-orange)' : 'var(--text-muted)')
               }}>
                 {k.s}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Demand */}
      <div style={{padding:'20px', borderTop:'1px solid var(--border-subtle)', background:'rgba(0,0,0,0.2)'}}>
        <h4 style={{margin:'0 0 15px 0', color:'white', fontSize:'0.7rem', letterSpacing:'1px'}}>CLOUT MAP</h4>
        <div style={{display:'flex', gap:'6px', height:'60px', alignItems:'flex-end'}}>
           {/* Hardcoded visualization for the "Heatmap" effect */}
           <div style={{flex:1, height:'65%', background:'linear-gradient(0deg, #2dd4bf20 0%, #2dd4bf 100%)', borderTop:'2px solid var(--neon-teal)'}}></div>
           <div style={{flex:1, height:'80%', background:'linear-gradient(0deg, #22d3ee20 0%, #22d3ee 100%)', borderTop:'2px solid var(--neon-cyan)'}}></div>
           <div style={{flex:1, height:'40%', background:'linear-gradient(0deg, #a78bfa20 0%, #a78bfa 100%)', borderTop:'2px solid var(--neon-purple)'}}></div>
        </div>
        <div style={{display:'flex', gap:'5px', marginTop:'8px'}}>
           <div style={{flex:1, fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center', fontWeight:'700'}}>USA</div>
           <div style={{flex:1, fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center', fontWeight:'700'}}>ASIA</div>
           <div style={{flex:1, fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center', fontWeight:'700'}}>EU</div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: PRODUCT INSPECTOR ---
const ProductInspector = ({ item, onClose }) => {
  const [notification, setNotification] = useState('');

  const handleCopyTags = () => {
    navigator.clipboard.writeText(item.tags.join(', '));
    setNotification('COPIED TO CLIPBOARD');
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn-ghost" onClick={onClose}>← BACK TO FEED</button>
        {notification && <div className="uplink-badge" style={{borderColor:'var(--neon-teal)', color:'var(--neon-teal)'}}>{notification}</div>}
      </div>

      <div className="inspector-container">
        <div className="inspector-visual">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="inspector-data">
          <div className="dossier-header">
            <h2 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>{item.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span className="uplink-badge" style={{color:'var(--neon-blue)', borderColor:'var(--neon-blue)'}}>SOURCE: {item.shop}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FOUND: 2H AGO</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-stat"><label>LIST PRICE</label><span>${item.price.toFixed(2)}</span></div>
            <div className="dossier-stat"><label>POTENTIAL</label><span style={{color:'var(--neon-teal)'}}>${(item.price * 12).toFixed(2)}/mo</span></div>
            <div className="dossier-stat"><label>EYEBALLS</label><span>{item.views}</span></div>
            <div className="dossier-stat"><label>CONVERSION</label><span>{((12 / item.views) * 100).toFixed(1)}%</span></div>
          </div>
          
          <div style={{marginTop:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
               <label style={{fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase'}}>DETECTED TAGS</label>
               <button className="btn-ghost" style={{padding:'4px 8px', fontSize:'0.7rem'}} onClick={handleCopyTags}>COPY ALL</button>
            </div>
            <div className="tag-cloud">
              {item.tags.map((tag, i) => (
                <span key={i} className="tag-chip" style={{color:'var(--neon-cyan)', borderColor:'var(--neon-cyan)', border:'1px solid'}}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{display:'flex', gap:'15px', marginTop:'auto', paddingTop:'30px'}}>
            <button className="btn-primary" style={{flex:1, marginTop:0}}>TRACK THIS ITEM</button>
            <button className="btn-ghost" style={{flex:1, marginTop:0}} onClick={() => window.open('https://etsy.com', '_blank')}>VIEW SOURCE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketRadar = () => {
  const [radarView, setRadarView] = useState('global'); 
  const [activeSector, setActiveSector] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [selectedGlobalMetric, setSelectedGlobalMetric] = useState(null);

  // --- DATA CATEGORIZATION ---
  const topMovers = [
    { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, vol: "18k", comp: "Low", status: "BLUE OCEAN", color: "neon-teal", desc: "Modern furniture for cats & dogs." },
    { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, vol: "45k", comp: "Med", status: "SURGING", color: "neon-teal", desc: "Dark aesthetic, witchy vibes, coffin shelves." },
    { id: 'tm3', name: "Cyberpunk Apparel", growth: "+45%", score: 60, vol: "12k", comp: "Low", status: "EMERGING", color: "neon-purple", desc: "LED embedded clothing, tech-wear aesthetic." }
  ];

  const highTraffic = [
    { id: 'ht1', name: "Digital Planners", growth: "-12%", score: 30, vol: "120k", comp: "High", status: "SATURATED", color: "neon-orange", desc: "iPad templates, GoodNotes files." },
    { id: 'ht2', name: "Wedding Invites", growth: "+22%", score: 55, vol: "85k", comp: "High", status: "STEADY", color: "neon-blue", desc: "Editable Canva templates for brides." },
    { id: 'ht3', name: "Minimalist Jewelry", growth: "+15%", score: 50, vol: "60k", comp: "Very High", status: "STABLE", color: "neon-blue", desc: "Gold filled stacking rings." }
  ];

  const emergingTrends = [
    { id: 'et1', name: "Fungi Decor", growth: "+300%", score: 92, vol: "5k", comp: "Low", status: "NEW", color: "neon-orange", desc: "Mushroom shaped lamps and pillows." },
    { id: 'et2', name: "Eco Storage", growth: "+85%", score: 70, vol: "32k", comp: "Low", status: "PRIME", color: "neon-cyan", desc: "Bamboo organization, raw materials." }
  ];

  const globalMetricIntel = {
    mover: { title: "POPPING OFF: PET ARCHITECTURE", val: "+210%", desc: "Viral Trend Alert: Luxury cat furniture is exploding on TikTok.", advice: "ACTION: Look for 'Wall-mounted cat steps'." },
    vol: { title: "CLOUT LEVEL: PLANNERS", val: "120k", desc: "Digital Planners have massive volume, but high competition.", advice: "STRATEGY: Niche down to 'Nurse Planners'." },
    mood: { title: "THE VIBE: BUYING SZN", val: "HIGH", desc: "Overall Etsy traffic is up 15%. Shoppers are in 'Gift Mode'.", advice: "SIGNAL: Safe to launch higher-ticket items." },
    new: { title: "FRESH DROP: FUNGI DECOR", val: "NEW", desc: "Spike in 'Mushroom Lamp' searches detected.", advice: "OPPORTUNITY: Jump in now before it gets crowded." }
  };

  const handleBackToGlobal = () => {
    setRadarView('global');
    setActiveSector(null);
    setSelectedItem(null);
    setSelectedGlobalMetric(null);
  };

  if (selectedItem) {
    return (
      <ProductInspector item={selectedItem} onClose={() => setSelectedItem(null)} />
    );
  }

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        
        {/* HEADER & TOGGLE */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
           <h2 style={{margin:0, color:'white', fontSize:'2rem', letterSpacing:'-1px'}}>
             {radarView === 'sector' ? `NICHE: ${activeSector.name.toUpperCase()}` : 'THE ZEITGEIST'}
           </h2>
           
           {radarView === 'sector' && <button className="btn-ghost" onClick={handleBackToGlobal}>← BACK TO FEED</button>}
        </div>

        {/* COCKPIT DIALS (HUD) */}
        <div className="cockpit-grid">
           {/* Timeframe Tag */}
           <div className="timeframe-tag">LIVE HYPE</div>
           
           <CockpitDial label="Popping Off" value="+210%" subtext="Pet Arch." color="neon-teal" percent={100} onClick={() => setSelectedGlobalMetric('mover')} />
           <CockpitDial label="Clout Level" value="120k" subtext="Planners" color="neon-blue" percent={85} onClick={() => setSelectedGlobalMetric('vol')} />
           <CockpitDial label="The Vibe" value="HIGH" subtext="Buying Szn" color="neon-cyan" percent={95} onClick={() => setSelectedGlobalMetric('mood')} />
           <CockpitDial label="Fresh Drop" value="NEW" subtext="Fungi Decor" color="neon-orange" percent={40} onClick={() => setSelectedGlobalMetric('new')} />
        </div>

        {/* METRIC MODAL */}
        {selectedGlobalMetric && (
          <div className="modal-overlay" onClick={() => setSelectedGlobalMetric(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth:'600px', border:'1px solid var(--neon-cyan)'}}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h2 style={{color: 'var(--neon-cyan)', margin:0}}>{globalMetricIntel[selectedGlobalMetric].title}</h2>
                  <button className="btn-ghost" onClick={() => setSelectedGlobalMetric(null)}>CLOSE</button>
               </div>
               <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'30px'}}>
                  <div>
                    <div style={{fontSize:'3rem', fontWeight:'800', color:'white'}}>{globalMetricIntel[selectedGlobalMetric].val}</div>
                    <div className="uplink-badge" style={{display:'inline-block', marginTop:'15px', color:'var(--neon-teal)', borderColor:'var(--neon-teal)'}}>LIVE DATA</div>
                  </div>
                  <div>
                    <p style={{fontSize:'1.1rem', lineHeight:'1.6', color:'var(--text-main)', marginTop:0}}>{globalMetricIntel[selectedGlobalMetric].desc}</p>
                    <div style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px', borderLeft:'4px solid var(--neon-teal)', marginTop:'15px'}}>
                      <strong style={{color:'var(--neon-teal)'}}>THE PLAY:</strong> {globalMetricIntel[selectedGlobalMetric].advice}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* SEASONAL TICKER */}
        <div style={{overflow:'hidden', whiteSpace:'nowrap', marginBottom:'30px', background:'rgba(255,255,255,0.02)', padding:'10px', borderRadius:'4px'}}>
           <div className="ticker-wrap">
              <div className="ticker-move" style={{color:'var(--neon-cyan)', fontSize:'0.85rem', fontWeight:'600'}}>
                 💎 CURRENT META: "Q4 Gift Mode" Activated • "Black Friday" Hype +120% • "Personalized" is Winning • "Halloween" is Dead •
              </div>
           </div>
        </div>

        {/* --- CATEGORY SLIDERS --- */}
        {radarView === 'global' && (
          <div className="animate-fade-in">
            
            {/* 1. TOP MOVERS */}
            <div className="section-header-row">
              <h3 className="section-title"><span style={{color:'var(--neon-teal)'}}>▲</span> VIRAL HITS</h3>
              <button className="btn-ghost">SEE ALL</button>
            </div>
            <div className="ops-scroller">
              {topMovers.map(sector => (
                 <SectorCard key={sector.id} sector={sector} onClick={() => { setActiveSector(sector); setRadarView('sector'); }} />
              ))}
            </div>

            {/* 2. HIGH TRAFFIC */}
            <div className="section-header-row">
              <h3 className="section-title"><span style={{color:'var(--neon-blue)'}}>●</span> MAIN CHARACTER ENERGY</h3>
              <button className="btn-ghost">SEE ALL</button>
            </div>
            <div className="ops-scroller">
              {highTraffic.map(sector => (
                 <SectorCard key={sector.id} sector={sector} onClick={() => { setActiveSector(sector); setRadarView('sector'); }} />
              ))}
            </div>

            {/* 3. EMERGING / NEW */}
            <div className="section-header-row">
              <h3 className="section-title"><span style={{color:'var(--neon-orange)'}}>★</span> IYKYK (HIDDEN GEMS)</h3>
              <button className="btn-ghost">SEE ALL</button>
            </div>
            <div className="ops-scroller">
              {emergingTrends.map(sector => (
                 <SectorCard key={sector.id} sector={sector} onClick={() => { setActiveSector(sector); setRadarView('sector'); }} />
              ))}
            </div>

          </div>
        )}

      </div>

      <KeywordSidebar />

    </div>
  );
};

// --- REUSABLE CARD COMPONENT ---
const SectorCard = ({ sector, onClick }) => (
  <div className="ops-panel" style={{borderLeftColor: `var(--${sector.color})`}} onClick={onClick}>
    <div className="ops-panel-inner">
      <div className="panel-header">
         <h3 className="panel-title">{sector.name}</h3>
         <MiniRadar color={sector.color} percent={sector.score || 70} />
      </div>
      <div className="growth-big">{sector.growth}</div>
      <div className="panel-desc">{sector.desc}</div>
      <div className="panel-footer">
         <div className="mini-stat">
            <span className="mini-label">VOLUME</span>
            <span className="mini-val">{sector.vol}</span>
         </div>
         <div className="mini-stat">
            <span className="mini-label">COMP</span>
            <span className="mini-val" style={{color: sector.comp === 'High' ? 'var(--neon-orange)' : 'var(--text-main)'}}>{sector.comp}</span>
         </div>
         <span className="uplink-badge" style={{color: `var(--${sector.color})`}}>{sector.status}</span>
      </div>
    </div>
  </div>
);