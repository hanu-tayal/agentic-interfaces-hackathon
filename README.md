# Bedtime School Bridge

Public hackathon repo for the Seattle AI Tinkerers Generative UI Global Hackathon.

Bedtime School Bridge turns daycare learning signals, meals, and home interests into a parent-approved bedtime learning interface: digital story, printable pages, voice read-aloud, guided YouTube recommendations, and mock toy-commerce approval.

## Demo

The current working demo is a Next.js app built on the Generative UI Global Hackathon starter kit.

```bash
npm install
npm run dev:ui
```

Open http://localhost:3010.

The frontend-only path is intentional for the live hackathon demo. It avoids requiring Notion, Docker, or private mailbox data while still preserving the starter kit structure for CopilotKit, AG-UI/A2UI, MCP Apps, and future agent integration.

## What To Show

1. Click **Build bridge** to call `/api/bedtime/generate`.
2. Point at the generated UI manifest: provider, chosen layout, and renderer names.
3. Switch tone/duration to show the manifest and rendered interface regenerate.
4. Show the generated digital story, print pack, browser voice read-aloud, guided YouTube rail, and mock toy approval.
5. Emphasize that raw Gmail, YouTube history, child photos, private links, secrets, and payment credentials are not committed.

## Why This Is Generative UI

The UI is not a fixed dashboard. The generation endpoint emits a typed interface manifest:

- `layout`: which surfaces should exist tonight.
- `modules`: the content and evidence for each surface.
- `renderer`: the component type the agent chose for each module.

The frontend renders from that manifest, so the agent can compose a different interface for a short night, a calmer bedtime, a print-first evening, or a commerce/voice-heavy follow-up.

## LLM Providers

This repo supports the starter kit's Gemini path and can be extended to Anthropic/Groq/Vertex. Do not commit keys.

Useful local env names:

- `GEMINI_API_KEY` for Google AI Studio Gemini API.
- `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_CLOUD_PROJECT`, and `GOOGLE_CLOUD_LOCATION` for Vertex AI.
- `ANTHROPIC_API_KEY` or `GROQ_API_KEY` for fallback provider experiments.

Gemini credits should be claimed through the event flow and stored only in local `.env` files.

## Documentation

- [Hackathon requirements](HACKATHON.md)
- [Product brief](docs/PRODUCT_BRIEF.md)
- [Build decision](docs/BUILD_DECISION.md)
- [Daycare context](docs/DAYCARE_BEDTIME_CONTEXT.md)
- [Home media context](docs/HOME_MEDIA_CONTEXT.md)
- [Print and publishing](docs/PRINT_AND_PUBLISHING.md)
- [Voice output](docs/VOICE_OUTPUT_REQUIREMENT.md)
- [Agent commerce and voice adapters](docs/AGENT_COMMERCE_AND_VOICE_ADAPTERS.md)
- [Guided YouTube](docs/YOUTUBE_LEARNING_REQUIREMENT.md)
- [Toy commerce](docs/TOY_COMMERCE_REQUIREMENT.md)
- [Demo plan](docs/DEMO_PLAN.md)
- [Winning demo strategy](docs/WINNING_DEMO_STRATEGY.md)

## Starter Kit

Based on the hackathon starter kit:
https://github.com/jerelvelarde/Generative-UI-Global-Hackathon-Starter-Kit

Starter docs remain in [dev-docs](dev-docs).
