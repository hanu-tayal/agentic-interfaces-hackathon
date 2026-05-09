# Next Agent Handoff

Last updated: May 9, 2026.

## Current Repo State

Repo: `https://github.com/hanu-tayal/agentic-interfaces-hackathon`

Branch: `main`

Latest pushed commit before this handoff doc:

`a298d67` - `Make the bedtime demo visibly generative`

The app is a public hackathon repo for **Bedtime School Bridge**, a toddler bedtime learning product that converts daycare learning signals, meals, and home interests into a generated bedtime interface.

## Product Direction

Build an agentic generative UI demo for the Seattle AI Tinkerers Generative UI Global Hackathon.

Core story:

The parent gets emails from daycare and knows the child likes videos about garbage trucks, basketball, movement songs, and similar topics. The product generates a parent-approved bedtime learning bridge for tonight: digital story, printable pages, voice read-aloud, guided YouTube learning rail, and hands-on toy recommendation.

Do not commit private data. The repo is public.

Never commit:

- Raw Gmail/daycare emails.
- YouTube history or private account data.
- Child photos, names, links, or identifiers.
- Secrets, API keys, payment credentials, KDP credentials, printer details.
- Hackathon credit claim links or coupon codes.

## What Works Now

Frontend:

- Main page: `apps/frontend/src/app/page.tsx`
- Local URL: `http://localhost:3010`
- Command: `npm run dev:ui`

Generative UI path:

- API route: `apps/frontend/src/app/api/bedtime/generate/route.ts`
- Manifest types/fallback: `apps/frontend/src/lib/bedtime/generative-ui.ts`
- The UI calls `/api/bedtime/generate`.
- The API returns a typed UI manifest with:
  - `generatedBy`
  - `intent`
  - `layout`
  - `modules[]`
  - each module has a `renderer`
- The page renders from the manifest and visibly shows the generated provider/layout/renderer names.

Provider behavior:

- If `ANTHROPIC_API_KEY` is present, the API attempts an Anthropic call.
- If no Anthropic key is present, it returns a local deterministic fallback.
- If `GEMINI_API_KEY` exists but Anthropic does not, current code marks `generatedBy: "gemini-ready"` but does not call Gemini yet.

Commerce and voice adapters:

- Commerce contract: `apps/frontend/src/lib/bedtime/commerce.ts`
- Voice contract: `apps/frontend/src/lib/bedtime/voice.ts`
- Strategy doc: `docs/AGENT_COMMERCE_AND_VOICE_ADAPTERS.md`

Docs:

- README: `README.md`
- Hackathon requirements: `HACKATHON.md`
- Demo strategy: `docs/DEMO_PLAN.md`, `docs/WINNING_DEMO_STRATEGY.md`
- Requirements docs in `docs/`

## Verification Already Run

Commands that passed:

```bash
npm install
npm run build --workspace frontend
curl --max-time 20 -s -X POST http://127.0.0.1:3010/api/bedtime/generate \
  -H 'content-type: application/json' \
  -d '{"tone":"calmer","duration":"2-minute","context":{"weeklyTheme":"Move It Week 2"}}'
curl --max-time 20 -I http://127.0.0.1:3010
```

The dev server was started successfully with:

```bash
npm run dev:ui
```

It serves on port `3010`.

## Known Gaps

The current MVP is good enough for a hackathon demo, but the user correctly pointed out the first version did not look generative enough. This was fixed by adding the manifest route and manifest-rendered UI. The next improvement should make the generated UI feel even more dynamic.

Open gaps:

- Gemini is not actually called yet. The repo only has a Gemini-ready marker.
- The full CopilotKit BFF/agent/Docker/Notion stack was not validated.
- CopilotKit sidebar proxies currently expect backend services on local ports; frontend demo still works without them.
- Commerce is mock-only.
- Amazon/other-website buying must remain parent-approved and protocol-backed, not browser-click automation.
- Voice uses browser `speechSynthesis`; no cloud TTS export yet.
- YouTube rail uses seeded recommendations, not live YouTube API/search.
- Printing is browser print/PDF, not direct printer automation.
- No demo video has been recorded yet.

## Recommended Next Steps

### 1. Make GenUI More Obvious

Add a right-side "Generated Manifest" inspector with collapsible JSON for the current manifest. This will help judges understand the runtime UI generation.

Also consider rendering different layouts based on duration/tone, for example:

- `2-minute`: story + voice + one prompt only.
- `calmer`: voice-first layout, fewer cards.
- `sillier`: movement-first layout, bigger YouTube rail.
- `print-first`: print pack becomes primary.

### 2. Wire Gemini Properly

Use current Google docs or starter kit patterns before implementing.

Goal:

- If `GEMINI_API_KEY` is set, `/api/bedtime/generate` should call Gemini and return the same `GeneratedInterface` shape.
- Keep deterministic fallback.
- Never require a key for the local demo to run.

Do not commit any key.

### 3. Add A2UI/AG-UI Language To The Demo

The starter includes AG-UI/A2UI material. The product manifest is currently custom. To make it more aligned with hackathon expectations, either:

- map `GeneratedInterface` to A2UI-like schema names in docs/UI, or
- add a small adapter file such as `apps/frontend/src/lib/bedtime/a2ui-adapter.ts`.

The user asked to use the starter kit tools but not be restricted to them.

### 4. Commerce Lane

Do not automate Amazon checkout by uncontrolled browser clicks.

Recommended approach:

- Keep `commerce.ts` as provider abstraction.
- Add providers:
  - `mock`
  - `amazon-handoff`
  - `agentic-commerce-protocol`
  - `x402`
  - maybe `stripe-acp`
- UI should produce a reviewed cart and require explicit parent approval.
- Real payment protocol integration can be demoed with a fake provider or sandbox only.

References already used:

- AWS AgentCore Payments preview.
- Stripe/OpenAI Agentic Commerce Protocol announcement.

### 5. Voice Lane

Keep `voice.ts` as the boundary.

Next useful work:

- Add cloud TTS provider option behind env.
- Add "Generate bedtime audio" button that creates transcript-first preview.
- Avoid creator imitation, daycare-staff imitation, and child voice cloning.
- Add download/export only after transcript review.

### 6. Demo Video

Suggested 2-3 minute demo:

1. Problem: daycare learns one thing, YouTube at home is disconnected.
2. Click **Build bridge**.
3. Show generated manifest: layout + renderers.
4. Show digital story.
5. Switch to print, voice, YouTube, toy.
6. Click 2-minute or calmer and show regenerated interface.
7. Close with privacy/parent-approval story.

## Safety Constraints

Parent approval must gate:

- purchases,
- uploads,
- direct printing,
- KDP publishing,
- cloud voice export,
- YouTube watch plan changes.

For the public hackathon repo, use sanitized context and seeded/mock data only.

## Useful Commands

```bash
git status --short
npm run build --workspace frontend
npm run dev:ui
```

If port `3010` is already used:

```bash
pkill -f "next dev --turbopack -p 3010"
npm run dev:ui
```

## Commit Protocol

Follow the Lore commit protocol from `/Users/hanu/AGENTS.md`.

Commit messages should include trailers such as:

```text
Constraint: public hackathon repo excludes private child/email/payment data.
Rejected: <alternative> | <reason>
Confidence: high
Scope-risk: narrow|moderate|broad
Directive: keep real-world side effects parent-approved and adapter-gated.
Tested: <commands>
Not-tested: <gaps>
```
