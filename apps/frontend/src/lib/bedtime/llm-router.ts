// Multi-provider LLM router for the manifest generator.
// Cascade: Gemini AI Studio → Vertex Gemini → Vertex Claude → Anthropic direct → OpenRouter.
// First success wins. Each call returns parsed JSON manifest or throws.
//
// Server-side only. Reads env from process.env.

export type RouterResult = {
  raw: unknown;
  generatedBy: string;
  rawText: string;
};

const SYSTEM = `You are an interface designer for a toddler bedtime app. Return ONLY valid JSON for a generative UI manifest.

Schema:
{
  "intent": string,
  "layoutMode": "grid"|"stack"|"spotlight"|"compact"|"print-first",
  "modules": [
    {
      "id": string,
      "kind": string,             // can be a known kind (story, prompt, food, movement, voice, youtube, toy, print) or invent (feelings-reset, transition, sensory-warmup, social-story, etc) when parent freeform input warrants it
      "renderer": string,         // matches kind, frontend has fallback renderer
      "title": string,
      "body": string,
      "evidence": string[],
      "width": "full"|"half"|"third",
      "priority": number          // 0-100, higher = earlier
    }
  ],
  "notes": string[]               // 1-3 short reasons for parent
}

Rules:
- Choose 2-7 modules based on tone/duration/freeform. Short+calm = 2-3 modules. Silly = movement-first. Calm = voice-first.
- If freeform parent input is present, INVENT a custom module kind that addresses it (e.g. "feelings-reset", "transition", "guest-mode") and put it first with priority 100.
- Body text should be specific, grounded in the context fields, age-appropriate for a toddler.
- evidence[] should cite which context fields you used (weekly theme, daily activities, meals, home interests, character theme, parent note).
- Never include private names, links, or PII.
- Output ONLY the JSON object. No prose.`;

function buildUserPrompt(req: { tone: string; duration: string; freeform?: string; context?: unknown }): string {
  return JSON.stringify({
    tone: req.tone,
    duration: req.duration,
    freeform: req.freeform ?? null,
    context: req.context ?? null,
  });
}

function tryParseJson(text: string): unknown {
  // Strip code fences if present
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function tryGeminiAiStudio(req: Parameters<typeof buildUserPrompt>[0]): Promise<RouterResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith("stub-")) throw new Error("no GEMINI_API_KEY");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: key });
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: SYSTEM + "\n\nINPUT:\n" + buildUserPrompt(req) }] },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.6,
    },
  });
  const text = (result as { text?: string }).text ?? "";
  return { raw: tryParseJson(text), generatedBy: "gemini-2.5-flash (ai-studio)", rawText: text };
}

async function tryVertexGemini(req: Parameters<typeof buildUserPrompt>[0]): Promise<RouterResult> {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) throw new Error("no GOOGLE_CLOUD_PROJECT");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({
    vertexai: true,
    project,
    location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
  });
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: SYSTEM + "\n\nINPUT:\n" + buildUserPrompt(req) }] },
    ],
    config: { responseMimeType: "application/json", temperature: 0.6 },
  });
  const text = (result as { text?: string }).text ?? "";
  return { raw: tryParseJson(text), generatedBy: "gemini-2.5-flash (vertex)", rawText: text };
}

// Vertex Claude requires the separate @anthropic-ai/vertex-sdk package.
// Skipped here to keep the dependency footprint tight; Vertex Gemini covers
// the GCP-credits-drain case for this demo.

async function tryAnthropicDirect(req: Parameters<typeof buildUserPrompt>[0]): Promise<RouterResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("no ANTHROPIC_API_KEY");
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: key });
  const result = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    temperature: 0.6,
    system: SYSTEM,
    messages: [{ role: "user", content: buildUserPrompt(req) }],
  });
  const block = result.content.find((c) => c.type === "text");
  const text = block && block.type === "text" ? block.text : "";
  return { raw: tryParseJson(text), generatedBy: "claude-sonnet-4.5 (anthropic)", rawText: text };
}

async function tryOpenRouter(req: Parameters<typeof buildUserPrompt>[0]): Promise<RouterResult> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("no OPENROUTER_API_KEY");
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({
    apiKey: key,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://github.com/hanu-tayal/agentic-interfaces-hackathon",
      "X-Title": "bedtime-school-bridge",
    },
  });
  const result = await client.chat.completions.create({
    model: "anthropic/claude-sonnet-4.5",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildUserPrompt(req) },
    ],
    temperature: 0.6,
    max_tokens: 1500,
  });
  const text = result.choices[0]?.message?.content ?? "";
  return { raw: tryParseJson(text), generatedBy: "claude-sonnet-4.5 (openrouter)", rawText: text };
}

// Cascade: OpenRouter Claude Sonnet 4.5 (best quality, drains $5-10 OR balance)
// → Vertex Gemini (drains $25k GCP credits) → AI Studio Gemini → Anthropic direct.
// Anthropic direct goes last because the user's balance there is depleted.
const PROVIDERS: Array<{ name: string; fn: (req: Parameters<typeof buildUserPrompt>[0]) => Promise<RouterResult> }> = [
  { name: "openrouter-claude-4-5", fn: tryOpenRouter },
  { name: "vertex-gemini", fn: tryVertexGemini },
  { name: "gemini-ai-studio", fn: tryGeminiAiStudio },
  { name: "anthropic-sonnet-4-5", fn: tryAnthropicDirect },
];

export async function generateManifest(
  req: Parameters<typeof buildUserPrompt>[0],
): Promise<RouterResult & { tried: string[] }> {
  const tried: string[] = [];
  for (const p of PROVIDERS) {
    try {
      const result = await p.fn(req);
      return { ...result, tried: [...tried, p.name + ":ok"] };
    } catch (e) {
      tried.push(`${p.name}:fail(${(e as Error).message.slice(0, 60)})`);
    }
  }
  throw new Error("all providers failed: " + tried.join(", "));
}
