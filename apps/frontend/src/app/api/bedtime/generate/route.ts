import { NextResponse } from "next/server";
import {
  createFallbackInterface,
  type GeneratedInterface,
} from "@/lib/bedtime/generative-ui";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tone = body.tone === "calmer" || body.tone === "sillier" ? body.tone : "balanced";
  const duration = body.duration === "2-minute" ? "2-minute" : "7-minute";
  const fallback = createFallbackInterface({ tone, duration });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json<GeneratedInterface>({
      ...fallback,
      generatedBy: process.env.GEMINI_API_KEY ? "gemini-ready" : "local-fallback",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929",
        max_tokens: 900,
        temperature: 0.4,
        system:
          "Return only valid JSON for a toddler bedtime generative UI manifest. Keep it safe, concise, parent-approved, printable, and grounded in the provided context. Do not include private names or links.",
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              tone,
              duration,
              requiredShape: {
                generatedBy: "anthropic",
                intent: "string",
                layout: [
                  "story",
                  "prompt",
                  "food",
                  "movement",
                  "print",
                  "voice",
                  "youtube",
                  "toy",
                ],
                modules: fallback.modules,
              },
              context: body.context,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text;
    const generated = JSON.parse(text) as GeneratedInterface;

    return NextResponse.json({
      ...fallback,
      ...generated,
      generatedBy: "anthropic",
      modules: Array.isArray(generated.modules) ? generated.modules : fallback.modules,
      layout: Array.isArray(generated.layout) ? generated.layout : fallback.layout,
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
