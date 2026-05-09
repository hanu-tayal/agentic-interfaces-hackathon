# Bedtime School Bridge

> A voice-activated iPad bedtime UI that the agent assembles, page by page, from one parent sentence about today.

Public repo for the [Seattle AI Tinkerers Generative UI Global Hackathon](https://seattle.aitinkerers.org/hackathons/h_x_n9rN2gpzc), May 9, 2026.

## What it is

A parent walks up to the iPad. They tap a mic and say one sentence about tonight. The agent generates an interactive bedtime interface their 2.5-year-old will actually use:

- **Tap-through illustrated picture book** — big bouncing emoji per page, minimal text, auto-TTS on advance.
- **Tap-to-do movement game** — 2×2 grid of giant tappable steps with celebration on done.
- **Food tiles** — tap a tile to bounce + speak the food name.
- **Voice mascot** — animated character with waveform; tap to listen.
- **Breathing reset (invented kind)** — when the parent mentions stress, the agent emits a `feelings-reset` module the codebase has no prebuilt route for; frontend dispatches by renderer with fallback.

The UI re-organizes itself when the tone changes:
- **Calmer** → dark night-sky background, stack layout, voice-first.
- **Sillier** → bright sunny gradient, movement-first grid.
- **Balanced** → full bridge.

Same source context, fundamentally different interface.

## Why it's generative UI

A chatbot returns text. This app emits an **interactive interface for a non-reader**:

- Voice in → UI out.
- Variable module sets per tone (2–5 modules).
- Invented module kinds for parent-supplied context.
- Per-module interactivity (tap, listen, breathe) built for a 2.5-year-old.

## Quick start

```bash
git clone https://github.com/hanu-tayal/agentic-interfaces-hackathon
cd agentic-interfaces-hackathon
cp .env.example .env  # GEMINI_API_KEY optional; demo runs without
npm install
npm run dev:ui        # http://localhost:3010
```

The app ships with a deterministic local manifest fallback so it runs without any credentials.

## Demo flow

1. Open the app. Tap the floating mic at the bottom.
2. Say a sentence: *"Move It Week 2, garbage trucks, basketball, calmer tonight"*.
3. Watch cards stream in. Switch tone with the top-right buttons.
4. Tap a card to interact: turn pages, tick movement steps, bounce food tiles.

Sample prompts (visible above the dock):
- "Move It Week 2, garbage trucks, basketball, calmer tonight"
- "Rough drop-off this morning, dad gone for two days"  *(triggers the feelings-reset module)*
- "Two minutes, super silly, recycling truck story"

## Protocols and stack

- **CopilotKit** (v2 provider from the starter kit)
- **A2UI-style declarative manifest** for module dispatch
- **Web Speech API** for voice input
- **Multi-provider LLM router** with cascade: Google AI Studio → Vertex Gemini → Anthropic direct → OpenRouter → local fallback
- **Next.js 15 / React 19** + Turbopack
- **framer-motion** for layout transitions
- **Tailwind** for tone-driven theming

See [SUBMISSION.md](SUBMISSION.md) for the full hackathon submission metadata.

## Privacy

- Public repo uses sanitized seed data only.
- No raw Gmail, YouTube history, child photos, names, or links.
- Mock toy commerce — no real payments move.
- TTS via browser SpeechSynthesis (child voice not uploaded).

## Built on top of

[Generative UI Global Hackathon Starter Kit](https://go.copilotkit.ai/GenUITemplate). The bedtime product, manifest schema, multi-provider router, voice flow, and toddler-first interactive renderers are original to this build.

## Repo layout

```
apps/frontend/         Next.js app (the demo)
  src/app/page.tsx                  Main canvas + floating voice dock
  src/app/api/bedtime/generate/     Manifest generator endpoint
  src/components/bedtime/           Interactive renderers (story, movement, etc.)
  src/lib/bedtime/                  Schema, router, voice-input
docs/                  Product brief, demo plan, build decision, requirement docs
HACKATHON.md           Hackathon brief
SUBMISSION.md          Submission form metadata
```
