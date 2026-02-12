/* src/data/mockData.js */

export const INITIAL_MATERIALS = [
  // ... Existing Materials ...
  { id: 101, name: 'Soy Wax', brand: 'Golden Brands 464', category: 'Raw Material', qty: 45, unit: 'lbs', costPerUnit: 3.50, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-09', history: [] },
  { id: 102, name: 'Glass Jars', brand: '8oz Amber', category: 'Packaging', qty: 120, unit: 'count', costPerUnit: 1.10, status: 'Active', usageType: 'Project Component', lastUsed: '2025-11-15', history: [] },
  { id: 106, name: 'Fragrance Oil', brand: 'Santal & Coconut', category: 'Raw Material', qty: 32, unit: 'oz', costPerUnit: 2.20, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-10', history: [] },
  
  // --- NEW: LOGISTICS DATA ---
  { id: 201, name: 'Shipping Boxes', brand: '6x6x6 Kraft', category: 'Shipping', qty: 14, unit: 'count', costPerUnit: 0.85, status: 'Active', usageType: 'Logistics', lastUsed: '2026-02-11', history: [] },
  { id: 202, name: 'Bubble Mailers', brand: 'Poly #0', category: 'Shipping', qty: 150, unit: 'count', costPerUnit: 0.45, status: 'Active', usageType: 'Logistics', lastUsed: '2026-02-08', history: [] },
  { id: 203, name: 'Packing Tape', brand: 'Heavy Duty Clear', category: 'Shipping', qty: 2, unit: 'rolls', costPerUnit: 3.50, status: 'Active', usageType: 'Logistics', lastUsed: '2026-02-12', history: [] },
  { id: 204, name: 'Thermal Labels', brand: '4x6 Shipping', category: 'Shipping', qty: 450, unit: 'count', costPerUnit: 0.02, status: 'Active', usageType: 'Logistics', lastUsed: '2026-02-12', history: [] },
  { id: 205, name: 'Crinkle Fill', brand: 'Kraft Paper', category: 'Shipping', qty: 0, unit: 'lbs', costPerUnit: 12.00, status: 'Active', usageType: 'Logistics', lastUsed: '2025-12-20', history: [] },
];

export const INITIAL_INSIGHTS = [
  { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, desc: "Modern furniture for pets." },
  { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, desc: "Dark aesthetic pieces." },
];

export const MARKET_TICKER_DATA = [
    { label: "SOY WAX", trend: "up", value: "$2.15/lb" },
    { label: "FRAGRANCE OIL", trend: "neutral", value: "$18.50/lb" },
    { label: "SHIPPING (DOMESTIC)", trend: "down", value: "$4.20/avg" },
    { label: "BEESWAX", trend: "up", value: "$8.50/lb" },
    { label: "GLASS JARS (8oz)", trend: "neutral", value: "$0.85/ea" },
    { label: "WICKING (CD-12)", trend: "down", value: "$0.05/ea" }
];

export const MOCK_PROJECTS = [
  { 
    id: 'proj-001', 
    title: 'Obsidian Soy Candle', 
    status: 'active',
    demand: 'High',
    competition: 'Medium',
    created_at: '2026-02-08T10:00:00Z',
    tags: ['Home Decor', 'Minimalist', 'Noir Series'],
    missions: []
  },
  { 
    id: 'proj-003', 
    title: 'Botanical Reed Diffuser', 
    status: 'active',
    demand: 'Medium',
    competition: 'High',
    created_at: '2026-02-10T09:15:00Z',
    tags: ['Aromatherapy', 'Glassware', 'Refillable'],
    missions: []
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
  }
];