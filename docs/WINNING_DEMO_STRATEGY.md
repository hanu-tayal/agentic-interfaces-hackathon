# Winning Demo Strategy

## What The Hackathon Rewards

The event rewards:

- working code
- originality
- effective use of generative UI

The demo must be 2-3 minutes and show working code. The core test is whether the app would be impossible as a plain chatbot.

## Winning Angle

Do not demo "AI summarizes daycare emails."

Demo:

> The agent generates the whole bedtime interface for tonight, then lets the parent switch the child-facing output between digital, print, voice, guided YouTube, and hands-on play.

That makes the UI itself the artifact.

## Highest-Leverage Demo Features

Build these first:

1. Runtime-generated UI schema
   - Agent returns structured modules, not a fixed page.
   - UI visibly changes when source context or mode changes.

2. One strong seeded scenario
   - Theme: Move It Week 2.
   - Home interests: garbage trucks, recycling, basketball, movement songs.
   - Meals: rice, green beans, watermelon.

3. Mode switcher
   - Digital story.
   - Print pack.
   - Listen/read-aloud.
   - Guided YouTube.
   - Hands-on toy/book.

4. Evidence chips
   - Show which daycare/home fields caused each module.
   - This proves it is grounded, not random generation.

5. Parent approval rails
   - Approve mock toy purchase.
   - Approve guided video set.
   - Print/download only after explicit action.

6. One "wow" moment
   - Change from `Move It` to `Our Earth` or click `Make calmer`.
   - The interface reorganizes itself: story, prompts, video cards, print page, and toy recommendation all change.

## What To Avoid For The Demo

- Real Gmail sync.
- Real YouTube upload.
- Real purchases.
- Direct printer driver integration.
- KDP publishing.
- Long setup flows.
- A generic chat panel as the main experience.

These are good future rails, but they distract from the judged artifact.

## Suggested Demo Narrative

1. "This is a parent problem: daycare learning is trapped in emails and toddler interests are trapped in YouTube."
2. "The agent reads sanitized school/home context."
3. "It generates the bedtime interface for tonight."
4. "Now watch the interface change when I ask for a calmer or shorter version."
5. "Here is the digital child view."
6. "Here is the print pack."
7. "Here is the voice/read-aloud mode."
8. "Here is a parent-approved YouTube learning set, with a stop point."
9. "Here is a physical toy/book recommendation with mock purchase approval."
10. "This is not a chatbot. The agent is designing the interface."

## Build Priority

If time is limited:

1. Implement generated UI rendering with seeded/mock agent output.
2. Add the mode switcher and regeneration controls.
3. Add voice with browser speech synthesis.
4. Add print preview with browser print.
5. Add guided YouTube cards from a seeded catalog.
6. Add toy recommendation with mock approval.
7. Polish the demo path and record video.

Do not wait for real external integrations before recording a winning demo.

