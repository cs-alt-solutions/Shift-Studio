export const MOCK_PROJECTS = [
  { 
    id: 1, 
    title: 'Vintage Brass Candle Holder', 
    status: 'active',
    demand: 'High',
    competition: 'Medium',
    created_at: '2023-10-27T10:00:00Z',
    missions: [
      { id: 101, title: 'Keyword Research', status: 'completed' },
      { id: 102, title: 'Draft Description', status: 'in-progress' },
      { id: 103, title: 'Competitor Pricing Analysis', status: 'pending' }
    ]
  },
  { 
    id: 2, 
    title: 'Handwoven Wool Scarf', 
    status: 'draft',
    demand: 'Medium',
    competition: 'Low',
    created_at: '2023-10-25T14:30:00Z',
    missions: [
      { id: 201, title: 'Photo Editing', status: 'pending' }
    ]
  },
  { 
    id: 3, 
    title: 'Digital Planner Template', 
    status: 'completed',
    demand: 'Very High',
    competition: 'High',
    created_at: '2023-10-20T09:15:00Z',
    missions: []
  }
];

export const MOCK_SECTOR_INTEL = {
  trending: ['Minimalist Decor', 'Eco-friendly packaging', 'Digital Downloads'],
  seasonal: 'Holiday gift wrapping is peaking in search trends.'
};