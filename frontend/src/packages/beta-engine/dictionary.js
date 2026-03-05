/* src/packages/beta-engine/dictionary.js */
import { TERMINOLOGY } from "../../utils/glossary";

export const GLITCHBOT_DICT = {
  UI: {
    NAME: "GLITCH_BOT //",
    BADGE: "[ GLITCH_BOT_Lvl.1 ]", 
    LOGGING: "UPDATING LOGS...", 
    XP_GAIN: "+50 XP SYNCED", 
    INPUT_PLACEHOLDER: "What's on your mind?...",
    BTN_SUBMIT: "SYNC TO LAB",
    BTN_CANCEL: "DISMISS"
  },
  TERMINOLOGY: {
    STAMP_TEXT: "BETA WORKSPACE // AUTH",
    STAMP_SUBTEXT: "ID: ALT-SOLUTIONS-001"
  },
  CONTEXT_MAP: {
    "BOOT": "the Entrance",
    "APP": "Shift Studio",
    "dashboard": "the Dashboard",
    "workshop": "your Projects",
    "inventory": "your Inventory",
    "matrix": "the Profit Tracker",
    "radar": "the Competition Tracker",
    "SETTINGS": "the Settings"
  },
  PROMPTS: {
    START: "Hey! I'm here to help. Once you're inside ",
    END: ", I'll give you the full tour.",
    BOOT_SEQUENCE: "Comms link established. GlitchBot online. Awaiting workspace entry."
  },
  ERRORS: {
    GENERIC: "Oof. We hit a snag. Let me log this.",
    NETWORK: "Comms link unstable. Reconnecting..."
  },
  ACTIONS: {
    MINIMIZE: "Minimizing to Hub...",
    WAKE: "System awake. What's the play?"
  },
  COMMAND_DECK: {
    FEEDBACK: "Feedback",
    COMMUNITY: "Beta Hub",
    HELP: "Help"
  },
  DIALOGUE: {
    FEEDBACK_TITLE: "Log Feedback",
    FEEDBACK_GREETING_1: "I see we're on ", 
    FEEDBACK_GREETING_2: ". Did you find a glitch, or do you have an idea?",
    FEEDBACK_BTN_BUG: "Bug / Issue",
    FEEDBACK_BTN_IDEA: "Feature Idea",
    FEEDBACK_PLACEHOLDER: "Describe the issue or idea...",
    FEEDBACK_SUBMIT: "Send to Hub",
    HUB_TITLE: "Beta Hub",
    HUB_DESC: "Community updates and patch notes coming soon.",
    HUB_VERSION: "v1.0-BETA ONLINE",
    HELP_TITLE: "System Help",
    HELP_DESC: "Need assistance navigating the console?",
    HELP_DOCS: "View Documentation",
    HELP_SUPPORT: "Contact Support",
    CANCEL: "Close"
  },
  HUB: {
    TITLE: "SHIFT STUDIO // BETA HUB",
    EVOLUTION_PHASE: "PHASE 1: FOUNDATION",
    XP_PROGRESS: "LVL 1",
    TABS: {
      BLUEPRINT: "BLUEPRINT",
      LAB: "THE LAB",
      VAULT: "THE VAULT",
      BRIDGE: "THE BRIDGE"
    }
  },
  
  // =========================================================
  // --- PUBLIC WEBSITE INTEGRATION (Next.js) ---
  // =========================================================
  PUBLIC_BLUEPRINT: {
    HERO: {
      TAGLINE: "PHASE 1 // OPERATION: CO-CREATION",
      TITLE: "THE BLUEPRINT",
      SUBTITLE_1: "We aren't looking for free labor. We are looking for ",
      SUBTITLE_HIGHLIGHT: "Founding Architects",
      SUBTITLE_2: ". Help us break this engine, and we will build you an empire."
    },
    RESPECT_ZONE: {
      NUMBER: "01",
      TITLE: "NO FEEDBACK BLACK HOLES.",
      P1: "The industry standard for testing is broken. You submit a thoughtful bug report, it goes into a void, and a massive corporation profits off your insight without even saying thank you.",
      P2_HIGHLIGHT: "Not here. We believe in mutual exchange.",
      P3: "When you collaborate with Alternative Solutions, your voice dictates the roadmap. You aren't just a user; you are part of the dev team. You log the friction, we write the code, and together we build software that actually serves the people on the frontlines."
    },
    RULES_ZONE: {
      HEADING: "RULES OF ENGAGEMENT",
      RULES: [
        { id: "01", title: "TEST REALITY", desc: "Don't just poke buttons. Run your actual business workflows through the engine. Tell us where it slows you down." },
        { id: "02", title: "BRUTAL HONESTY", desc: "We don't need sugar-coating. 'This screen takes 3 extra clicks' is the exact intel we need to optimize the system." },
        { id: "03", title: "NO ECHOES", desc: "Check the community Lab before logging. Find new friction points to earn maximum XP." },
        { id: "04", title: "EARN YOUR SEAT", desc: "Inactive accounts are purged to make room for active builders. Your engagement secures your spot." }
      ]
    },
    REWARD_ZONE: {
      BADGE: "THE REWARD POOL",
      TITLE: "Level Up. Get Paid in Software.",
      DESC: "Every time GlitchBot verifies your feedback, you earn XP. Hit the milestone ranks, and you unlock permanent rewards. We reward the builders who help us lay the bricks.",
      RANKS: [
        { icon: "🛡️", title: "Early Access", rank: "RANK: OPERATIVE", isApex: false },
        { icon: "💎", title: "Free License", rank: "RANK: ARCHITECT", isApex: false },
        { icon: "👑", title: "Founders Board", rank: "RANK: APEX", isApex: true }
      ]
    },
    FOOTER_CTA: {
      HEADING: "INITIATE CONNECTION?",
      BUTTON: "APPLY FOR CLEARANCE",
      SUBTEXT: "GlitchBot is standing by."
    }
  }
};