# Submission — Bedtime School Bridge

For the Generative UI Global Hackathon (Seattle AI Tinkerers, May 9, 2026).

## Project name

**Bedtime School Bridge**

## One-sentence pitch

A voice-activated iPad bedtime UI that the agent assembles, page by page, from one parent sentence about today.

## Short description

A parent walks up to the iPad. They tap a microphone and say one sentence about tonight ("Move It Week 2, garbage trucks, basketball, calmer tonight"). The agent generates the bedtime interface their 2.5-year-old will actually use: a tap-through illustrated picture book, a tap-to-do movement game, food tiles that speak their name when tapped, a voice mascot, and (when the parent's sentence implies stress) an invented "feelings reset" breathing circle. The UI re-organizes itself when the tone changes — calmer mode collapses to a dark night-sky listen-mode; sillier mode brings up a kangaroo-led movement scene. Same source context, fundamentally different interface.

## Why this is generative UI, not a chatbot

A chatbot returns text. This app:

- **Voice in, UI out.** Parent speaks. The agent responds by generating an interactive interface, not a message.
- **Variable module sets.** Same context produces 2 modules in calmer mode, 5 in silly mode. The agent decides which surfaces exist.
- **Invented module kinds.** When the parent mentions stress, the agent emits a `feelings-reset` module the codebase has no prebuilt route for. Frontend dispatches by renderer with fallback.
- **Per-module interactivity built for a non-reader.** A 2.5-year-old can't read a chatbot reply. They can tap a giant truck emoji to advance a story page, tap food tiles to hear them named, tick movement steps to celebrate completion.
- **Tone-driven layout primitives.** Calmer = stack layout, voice-first, dark. Silly = grid, movement-first, sunny. Balanced = full bridge. The layout shape itself is part of the agent's output.

## Public GitHub repo

https://github.com/hanu-tayal/agentic-interfaces-hackathon

## Demo video

[record + paste link]

Suggested 2:30 script:
1. (0:00–0:15) Open app on desktop sized for iPad. Big tap-mic CTA.
2. (0:15–0:35) Tap mic → say *"Move It Week 2, garbage trucks, basketball, calmer tonight"*. Watch transcript stream.
3. (0:35–1:00) Stop. Cards stream in: dark night-sky listen mode with bedtime story.
4. (1:00–1:20) Tap "sillier" → UI rebuilds: bright sunny scene, kangaroo emoji, movement-first layout.
5. (1:20–1:45) Tap mic again → say *"Rough drop-off this morning, dad gone for two days"*. Cards rebuild and a `feelings-reset` breathing circle appears at top with the parent's note quoted.
6. (1:45–2:10) Tap the breathing circle → animated 3-breath sequence with TTS anchor "you are safe".
7. (2:10–2:30) Quick tour of food tiles (tap = bounce + speak name) and movement game (tap = checkmark + celebrate).

## Protocols used

- **CopilotKit** v2 React provider (provider shell from starter kit).
- **A2UI-style declarative manifest schema** for generated bedtime modules (`GeneratedInterface`, `GeneratedModule` with id/kind/renderer/title/body/evidence/width/priority/customProps).
- **Web Speech API** (`webkitSpeechRecognition`) for voice input on iPad Safari + desktop Chrome.
- **Multi-provider LLM cascade** for the generation endpoint:
  1. Google AI Studio Gemini (`@google/genai`)
  2. Vertex AI Gemini (drains GCP credits via service account)
  3. Anthropic Claude direct
  4. OpenRouter (Gemini through OpenAI-compatible API)
  5. Local deterministic fallback
- **Browser SpeechSynthesis** for child-facing audio.
- **Tailwind + framer-motion** for tone-driven layout transitions.

## Team members and roles

- **Himanshu Tayal** — Solo build (product, design, code, demo).

## Built on top of

- Generative UI Global Hackathon Starter Kit (`https://go.copilotkit.ai/GenUITemplate`) — provided Next.js + CopilotKit scaffolding. The bedtime product, generated UI manifest schema, multi-provider router, voice flow, and toddler-first interactive renderers are original to this build.

## Privacy posture

- Public repo uses sanitized seed data only.
- No raw Gmail, YouTube history, child photos, names, or links.
- Mock toy commerce — no real payments move.
- Voice TTS uses browser SpeechSynthesis (no cloud upload of child voice).

## Quick start

```bash
cd agentic-interfaces-hackathon
cp .env.example .env  # add GEMINI_API_KEY for full AI; works without
npm install
npm run dev:ui  # opens on http://localhost:3010
```

The app falls back to a deterministic local manifest if no provider keys are set, so the demo runs even with zero credentials.
