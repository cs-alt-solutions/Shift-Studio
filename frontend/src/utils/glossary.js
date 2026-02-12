/* src/utils/glossary.js */
import { DashboardIcon, WorkshopIcon, Box, Finance, Radar } from '../components/Icons';

export const TERMINOLOGY = {
  BOOT: {
    KERNEL: "WAKING SYSTEMS...",
    MARKET: "SYNCING MARKET DATA...",
    SECURE: "SECURING WORKSPACE...",
    ASSETS: "LOADING ASSETS...",
    GRANTED: "WELCOME BACK."
  },
  GENERAL: {
    APP_NAME: "SHIFT STUDIO",
    VERSION: "v2.0",
    SYSTEMS_LABEL: "COMMAND CENTER", // Leveling up the label
    SAVE: "SAVE WORK",
    CLOSE: "EXIT",
    ID_LABEL: "REF-ID",
    UNITS: "UNITS",
    CATEGORY: "CATEGORY"
  },
  DASHBOARD: {
    TELEMETRY: "SYSTEM TELEMETRY",
    LIVE_FEED: "PRODUCTION STREAM",
    MARKET_PULSE: "PREDICTIVE RADAR",
    UPTIME: "SYSTEM UPTIME",
    SYNC: "ETSY SYNC STATUS",
    LOAD: "DATABASE LOAD"
  },
  STATUS: {
    ACTIVE: "IN PROGRESS",
    DRAFT: "DRAFT",
    COMPLETED: "CATALOGED",
    ON_HOLD: "ON ICE", 
    LOW_STOCK: "RUNNING LOW",
    OUT_OF_STOCK: "OUT OF STOCK", // Recalibrated from Sold Out
    STOCKED: "STOCKED",
    LOW: "LOW"
  },
  FINANCE: {
    HEADER: "PROFIT MATRIX",
    SUBTITLE: "Track your margins and revenue",
    NET: "TAKE HOME",
    LIVE_STATUS: "LIVE DATA ACTIVE"
  },
  WORKSHOP: {
    HUB_HEADER: "THE WORKSHOP",
    HUB_SUBTITLE: "Current builds and blueprints",
    ACTIVE_OPS: "ACTIVE BUILDS",
    NEW_PROJECT: "NEW PROJECT"
  },
  INVENTORY: {
    HEADER: "RESOURCE DEPOT",
    MANIFEST_LABEL: "ALL RESOURCES",
    NOTIFICATIONS: "ALERTS"
  },
  MARKET: {
    HEADER: "MARKET RADAR",
    SCANNING: "FETCHING TRENDS..."
  }
};

export const NAV_LINKS = [
  { id: 'dashboard', label: 'SYSTEMS_LABEL', Icon: DashboardIcon },
  { id: 'workshop', label: 'HUB_HEADER', Icon: WorkshopIcon, category: 'WORKSHOP' },
  { id: 'inventory', label: 'HEADER', Icon: Box, category: 'INVENTORY' },
  { id: 'matrix', label: 'HEADER', Icon: Finance, category: 'FINANCE' },
  { id: 'radar', label: 'HEADER', Icon: Radar, category: 'MARKET' }
];

export const CATEGORY_KEYWORDS = {
  'Raw Material': ['wax', 'oil', 'fragrance', 'scent', 'soy', 'beeswax', 'dye', 'pigment'],
  'Packaging':    ['jar', 'bottle', 'lid', 'label', 'sticker', 'bag', 'pouch', 'tin'],
  'Shipping':     ['box', 'mailer', 'bubble', 'tape', 'packing', 'peanut', 'wrap'],
  'Hardware':     ['wick', 'screw', 'nail', 'rod', 'wire', 'bracket', 'hinge'],
  'Consumables':  ['glue', 'stain', 'paint', 'varnish', 'sandpaper', 'towel', 'glove'],
  'Tools':        ['hammer', 'drill', 'mold', 'pitcher', 'thermometer', 'scale'],
  'Electronics':  ['led', 'battery', 'switch', 'sensor', 'chip', 'board']
};

export const MARKET_TICKER_DATA = [
    { label: "SOY WAX", trend: "up", value: "$2.15/lb" },
    { label: "FRAGRANCE OIL", trend: "neutral", value: "$18.50/lb" },
    { label: "SHIPPING (DOMESTIC)", trend: "down", value: "$4.20/avg" },
    { label: "BEESWAX", trend: "up", value: "$8.50/lb" },
    { label: "GLASS JARS (8oz)", trend: "neutral", value: "$0.85/ea" },
    { label: "WICKING (CD-12)", trend: "down", value: "$0.05/ea" }
];