# Bedtime School Bridge Product Brief

## Working Name

Bedtime School Bridge

## One-Sentence Pitch

Bedtime School Bridge turns daycare emails and home interests into printable bedtime stories, activities, and parent scripts, helping parents reinforce what their child learned, ate, practiced, and experienced without adding more screen time.

## Core Problem

A child's daycare experience is captured in fragmented daily reports, curriculum newsletters, menus, photos, and teacher notes. Parents often want to connect with their child at night, but they do not have time to read every email and turn it into age-appropriate conversation, stories, activities, and food curiosity.

A normal chatbot can summarize the school day, but it cannot give the parent a purpose-built bedtime teaching surface for that specific day.

Bedtime School Bridge should generate the nightly interface from the day's school context, then turn the best output into print-ready pages for the child.

## Hackathon Angle

This fits the "No Designer, No Problem", "Kill the Dashboard", and "The Copilot That Ships" tracks:

- No fixed dashboard: the agent generates tonight's teaching surface from daycare context.
- No chat-only flow: the user receives story cards, prompts, food cards, mini lessons, print controls, voice controls, toy recommendations, tone controls, and source evidence.
- Working-code demo: use sanitized daycare-like records derived from real email patterns.

## Personal Context Seed

Initial life context:

- Parent of a toddler.
- Daycare sends daily reports and weekly curriculum/newsletters to Gmail.
- Reports include what the child learned, ate, practiced, and experienced.
- Parent wants bedtime to connect to school learning without manually reading every email.

Demo prompt:

> Here is today's daycare report and this week's classroom curriculum. Build a 7-minute bedtime teaching plan that helps me talk with my child about what he learned, ate, and practiced today.

## Generated UI Surfaces

The agent can generate different UI modules depending on the daycare report:

- Tonight's bridge: a short parent overview.
- School themes: weekly theme, next theme, and character focus.
- Bedtime story: a short story using today's school activities, foods, and home interests.
- Talk prompts: toddler-level questions to ask in bed.
- Food connection: playful facts and questions about meals from the report.
- Movement prompt: a gentle activity if the day involved movement or body awareness.
- Emotion prompt: feelings vocabulary if the day involved social-emotional learning.
- Mini lesson: 2-3 concepts tied to the curriculum theme.
- Print pack: printable story page, coloring/activity page, and tomorrow card.
- Voice companion: calm narration, read-aloud support, or call-and-response prompts.
- Home interest bridge: connects school themes to known interests such as garbage trucks, recycling, sports, vehicles, and songs.
- Toy match: age-appropriate toy/book/activity recommendations tied to school themes and home interests.
- Tomorrow follow-up: one tiny activity for the next morning.
- Parent script: exact words to say, with calmer/funnier/shorter variants.
- Evidence chips: which report fields produced each module.

## Input Rails

Bedtime School Bridge should ingest school context safely and show what it used.

### Gmail Rail

Use cases:

- Search daycare emails.
- Pull daily reports and classroom newsletters.
- Extract theme, meals, nap, activities, goals, and teacher notes.
- Avoid storing raw child data in the public repo.

Hackathon MVP:

- Use sanitized mock daycare records in the public demo.
- Optionally show a Gmail import step locally if credentials are available.
- Persist only structured, sanitized fields.

### Curriculum Rail

Use cases:

- Attach a weekly theme to today's report.
- Turn curriculum goals into parent-friendly language.
- Link daily activities to the week's learning objective.

Hackathon MVP:

- Seed a representative "Move It Week 2" curriculum.
- Generate the bedtime surface from curriculum plus daily report.

### Parent Interaction Rail

Use cases:

- Make the lesson calmer.
- Make it sillier.
- Shorten to 2 minutes.
- Add food facts.
- Add movement.
- Save tonight's plan.
- Print tonight.
- Make a coloring-book page.
- Make a 5-page mini-book.

### Print And Publishing Rail

Use cases:

- Generate print-ready pages so the child gets paper instead of more video.
- Export a PDF print pack for tonight.
- Compile favorite generated stories into a monthly keepsake book.
- Prepare, but do not automatically publish, a Kindle Direct Publishing-ready package.

Hackathon MVP:

- Generate a local printable PDF or browser print view.
- Show print controls in the generated UI.
- Include an AI-generated content/privacy disclosure panel.
- Keep KDP as a future export target, not a live publishing integration.

