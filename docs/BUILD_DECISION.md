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

For ErrandOS, that means the team can spend time replacing the sample "Notion leads" domain with life-admin errands instead of building protocol plumbing from scratch.

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

- Controlled components for high-risk action rails: payment approvals, voice-call approvals, message drafts, audit trail.
- Declarative/A2UI-style generated layouts for flexible errand boards, timelines, checklists, and triage views.
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

## MVP Architecture For ErrandOS

Replace the starter's sample domain with ErrandOS:

1. Mock source data: emails, messages, calls, calendar items, bills, Mother's Day context, toddler constraints.
2. Agent prompt: classify life-admin inputs and decide which UI modules to generate.
3. UI modules:
   - errand priority board
   - Mother's Day rescue plan
   - toddler coverage block
   - payment approval card
   - voice-call approval card
   - message draft composer
   - audit trail
4. Mock action rails:
   - payment mandate approval -> fake receipt
   - call approval -> fake transcript/outcome
   - draft approval -> copied/saved message state
5. Demo path:
   - choose or paste messy life context
   - generate cockpit
   - approve a mock payment
   - approve a mock call
   - show audit trail and remaining errands

## What To Avoid

- Do not spend the first hour integrating real Gmail, SMS, phone calls, or payments.
- Do not build a plain chatbot with a static task board.
- Do not make the app depend on private coupon codes or attendee-only setup to run.
- Do not use real purchases or real outbound calls without explicit safety gates.
- Do not introduce Gas City/gstack as mandatory dependencies unless they directly speed the team today.

## Build Plan

1. Import the starter kit into this repo.
2. Verify the starter runs locally with the minimum required env.
3. Rename and retheme to ErrandOS.
4. Replace sample Notion leads data with local ErrandOS mock data.
5. Implement generated UI module schema and renderer.
6. Add controlled action cards for payment and voice-call approvals.
7. Add demo prompt and README setup instructions.
8. Run local build/lint/smoke test.
9. Record demo.

## Decision

Proceed with the official starter kit as the base. Use Codex/OMX to build. Keep Gas City, gstack, real payments, real calls, and Daytona as optional accelerators or later integrations, not the core path.
