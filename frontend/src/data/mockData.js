export const MOCK_PROJECTS = [
  { 
    id: 'proj-001', 
    title: 'Obsidian Soy Candle', 
    status: 'active',
    demand: 'High',
    competition: 'Medium',
    created_at: '2026-02-08T10:00:00Z',
    tags: ['Home Decor', 'Minimalist', 'Noir Series'],
    missions: [
      { id: 101, title: 'Wick Testing (CD-12)', status: 'completed' },
      { id: 102, title: 'Fragrance Load Optimization', status: 'in-progress' },
      { id: 103, title: 'Cure Time Analysis', status: 'pending' }
    ]
  },
  { 
    id: 'proj-003', 
    title: 'Botanical Reed Diffuser', 
    status: 'active',
    demand: 'Medium',
    competition: 'High',
    created_at: '2026-02-10T09:15:00Z',
    tags: ['Aromatherapy', 'Glassware', 'Refillable'],
    missions: [
      { id: 301, title: 'Sourcing Rattan Reeds', status: 'completed' },
      { id: 302, title: 'Label Design V2', status: 'pending' }
    ]
  },
  { 
    id: 'proj-004', 
    title: 'Brass Geo-Planter', 
    status: 'draft',
    demand: 'Unknown',
    competition: 'Unknown',
    created_at: '2026-02-11T11:00:00Z',
    tags: ['Metalwork', 'Plants', 'Modern'],
    missions: []
  },
  { 
    id: 'proj-006', 
    title: 'Neon Wall Sign', 
    status: 'draft',
    demand: 'High',
    competition: 'Medium',
    created_at: '2026-02-12T09:00:00Z',
    tags: ['Lighting', 'Decor'],
    missions: []
  },
  // --- CATALOGED (COMPLETED) ITEMS ---
  { 
    id: 'proj-002', 
    title: 'Walnut Device Stand', 
    status: 'completed',
    demand: 'Very High',
    competition: 'Low',
    created_at: '2026-01-15T14:30:00Z',
    tags: ['Woodworking', 'Office', 'Premium'],
    missions: []
  },
  { 
    id: 'proj-007', 
    title: 'Leather Desk Mat', 
    status: 'completed',
    demand: 'Medium',
    competition: 'Medium',
    created_at: '2025-12-20T10:00:00Z',
    tags: ['Leather', 'Office'],
    missions: []
  },
  { 
    id: 'proj-008', 
    title: 'Concrete Coaster Set', 
    status: 'completed',
    demand: 'Low',
    competition: 'High',
    created_at: '2025-11-05T09:00:00Z',
    tags: ['Concrete', 'Home Decor', 'Industrial'],
    missions: []
  },
  { 
    id: 'proj-009', 
    title: 'Copper Lamp Base', 
    status: 'completed',
    demand: 'High',
    competition: 'High',
    created_at: '2025-10-15T11:00:00Z',
    tags: ['Lighting', 'Metalwork'],
    missions: []
  },
  // --- HALTED ITEMS ---
  { 
    id: 'proj-005', 
    title: 'Cyber-Resin Coaster', 
    status: 'on_hold', 
    demand: 'Low',
    competition: 'High',
    created_at: '2026-02-01T09:00:00Z',
    tags: ['Resin', 'Cyberpunk', 'Tabletop'],
    missions: []
  }
];