### Toy Commerce Rail

Use cases:

- Recommend physical toys, books, and print kits that reinforce today's school learning.
- Prefer hands-on play and reading over more screen time.
- Create a parent-approved cart.
- Use agentic payment protocols when real commerce is enabled.

Hackathon MVP:

- Use a mock toy/book catalog.
- Generate recommendations from daycare theme plus home interests.
- Show a controlled purchase approval card.
- Produce a mock receipt and audit trail.
- Do not move real money.

Future protocol target:

- AP2-style parent mandates for verifiable purchase authorization.
- x402-style payment where supported by merchant/API endpoints.
- MCP/UCP-style merchant tools for product search, cart creation, checkout handoff, and receipt retrieval.

### Voice Output Rail

Use cases:

- Turn generated bedtime story into calm audio.
- Give the parent a read-aloud script with pacing.
- Replace video with a short audio-and-print ritual.
- Generate call-and-response prompts the child can answer.

Hackathon MVP:

- Add a `Listen` button for the generated story.
- Use browser speech synthesis first, or server-side TTS if credentials are available.
- Show transcript and AI-generated audio disclosure.
- Do not imitate YouTube creators or clone private voices.

## MVP Scope

Build a local web app that demonstrates:

1. User chooses a sanitized daycare report or imports recent school context.
2. Agent extracts meals, activities, themes, and developmental goals.
3. Agent generates a UI schema for tonight's bedtime teaching plan.
4. App renders interactive modules: story, prompts, food card, mini lesson, movement, print pack, voice companion, toy match, parent script, evidence.
5. User changes tone/duration and sees the surface regenerate.
6. User prints a one-page or mini-book version.

## Suggested Demo Flow

1. Start with a daycare-style report plus weekly theme.
2. Click "Build Tonight's Bridge".
3. The app renders a generated bedtime teaching surface:
   - school themes
   - 7-minute parent script
   - short story
   - food conversation card
   - movement/emotion prompts
   - print pack preview
   - listen/read-aloud controls
   - toy/book recommendation card
   - tomorrow follow-up
   - source evidence chips
4. Click "2-minute version".
5. Click "make it sillier".
6. Click "make printable".
7. Click "listen calmly".
8. Click "find a hands-on toy".
9. Approve a mock purchase and show that the UI generates a receipt/audit trail without real spending.

## Why This Is Generative UI

Bedtime School Bridge does not present a fixed lesson dashboard. The agent reads the daily daycare report and weekly curriculum, then decides which interface components are needed. A movement-heavy day produces body, rhythm, and emotion modules. An Earth Day report produces nature, food, recycling, and responsibility modules. A gardening week produces plants, soil, food, and care modules.

The core product claim is:

> The agent is not just summarizing school. It is generating tonight's teaching interface.

## Success Criteria

- The demo visibly changes the UI based on daycare context.
- At least one generated bedtime story is shown.
- At least one food-learning module is shown.
- At least one parent script/talk prompt module is shown.
- A printable page or mini-book preview is shown.
- A voice/read-aloud companion is shown.
- A toy/book recommendation and mock purchase approval card are shown.
- Source evidence is visible without exposing raw private email.
- The app can run locally from the public repo.
- README includes setup, demo prompt, protocols used, and privacy notes.

## Non-Goals For Hackathon MVP

- Persisting raw Gmail data.
- Showing private child photos.
- Full production Gmail sync.
- Medical, nutritional, or developmental diagnosis.
- Replacing teacher/parent judgment.
- Automated KDP publishing.
- Real purchases without explicit parent approval.
- Voice cloning or creator imitation without explicit consent.
- Encouraging more bedtime video watching.

## Submission Metadata Draft

- Project name: Bedtime School Bridge
- Pitch: Bedtime School Bridge turns daycare emails and home interests into printable bedtime stories, activities, and parent scripts, helping parents reinforce school learning without adding more screen time.
- Protocols used: CopilotKit/AG-UI for agent-to-frontend interaction, A2UI-style declarative UI schema for generated bedtime modules, optional MCP/Gmail rail for email context, AP2/x402-inspired mock commerce rail for parent-approved purchases.
- Team roles: TBD.

Previous concept note: this repo originally explored ErrandOS, a broad life-admin cockpit. The current build target is the narrower daycare-to-bedtime product because it is more personal, privacy-aware, and demoable within the hackathon window.
