export type SourceField =
  | "weekly theme"
  | "daily activities"
  | "meals"
  | "home interests"
  | "character theme";

export type GeneratedKind =
  | "story"
  | "prompt"
  | "food"
  | "movement"
  | "print"
  | "voice"
  | "youtube"
  | "toy";

export type GeneratedModule = {
  id: string;
  kind: GeneratedKind;
  renderer:
    | "bedtime-story"
    | "talk-prompts"
    | "food-card"
    | "movement-game"
    | "print-pack"
    | "voice-player"
    | "youtube-rail"
    | "commerce-approval";
  title: string;
  body: string;
  evidence: SourceField[];
};

export type GeneratedInterface = {
  generatedBy: "anthropic" | "gemini-ready" | "local-fallback";
  intent: string;
  layout: GeneratedKind[];
  modules: GeneratedModule[];
};

export function createFallbackInterface({
  tone,
  duration,
}: {
  tone: "balanced" | "calmer" | "sillier";
  duration: "7-minute" | "2-minute";
}): GeneratedInterface {
  const calm = tone === "calmer";
  const silly = tone === "sillier";
  const short = duration === "2-minute";

  const truckName = silly ? "Wiggle Wheel" : "Riley";
  const tempo = calm ? "slowly" : silly ? "wiggly" : "carefully";
  const length = short ? "tiny" : "bedtime";

  const modules: GeneratedModule[] = [
    {
      id: "story",
      kind: "story",
      renderer: "bedtime-story",
      title: `${length[0].toUpperCase()}${length.slice(1)} story`,
      body: `${truckName} the recycling truck wanted to move like school today. First, the truck hopped over quiet lily pads. Then it rolled ${tempo} past a basketball court, counted green beans like little wheels, and parked under a watermelon moon. Before sleep, ${truckName} put one book away because responsible helpers finish with a clean space.`,
      evidence: ["weekly theme", "daily activities", "meals", "home interests"],
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
    },
    {
      id: "food",
      kind: "food",
      renderer: "food-card",
      title: "Food learning card",
      body: "Green beans grow on plants, rice is a tiny grain, and watermelon is full of water. Tonight's line: 'You ate green beans today. Can we count pretend beans on your fingers?'",
      evidence: ["meals"],
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
    },
    {
      id: "print",
      kind: "print",
      renderer: "print-pack",
      title: "Print pack",
      body: "One parent script, one child story page, and one morning follow-up card. Black-and-white friendly for home printing.",
      evidence: ["weekly theme", "daily activities", "meals"],
    },
    {
      id: "voice",
      kind: "voice",
      renderer: "voice-player",
      title: "Listen mode",
      body: "A calm 45-second narration with transcript. Uses browser speech for the demo and avoids creator imitation.",
      evidence: ["weekly theme", "home interests"],
    },
    {
      id: "youtube",
      kind: "youtube",
      renderer: "youtube-rail",
      title: "Guided video set",
      body: "Three parent-approved videos, each with a learning goal, watch-together prompt, after-watching activity, and stop point.",
      evidence: ["weekly theme", "home interests"],
    },
    {
      id: "toy",
      kind: "toy",
      renderer: "commerce-approval",
      title: "Hands-on extension",
      body: "A soft basketball and movement-card option reinforces school movement without adding more passive screen time.",
      evidence: ["daily activities", "home interests"],
    },
  ];

  return {
    generatedBy: "local-fallback",
    intent:
      "Compose the exact bedtime learning surface needed tonight from school and home context.",
    layout: modules.map((module) => module.kind),
    modules,
  };
}
