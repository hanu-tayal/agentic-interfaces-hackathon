import { NextResponse } from "next/server";
import {
  coerceManifest,
  createFallbackInterface,
  type GenerateRequest,
  type GeneratedInterface,
} from "@/lib/bedtime/generative-ui";
import { generateManifest } from "@/lib/bedtime/llm-router";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<GenerateRequest>;
  const tone = body.tone === "calmer" || body.tone === "sillier" ? body.tone : "balanced";
  const duration = body.duration === "2-minute" ? "2-minute" : "7-minute";
  const freeform = typeof body.freeform === "string" ? body.freeform : undefined;
  const context = body.context;
  const req: GenerateRequest = { tone, duration, freeform, context };

  const fallback = createFallbackInterface(req);

  try {
    const result = await generateManifest({ tone, duration, freeform, context });
    const manifest = coerceManifest(result.raw, fallback, result.generatedBy);
    return NextResponse.json<GeneratedInterface & { _tried: string[] }>({
      ...manifest,
      _tried: result.tried,
    });
  } catch (e) {
    return NextResponse.json<GeneratedInterface & { _tried?: string[]; _error?: string }>({
      ...fallback,
      _tried: [(e as Error).message],
      _error: "all providers failed; serving local fallback",
    });
  }
}
