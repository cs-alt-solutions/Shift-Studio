/* packages/beta-engine/dictionary.js */

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
    "DASHBOARD": "the Dashboard",
    "WORKSHOP": "your Projects",
    "INVENTORY": "your Inventory",
    "SETTINGS": "the Settings"
  },
  PROMPTS: {
    START: "Hey! I'm here to help. Once you're inside ",
    END: ", I'll give you the full tour.",
    // Removed the ALL CAPS and underscores
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
    // Cleaned up the button labels
    FEEDBACK: "Feedback",
    COMMUNITY: "Beta Hub",
    HELP: "Help"
  }
};