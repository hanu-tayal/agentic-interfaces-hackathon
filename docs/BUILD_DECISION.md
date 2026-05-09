# Build Decision

## Recommendation

Use the official Generative UI Global Hackathon starter kit as the application base, and use Codex/OMX as the build orchestration layer.

Starter kit:

- Short link: https://go.copilotkit.ai/GenUITemplate
- Resolved repo: https://github.com/jerelvelarde/Generative-UI-Global-Hackathon-Starter-Kit

## Why This Is The Right Base

The hackathon rewards working code, originality, and effective use of generative UI. The starter kit already contains the hardest setup pieces:

- Next.js frontend
- CopilotKit runtime and UI
- AG-UI transport
- A2UI/declarative generative UI path
- MCP Apps path
- LangGraph Deep Agent backend
- Gemini model wiring
- Local persistence through Postgres/Redis
- MCP server package for deployable app surfaces

For Bedtime School Bridge, that means the team can spend time replacing the sample "Notion leads" domain with daycare reports, curriculum context, and generated bedtime teaching modules instead of building protocol plumbing from scratch.

## Stack Choice

### App Runtime

Use the starter kit:

- `apps/frontend`: Next.js app and generated UI canvas
- `apps/bff`: CopilotKit runtime bridge
- `apps/agent`: Python LangGraph/Deep Agent brain
- `apps/mcp`: MCP App/server surface
- `deployment`: local Postgres/Redis infrastructure

### Model

Use Gemini first because the event provides Gemini credits.

Keep model use behind the starter kit's model-switching seam so the team can fall back to another model if credits, quota, or latency become an issue.

### Generated UI Strategy

Use a mixed strategy:

- Controlled components for sensitive input/output/action rails: Gmail import, source evidence, privacy notices, print export, voice playback, guided video recommendations, publishing-readiness controls, toy recommendations, and purchase approvals.
- Declarative/A2UI-style generated layouts for flexible bedtime modules, digital story cards, school-theme cards, food prompts, movement prompts, print views, voice controls, and parent scripts.
- MCP Apps/open-ended UI only as a bonus surface if the core app is stable.

This gives a reliable demo while still proving that the UI is generated at runtime.

## Role Of Other Tools

### Codex / OMX

Use for this repo's actual implementation workflow:

- planning
- code changes
- test/debug loops
- visual checks
- commit hygiene
- optional subagents for independent work

Do not make OMX part of the submitted product unless it is directly visible in the demo. It is the builder workflow, not the app stack.

### Gas City

Gas City is useful for larger multi-agent coding factories. It is overkill for this hackathon build unless the team splits into multiple active implementation lanes.

Use only if the project needs coordinated parallel work across multiple people/agents. Otherwise, the setup and orchestration overhead is not worth it.

### gstack

gstack is useful as an opinionated set of role prompts and review workflows for Claude Code. It is not an app runtime.

Use its ideas informally:

- design review
- QA pass
- security pass
- release checklist

Do not add it as a repo requirement for this hackathon unless the whole team is already using Claude Code.

### Daytona

Daytona credits are useful for cloud dev environments or sandboxed execution. For the MVP, local development is faster.

Use Daytona only if:

- a teammate needs an instant reproducible environment,
- the local machine cannot run Docker reliably,
- or the demo needs isolated code execution.

Do not commit attendee coupon codes to the public repo.

## MVP Architecture For Bedtime School Bridge

Replace the starter's sample domain with Bedtime School Bridge:

1. Mock source data: sanitized daycare daily reports, weekly curriculum/newsletters, meals, nap notes, school activities, and home media interests.
2. Agent prompt: classify daycare context and decide which bedtime teaching modules to generate.
3. UI modules:
   - tonight's bridge overview
   - school-theme cards
   - bedtime story
   - digital story/activity view
   - food-learning card
   - movement prompt
   - emotion/body-language prompt
   - home-interest match
   - print-pack preview
   - voice/read-aloud companion
   - guided video recommendation cards
   - toy/book recommendation
   - purchase approval card
   - parent script
   - evidence chips
4. Mock input rails:
   - daycare report selector
   - curriculum selector
   - home-interest selector
   - tone and duration controls
   - print controls with browser/OS print handoff
   - digital/print/audio mode switcher
   - voice controls
   - video recommendation controls
   - toy budget/category controls
   - source evidence summary
5. Demo path:
   - choose a sanitized daycare report and weekly theme
   - add home interests such as garbage trucks, recycling, basketball, and movement songs
   - generate tonight's bedtime bridge
   - switch to 2-minute version
   - make it calmer or sillier
   - generate a printable page or mini-book
   - show the polished digital bedtime activity view
   - play a calm generated narration
   - recommend a parent-approved learning video set
   - approve a mock toy/book purchase
   - show evidence chips and privacy posture

## What To Avoid

- Do not spend the first hour integrating production Gmail sync, YouTube history export, YouTube upload, direct KDP publishing, premium TTS providers, or real payment execution.
- Do not build a plain chatbot with a static task board.
- Do not make the app depend on private coupon codes or attendee-only setup to run.
- Do not commit raw emails, child photos, photo links, raw watch history, or account identifiers.
- Do not automate publishing of private child/daycare content.
- Do not move real money in the hackathon demo.
- Do not clone voices or imitate YouTube creators.
- Do not require a configured printer for the MVP.
- Do not create an autoplay feed or unreviewed YouTube recommendations.
- Do not introduce Gas City/gstack as mandatory dependencies unless they directly speed the team today.

## Build Plan

1. Import the starter kit into this repo.
2. Verify the starter runs locally with the minimum required env.
3. Rename and retheme to Bedtime School Bridge.
4. Replace sample Notion leads data with sanitized daycare/home-interest mock data.
5. Implement generated UI module schema and renderer.
6. Add controlled input/evidence/action cards for daycare report, curriculum, home interests, print export, voice playback, guided video recommendations, toy recommendations, mock purchase approval, and privacy.
7. Add the exact demo path from `docs/DEMO_PLAN.md`.
8. Add demo prompt and README setup instructions.
9. Run local build/lint/smoke test.
10. Record the required 2-3 minute demo video.

## Decision

Proceed with the official starter kit as the base. Use Codex/OMX to build. Keep Gas City, gstack, real Gmail sync, real YouTube export, real KDP publishing, real payments, and Daytona as optional accelerators or later integrations, not the core path.
