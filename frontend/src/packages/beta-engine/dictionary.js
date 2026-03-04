/* src/packages/beta-engine/dictionary.js */

export const GLITCHBOT_DICT = {
  UI: {
    NAME: "GLITCH_BOT //",
    BADGE: "[ GLITCH_BOT_Lvl.1 ]", 
    LOGGING: "SAVING YOUR THOUGHTS...", 
    XP_GAIN: "+50 XP GAINED", 
    TRIGGER_LABEL: "BETA_ACTIVE // OPEN HUB",
    INPUT_PLACEHOLDER: "What exactly happened? (Just use plain English)...",
    BTN_SUBMIT: "SEND TO LAB",
    BTN_CANCEL: "NEVERMIND"
  },
  CONTEXT_MAP: {
    "APP": "Shift Studio",
    "DASHBOARD": "the Dashboard",
    "WORKSHOP": "your Projects",
    "INVENTORY": "your Inventory",
    "SETTINGS": "the Settings",
    "HUB: BLUEPRINT": "the Blueprint", // UPDATED
    "HUB: LAB": "the Lab",
    "HUB: VAULT": "the Education Vault",
    "HUB: BRIDGE": "The Bridge" 
  },
  AGREEMENT: {
    VERSION: "BETA ENGINE // PHASE 1",
    TITLE: "WELCOME TO THE WORKSHOP",
    SUBTITLE: "CONFIRM YOUR DIRECTIVES",
    CARDS: [
      { id: 1, title: "THE MISSION", text: "Test the limits. Tell us where it catches. Help us build it better.", color: "alert" },
      { id: 2, title: "THE STANDARD", text: "We value objective, actionable feedback that improves the ecosystem.", color: "teal" },
      { id: 3, title: "THE REWARD", text: "Level up your rank and earn your license by collaborating with us.", color: "purple" }
    ],
    CONFIRMATION: "I'M READY TO COLLABORATE.", // UPDATED
    BTN_PENDING: "AWAITING CONFIRMATION...",
    BTN_READY: "ENTER WORKSPACE"
  },
  INTRO: {
    GREETING: "HI, I AM GLITCH_BOT.",
    LINE_1: "Welcome to the Beta! I am deployed in every Alternative Solutions product to track what works and what breaks.",
    LINE_2: "This is a live construction zone. If a gear grinds, log it. We don't want technical jargon, we just want the truth. Let's build.",
    BUTTON: "GOT IT // DEPLOY BOT",
    TAPE_LABEL: "WARNING: BETA ACTIVE" 
  },
  PROMPTS: {
    START: "Did something about ",
    END: " feel clunky, or did you just have a great idea? Let me know!"
  },
  REACTIONS: {
    OOF: "[ OOF ] Workflow Bump",
    EYESORE: "[ EYESORE ] UI/UX Note", // Softened from "Looks Weird"
    IDEA: "[ LIGHTBULB ] Bright Idea"
  },
  HUB: {
    TITLE: "BETA COMMAND HUB //",
    EVOLUTION_PHASE: "CURRENT STATE: LEVEL 1", 
    XP_PROGRESS: "340 / 500 XP (NEXT: LVL 2)", 
    TABS: {
      BLUEPRINT: "THE BLUEPRINT", // UPDATED
      LAB: "THE LAB (FEEDBACK)",
      VAULT: "EDUCATION VAULT",
      BRIDGE: "THE BRIDGE" 
    },
    // UPDATED: Completely rewritten for a collaborative, empowering tone
    BLUEPRINT: { 
      HEADING: "THE ALTERNATIVE BETA PROGRAM",
      BODY_1: "Welcome to the foundation. Every product built by Alternative Solutions starts right here. You aren't here to just 'test' software. You are here to collaborate, stress-test our logic, and help us build a stronger framework that empowers everyone.",
      BODY_2: "We aren't looking for passive followers; we are looking for problem-solvers, fixers, and builders who think differently. If you actively help us refine this engine, you earn your seat at the table—including free software licenses and lifetime perks for being a founding collaborator.",
      RULES_HEADING: "GUIDING PRINCIPLES //",
      RULES: [
        { id: 1, title: "TEST REAL WORKFLOWS", desc: "Don't just click buttons. Use the system for your actual, daily processes. Tell us where it slows you down." },
        { id: 2, title: "OBJECTIVE TRUTH", desc: "Actionable feedback is our gold standard. Instead of 'I don't like this,' tell us 'This takes too many clicks to accomplish.'" },
        { id: 3, title: "AVOID ECHOES", desc: "Check the Lab before you log. Duplicate feedback earns zero XP. Help us find new areas to improve." },
        { id: 4, title: "EARN YOUR SEAT", desc: "Our best collaborators are rewarded. Feed the bot, level up your rank, and secure your free license." }
      ],
      SIGNATURE: "- Alternative Solutions",
      LORE: {
        TITLE: "THE BETA ENGINE",
        SUBTITLE: "MEET YOUR DIGITAL ASSISTANT",
        PARAGRAPH_1: "GlitchBot is deployed into every new application we build. Right now, it's a Level 1 assistant. Its primary job is to hunt down bugs, workflow bumps, and gather your brightest ideas.",
        PARAGRAPH_2: "Every time you log a valid insight, you help train the system and earn XP. Our collective mission is to level up this platform until the software seamlessly supports your business goals.",
        CALL_TO_ACTION: "READY TO BUILD SOMETHING BETTER?"
      },
      PUBLIC_CTA: {
        BUTTON: "APPLY TO COLLABORATE",
        SUBTEXT: "Limited slots available for the Phase 1 Beta."
      }
    },
    LAB: {
      FEED_TITLE: "COMMUNITY FEEDBACK",
      BOARD_TITLE: "TOP COLLABORATORS", // Softened from "Contributors"
      MOCK_TRANSMISSIONS: [
        { id: 1, user: "@BetaTwin", type: "LIGHTBULB", context: "PROFIT MATRIX", message: "What if the matrix automatically factored in a 10% waste margin for resin?", time: "2 MINS AGO" },
        { id: 2, user: "@CraftyFox", type: "OOF", context: "WORKSHOP", message: "The recipe form takes too many clicks to add a new material.", time: "15 MINS AGO" }
      ],
      MOCK_LEADERBOARD: [
        { rank: 1, name: "BetaTwin", xp: 2450, badge: "Systems Thinker" }, // Professional badges
        { rank: 2, name: "CraftyFox", xp: 1800, badge: "Workflow Architect" }
      ]
    },
    VAULT: {
      HEADER_TITLE: "EDUCATION VAULT //",
      MODULES: [
        { id: "mod-1", title: "THE ART OF FEEDBACK", desc: "How to provide clear, actionable insights that help us build better tools.", status: "UNLOCKED", type: "doc" },
        { id: "mod-2", title: "THRIVING WITH AI", desc: "The Alternative Solutions mindset. Stop surviving. Start thriving alongside the engine.", status: "UNLOCKED", type: "mindset" }
      ]
    },
    BRIDGE: { 
      HEADER_TITLE: "THE BRIDGE // COMMAND DECK",
      STATS: { ACTIVE_USERS: "ACTIVE COLLABORATORS", PENDING_TICKETS: "OPEN INSIGHTS", SYSTEM_HEALTH: "ENGINE HEALTH" },
      SECTIONS: { QUEUE: "INSIGHT QUEUE", ROSTER: "COLLABORATOR RADAR", BROADCAST: "GLOBAL UPDATE" },
      ACTIONS: { APPROVE: "ACKNOWLEDGE (+XP)", REJECT: "ARCHIVE", REVOKE: "REMOVE ACCESS", SEND: "SEND UPDATE" }
    }
  }
};