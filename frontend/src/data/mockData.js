export const MOCK_PROJECTS = [
  { 
    id: 1, 
    name: 'Midnight Owl Candle', 
    demand: 'High', 
    competition: 'Medium', 
    profit: 12.50, // This is now a calculated field in the UI, but we keep a fallback here
    status: 'active', 
    source: 'REAL_ETSY',
    listings: [
      { id: 901, title: 'Mystic Owl Soy Candle - Lavender', price: 18.00, url: '#' },
      { id: 902, title: 'Large 3-Wick Owl Candle', price: 32.50, url: '#' },
      { id: 903, title: 'Midnight Blue Wax Melt', price: 8.00, url: '#' }
    ],
    // --- NEW: THE REALITY CHECK DATA ---
    sellingPrice: 25.00,  // What I want to sell it for
    shippingCost: 8.00,   // What it costs me to mail it
    shippingCharge: 0.00, // "Free Shipping" means I charge $0
    laborTime: 45,        // Minutes
    hourlyWage: 20.00,    // My time value
    // -----------------------------------
    materials: [
      { id: 101, name: 'Soy Wax', price: 45.00, bought: 10, unit: 'lbs', used: 0.5, calculated: 2.25 },
      { id: 102, name: 'Midnight Oil', price: 24.00, bought: 16, unit: 'oz', used: 1.0, calculated: 1.50 },
      { id: 103, name: 'Glass Jar', price: 12.00, bought: 12, unit: 'g', used: 1, calculated: 1.00 }
    ]
  },
  { 
    id: 2, 
    name: 'Steampunk Goggles', 
    demand: 'Medium', competition: 'Low', profit: 45.00, status: 'active', source: 'MOCK_SIMULATION',
    listings: [],
    sellingPrice: 85.00, shippingCost: 12.00, shippingCharge: 12.00, laborTime: 120, hourlyWage: 35.00,
    materials: [
      { id: 201, name: 'Brass Fittings', price: 15.50, bought: 20, unit: 'g', used: 4, calculated: 3.10 },
      { id: 202, name: 'Leather Strap', price: 30.00, bought: 50, unit: 'in', used: 12, calculated: 7.20 }
    ]
  },
  { 
    id: 3, 
    name: 'Resin Skull', 
    demand: null, competition: null, profit: null, status: 'scanning', source: 'CONNECTING...',
    sellingPrice: 0, shippingCost: 0, shippingCharge: 0, laborTime: 0, hourlyWage: 15.00,
    listings: [], materials: []
  }
];