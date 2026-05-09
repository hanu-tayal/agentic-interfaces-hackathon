// Richer manifest schema — agent can invent kinds + renderers, choose layout mode,
// and set per-module width/priority. Frontend dispatches by renderer with safe fallback.

export type LayoutMode = "grid" | "stack" | "spotlight" | "compact" | "print-first";

export type ModuleWidth = "full" | "half" | "third";

export type GeneratedModule = {
  id: string;
  kind: string; // free-form: story, prompt, food, movement, print, voice, youtube, toy, feelings, transition, ...
  renderer: string; // free-form, frontend dispatches with fallback
  title: string;
  body: string;
  evidence: string[]; // why this module exists, grounded in source context
  width?: ModuleWidth;
  priority?: number; // 0-100, higher = more prominent / earlier in layout
  customProps?: Record<string, unknown>;
};

export type GeneratedInterface = {
  generatedBy: string; // gemini-flash, vertex-claude, anthropic, openrouter, local-fallback
  intent: string;
  layoutMode: LayoutMode;
  modules: GeneratedModule[];
  notes?: string[]; // agent's reasoning visible to parent
};

export type GenerateRequest = {
  tone: "balanced" | "calmer" | "sillier";
  duration: "7-minute" | "2-minute";
  freeform?: string; // parent's optional sentence ("rough drop-off today", "we have a guest")
  context?: Record<string, unknown>;
};

