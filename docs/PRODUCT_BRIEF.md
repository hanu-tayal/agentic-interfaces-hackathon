# ErrandOS Product Brief

## Working Name

ErrandOS

## One-Sentence Pitch

ErrandOS turns scattered life obligations into a generated action cockpit where an AI agent creates the exact UI needed to triage, approve, pay, call, schedule, and finish personal errands.

## Core Problem

Modern life admin is fragmented across email, phone calls, web portals, calendars, texts, payment flows, reminders, and family context. A normal chatbot can summarize the mess, but it cannot give the user a purpose-built operational surface for each errand.

ErrandOS should be an agent-generated interface for the current life situation, not a static task app.

## Hackathon Angle

This fits the "Kill the Dashboard" and "The Copilot That Ships" tracks:

- No fixed dashboard: the agent generates the dashboard from the user's current errand pile.
- No chat-only flow: the user receives interactive cards, timelines, forms, approval gates, payment controls, call scripts, and completion states.
- Working-code demo: use local mocked errands, contacts, merchants, and call/payment rails to demonstrate the runtime UI generation pattern.

## Personal Context Seed

Initial life context:

- Parent of a toddler.
- Toddler likes YouTube videos such as Super Simple, garbage trucks, and Blippi.
- Mother's Day is Sunday, May 10, 2026.
- User is tired of errands scattered across phone, email, web, and other surfaces.

Demo prompt:

> Tomorrow is Mother's Day. I have a toddler, I am behind on errands, and my life admin is scattered across email, phone calls, texts, payments, and calendar reminders. Build me the operating surface for the next 24 hours.

## Generated UI Surfaces

The agent can generate different UI modules depending on the errand cluster:

- Priority board: urgent, today, waiting, delegated, done.
- Mother's Day rescue panel: gift options, message drafts, schedule, fallback plans.
- Toddler time block: toddler-friendly activity/video window while errands are handled.
- Payment approval card: amount, merchant, reason, max spend, expiry, approve/decline.
- Voice-call task card: who to call, goal, script, allowed facts, call status, transcript.
- Email/text reply composer: generated draft with tone controls and send/copy buttons.
- Document checklist: missing fields, upload slots, due dates, completion proof.
- Timeline: what must happen before stores close, delivery cutoffs, family schedule.
- Audit trail: user approvals, completed actions, pending external confirmations.

## Action Rails

ErrandOS should present external actions through explicit approval gates. The agent proposes; the user approves; the system records what happened.

### Payment Rail

Use cases:

- Buy Mother's Day flowers, gift card, or brunch reservation deposit.
- Pay a bill.
- Purchase a toddler activity item.
- Pay an API or service on behalf of the user.

Relevant protocols and integrations:

- Agent Payments Protocol (AP2): agent-led payments with signed user authorization.
- Agentic Commerce Protocol (ACP): merchant checkout sessions and delegated payments.
- x402: HTTP-native machine payments using `402 Payment Required`.
- Stripe or mock PSP: pragmatic demo rail for checkout-style flows.

Hackathon MVP:

- Render a payment approval UI.
- Simulate a constrained payment mandate: merchant, max amount, expiry, purpose, user approval.
- Mock the final payment execution and receipt.
- Keep real money disabled unless credentials and safety checks are intentionally added.

### Voice/Phone Rail

Use cases:

- Call a restaurant for Mother's Day availability.
- Call a pharmacy, doctor's office, daycare, mechanic, or service provider.
- Handle a scripted errand where the agent needs to ask, confirm, and report back.

Relevant protocols and integrations:

- SIP: standard protocol for routing phone calls over the internet.
- OpenAI Realtime API with SIP: route phone calls to a realtime voice agent.
- Twilio Programmable Voice: make, receive, and monitor phone calls.
- Vapi or Retell: managed voice-agent platforms for inbound/outbound calls.

Hackathon MVP:

- Render a voice-call approval UI.
- Generate the call objective, script, allowed disclosures, and fallback questions.
- Simulate call progress: queued, dialing, in progress, completed.
- Show a generated transcript and extracted outcome.
- Optionally wire Twilio/Vapi later if credentials are available.

### Calendar/Reminder Rail

Use cases:

- Reserve time to complete errands.
- Block toddler-friendly windows.
- Schedule Mother's Day preparation.
- Set follow-up reminders after calls or payments.

Hackathon MVP:

- Mock calendar slots locally.
- Generate timeline and reminders.
- Export or copy event details.

## MVP Scope

Build a local web app that demonstrates:

1. User enters or selects a messy life-admin scenario.
2. Agent classifies errands and generates a UI schema.
3. App renders the generated UI modules.
4. User approves mock actions: pay, call, draft message, schedule, mark done.
5. App shows an audit trail proving the agent did not act without approval.

## Suggested Demo Flow

1. Start with a plain text dump of life context and errands.
2. Click "Generate ErrandOS".
3. The app renders a custom cockpit:
   - Mother's Day rescue plan
   - Toddler coverage block
   - Errand priority board
   - Payment approval card
   - Phone-call approval card
   - Draft message composer
4. Approve a mock flower purchase.
5. Approve a mock restaurant call.
6. Show resulting receipt, transcript summary, and remaining checklist.

## Why This Is Generative UI

ErrandOS does not present one fixed task dashboard. The agent reads the user's current life-admin situation and decides which interface components are needed. A different errand pile produces a different operational surface: forms, call controls, payment approvals, timelines, drafts, or checklists.

The core product claim is:

> The agent is not just telling the user what to do. It is generating the interface for doing it.

## Success Criteria

- The demo visibly changes the UI based on user context.
- At least one payment-like approval surface is generated.
- At least one voice-call-like approval surface is generated.
- Every external action has an explicit user approval step.
- The app can run locally from the public repo.
- README includes setup, demo prompt, protocols used, and safety notes.

## Non-Goals For Hackathon MVP

- Real purchases.
- Real outbound calls without explicit operator setup.
- Full Gmail, SMS, or calendar integration.
- Permanent storage of sensitive personal data.
- Autonomous external actions without approval.

## Submission Metadata Draft

- Project name: ErrandOS
- Pitch: ErrandOS turns scattered life obligations into a generated action cockpit where an AI agent creates the exact UI needed to triage, approve, pay, call, schedule, and finish errands.
- Protocols used: MCP Apps or generated UI schema, AP2-inspired payment mandates, ACP-inspired checkout sessions, x402-inspired paid-resource flow, SIP/Twilio/OpenAI Realtime-inspired voice-call rail.
- Team roles: TBD.
