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
      body: calm
        ? `${truckName} the truck rolled all day. ${truckName} saw a basketball bouncing. ${truckName} hopped over a puddle. The sun went down. The moon came up. ${truckName} parked. ${truckName} closed his eyes. Goodnight, ${truckName}.`
        : silly
          ? `${truckName} the truck loved to wiggle! Wiggle wiggle past the basketball! Bounce bounce over the puddle! Round and round his big green wheels! Then ${truckName} found his soft spot. Wiggle to sleep, ${truckName}.`
          : `${truckName} the truck had a big day. He rolled past a basketball. He hopped over a puddle. He carried green beans home for dinner. The moon came up, big and round. ${truckName} parked his wheels. Time to sleep, ${truckName}.`,
      evidence: ["weekly theme", "daily activities", "meals", "home interests"],
      width: short ? "full" : "half",
      priority: 95,
    },
    {
      id: "prompts",
      kind: "prompt",
      renderer: "talk-prompts",
      title: "Talk together",
      body: short
        ? "Can you show me sleepy eyes? Can you hop one time? What color is the moon?"
        : "What did the truck see today? Can you make your wheels go round? Show me your sleepy face. What did you eat at school?",
      evidence: ["daily activities", "meals", "character theme"],
      width: "half",
      priority: 80,
    },
    {
      id: "food",
      kind: "food",
      renderer: "food-card",
      title: "Tap the foods",
      body: "Green beans, rice, and watermelon. Tap each one. Can you count them?",
      evidence: ["meals"],
      width: "third",
      priority: 50,
    },
    {
      id: "movement",
      kind: "movement",
      renderer: "movement-game",
      title: calm ? "Quiet moves" : "Move with the truck",
      body: calm
        ? "Tiny hop. Slow roll. Sleepy stop. Big yawn."
        : "Hop one time. Wiggle your hands. Freeze like a red light. Park the truck for sleep.",
      evidence: ["weekly theme", "daily activities", "home interests"],
      width: "third",
      priority: silly ? 90 : 40,
    },
    {
      id: "voice",
      kind: "voice",
      renderer: "voice-player",
      title: "Listen to the story",
      body: "Tap to hear Riley the truck's bedtime story.",
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