// Deterministic fallback when no provider is reachable. Designed so that
// tone/duration/freeform produce visibly different module sets, not just text.
export function createFallbackInterface(req: GenerateRequest): GeneratedInterface {
  const { tone, duration, freeform } = req;
  const calm = tone === "calmer";
  const silly = tone === "sillier";
  const short = duration === "2-minute";
  const truckName = silly ? "Wiggle Wheel" : "Riley";
  const tempo = calm ? "slowly" : silly ? "wiggly" : "carefully";

  // Variable module set — short calm uses 3 modules, longer silly uses 7.
  const allModules: GeneratedModule[] = [
    {
      id: "story",
      kind: "story",
      renderer: "bedtime-story",
      title: short ? "Tiny story" : "Bedtime story",
      body: `${truckName} the recycling truck wanted to move like school today. First, the truck hopped over quiet lily pads. Then it rolled ${tempo} past a basketball court, counted green beans like little wheels, and parked under a watermelon moon. Before sleep, ${truckName} put one book away because responsible helpers finish with a clean space.`,
      evidence: ["weekly theme", "daily activities", "meals", "home interests"],
      width: short ? "full" : "half",
      priority: 95,
    },
    {
      id: "prompts",
      kind: "prompt",
      renderer: "talk-prompts",
      title: short ? "Three quick questions" : "Parent talk prompts",
      body: short
        ? "Can you show a sleepy face? Can your hands hop once? What color was the watermelon?"
        : "Ask about hopping, fast and slow bodies, proud helper faces, green beans, and how a recycling truck can be responsible.",
      evidence: ["daily activities", "meals", "character theme"],
      width: "half",
      priority: 80,
    },
    {
      id: "food",
      kind: "food",
      renderer: "food-card",
      title: "Food learning card",
      body: "Green beans grow on plants, rice is a tiny grain, and watermelon is full of water. Tonight's line: 'You ate green beans today. Can we count pretend beans on your fingers?'",
      evidence: ["meals"],
      width: "third",
      priority: 50,
    },
    {
      id: "movement",
      kind: "movement",
      renderer: "movement-game",
      title: calm ? "Quiet body activity" : "Movement bridge",
      body: calm
        ? "Whisper three movements: tiny hop, slow roll, sleepy stop."
        : "Try one safe pre-bed sequence: hop once, twist hands, freeze like red light, then park the truck for sleep.",
      evidence: ["weekly theme", "daily activities", "home interests"],
      width: "third",
      priority: silly ? 90 : 40,
    },
    {
      id: "voice",
      kind: "voice",
      renderer: "voice-player",
      title: "Listen mode",
      body: "A calm 45-second narration with transcript. Uses browser speech for the demo and avoids creator imitation.",
      evidence: ["weekly theme", "home interests"],
      width: "half",
      priority: calm ? 85 : 30,
    },
    {
      id: "youtube",
      kind: "youtube",
      renderer: "youtube-rail",
      title: "Guided video set",
      body: "Three parent-approved videos, each with a learning goal, watch-together prompt, after-watching activity, and stop point.",
      evidence: ["weekly theme", "home interests"],
      width: "full",
      priority: silly ? 70 : 35,
    },
    {
      id: "toy",
      kind: "toy",
      renderer: "commerce-approval",
      title: "Hands-on extension",
      body: "A soft basketball and movement-card option reinforces school movement without adding more passive screen time.",
      evidence: ["daily activities", "home interests"],
      width: "half",
      priority: 25,
    },
  ];

  // Layout selection logic — different module sets per state to FEEL generative.
  let layoutMode: LayoutMode;
  let pickedIds: string[];
  let notes: string[];

  if (short && calm) {
    layoutMode = "compact";
    pickedIds = ["story", "voice"];
    notes = ["Tonight is short and calm. Story plus voice only.", "Prompt is folded into the narration."];
  } else if (short) {
    layoutMode = "spotlight";
    pickedIds = ["story", "prompts", "movement"];
    notes = ["Short night. Three modules with story in spotlight."];
  } else if (silly) {
    layoutMode = "grid";
    pickedIds = ["movement", "story", "youtube", "prompts", "toy"];
    notes = ["Silly mood. Movement leads, screen-light play closes."];
  } else if (calm) {
    layoutMode = "stack";
    pickedIds = ["voice", "story", "prompts", "food"];
    notes = ["Calm tone. Voice-first stack, less visual noise."];
  } else {
    layoutMode = "grid";
    pickedIds = ["story", "prompts", "movement", "food", "youtube", "voice", "toy"];
    notes = ["Balanced full bridge across digital, voice, and play."];
  }

  // Freeform overrides — agent invents a custom module if the parent typed something.
  if (freeform && freeform.trim().length > 0) {
    const freeformModule: GeneratedModule = {
      id: "freeform",
      kind: "feelings-reset",
      renderer: "feelings-reset",
      title: "Tonight's special note",
      body: `Heard: "${freeform.trim()}". Tonight we add one extra grounding step before story time: three slow breaths, a "you are safe" line, then back to the regular bridge.`,
      evidence: ["parent note"],
      width: "full",
      priority: 100,
      customProps: { breaths: 3, anchorLine: "you are safe", parentInput: freeform.trim() },
    };
    pickedIds = ["freeform", ...pickedIds.filter((id) => id !== "freeform")];
    notes = [`Parent context detected: "${freeform.trim().slice(0, 60)}".`, ...notes];
    allModules.unshift(freeformModule);
  }

  const modules = pickedIds
    .map((id) => allModules.find((m) => m.id === id))
    .filter((m): m is GeneratedModule => Boolean(m));

  return {
    generatedBy: "local-fallback",
    intent: `Compose tonight's bedtime bridge: ${tone} tone, ${duration}.`,
    layoutMode,
    modules,
    notes,
  };
}

// Validate / coerce an LLM response into the shape we render.
export function coerceManifest(raw: unknown, fallback: GeneratedInterface, generatedBy: string): GeneratedInterface {
  if (!raw || typeof raw !== "object") return { ...fallback, generatedBy };
  const r = raw as Record<string, unknown>;
  const modules = Array.isArray(r.modules) && r.modules.length > 0 ? (r.modules as GeneratedModule[]) : fallback.modules;
  const layoutMode = (typeof r.layoutMode === "string" ? r.layoutMode : fallback.layoutMode) as LayoutMode;
  const intent = typeof r.intent === "string" ? r.intent : fallback.intent;
  const notes = Array.isArray(r.notes) ? (r.notes as string[]) : fallback.notes;
  return {
    generatedBy,
    intent,
    layoutMode,
    modules,
    notes,
  };
}
