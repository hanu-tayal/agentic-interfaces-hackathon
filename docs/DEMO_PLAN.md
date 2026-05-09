# Demo Plan

## Hackathon Submission Requirement

The final submission needs:

- project name
- one-sentence pitch
- short description of what was built
- explanation of why it is generative UI, not a chatbot
- public GitHub repo link
- 2-3 minute demo video link
- protocols used
- team member names and roles

The demo must show working code.

## Demo Thesis

Bedtime School Bridge is an agent-generated bedtime interface.

The agent reads a daycare report, classroom curriculum, and home interests, then generates the exact UI needed for tonight:

- story
- parent prompts
- food learning
- movement/emotion activity
- digital story mode
- print pack
- voice/read-aloud mode
- guided YouTube recommendations
- toy/book recommendation with mock approval
- source evidence

This would be weak as a chatbot because the value is the generated interface: cards, mode switches, print preview, listen controls, video recommendation rail, approval cards, and evidence chips.

## 2-3 Minute Demo Script

### 0:00-0:15 Opening

Show the app home screen.

Say:

> Bedtime School Bridge turns daycare emails and home interests into tonight's parent-guided learning experience: digital, print, audio, and safe recommendations.

### 0:15-0:35 Input Context

Show sanitized inputs:

- daycare report
- weekly theme: Move It Week 2
- meals
- activities
- home interests: garbage trucks, recycling trucks, basketball, movement songs

Point out:

- no raw Gmail is stored
- source fields are structured and sanitized

### 0:35-1:05 Generate UI

Click `Build Tonight's Bridge`.

The agent generates:

- tonight overview
- school themes
- bedtime story
- parent prompts
- food card
- movement/emotion prompt
- source evidence chips

Say:

> The agent is not filling a fixed dashboard. It decides which UI modules this night needs based on the actual school context.

### 1:05-1:30 Mode Switching

Click:

- `2-minute version`
- `Make it sillier`
- `Make calmer`

Show the UI regenerating around the same source context.

### 1:30-1:55 Digital / Print / Voice

Switch tabs or segmented control:

- Digital story mode
- Print pack preview
- Listen/read-aloud mode

Show:

- printable story page
- parent script
- audio/transcript or browser speech button

Say:

> The screen is useful for the parent and for the demo, but the child-facing output can become paper or calm audio.

### 1:55-2:20 Guided YouTube

Click `Recommend learning videos`.

Show:

- 3 parent-approved video cards
- why each was chosen
- watch-together prompt
- after-watching print/play activity
- stop point

Say:

> If video time happens, the agent turns it into a curated learning set, not an infinite feed.

### 2:20-2:40 Toy Commerce

Click `Find hands-on toy`.

Show:

- toy/book recommendation
- why it matches school theme and home interest
- safety fit
- budget
- mock purchase approval
- fake receipt/audit trail

Say:

> The agent can propose a physical learning extension, but parent approval gates every purchase.

### 2:40-3:00 Close

Show evidence chips and final plan.

Say:

> This is generative UI because the interface itself is generated from the child's school day, not predesigned as a static task board or chatbot.

## Minimum Working Demo Surface

If time is tight, implement only this path:

1. One seeded daycare report.
2. One seeded curriculum.
3. One seeded home-interest profile.
4. `Build Tonight's Bridge` button.
5. Generated UI cards:
   - story
   - parent prompts
   - food card
   - print preview
   - voice button
   - guided video cards
   - toy recommendation/mock approval
   - evidence chips
6. Mode/tone controls that visibly regenerate content.

## Demo Video Requirements

Record:

- browser window
- app interactions
- short narration
- no private Gmail, YouTube account, child photos, or raw daycare messages

Target length:

- ideal: 2:30
- maximum: 3:00

