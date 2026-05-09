# Print And Publishing Strategy

## Product Requirement

Bedtime School Bridge should help the child watch less passive TV by turning generated bedtime learning into parent-guided digital, printable, and audio material.

The product should support print-first outputs without making print the only mode:

- one-page bedtime story
- coloring page
- parent read-aloud script
- activity card
- sticker/checkoff routine card
- weekend mini-book
- monthly keepsake book

It should also support a polished digital story/activity view for the hackathon demo and for parent-guided use.

## KDP Position

Kindle Direct Publishing is a strong long-term export path, but it should not be the hackathon MVP's core dependency.

Use KDP as:

- an optional "publish-ready book package" target
- a later human-approved workflow
- a polished monthly or quarterly keepsake product

Do not use KDP as:

- a real-time bedtime flow
- an automated one-click publishing action
- a place to send private child/daycare data without explicit parent review

## Why

KDP supports eBooks, paperbacks, and hardcover print-on-demand. The publishing workflow requires prepared manuscript and cover files, book metadata, upload/preview, rights, pricing, and publication review.

Amazon also requires disclosure of AI-generated text, images, or translations when publishing through KDP. If the generated bedtime book includes AI-written text or AI-created illustrations, the parent/publisher must disclose that in the KDP workflow and verify that the content follows KDP guidelines.

## Hackathon MVP

Build "Print Pack" instead of direct KDP publishing:

1. Generate a printable PDF from the bedtime plan.
2. Include 3-5 pages:
   - cover page
   - story page
   - coloring/activity page
   - parent script
   - tomorrow follow-up card
3. Add print controls:
   - `Print tonight`
   - `Make it black-and-white`
   - `Make it coloring-book style`
   - `Make a 5-page mini-book`
   - `Remove private details`
4. Add a provenance/privacy panel:
   - source fields used
   - AI-generated disclosure note
   - parent review required before sharing or publishing

Delivery path:

- Use browser print and PDF export first.
- Do not require a configured local printer for the demo.
- If a home printer is available, let the OS print dialog handle the printer connection.
- Keep print-shop fulfillment as a future parent-approved commerce flow.

## Future KDP Workflow

Future flow:

1. Parent reviews a set of generated print packs.
2. App compiles selected stories into a monthly book.
3. App generates:
   - print-ready manuscript PDF
   - cover PDF
   - title/subtitle suggestions
   - author/publisher metadata draft
   - AI-generated content disclosure checklist
   - privacy checklist
4. Parent manually uploads to KDP and previews before publishing.

Automation boundary:

- The app may prepare files and metadata.
- The app should not submit to KDP or publish without explicit human control.

## Product Framing

The screen is the creation surface for the parent and the demo surface for the hackathon. The child-facing artifact can be digital, audio, or paper, with paper and audio available when the goal is less screen time.

Positioning:

> Turn daycare emails and favorite videos into digital, printable, and audio bedtime learning, so the child gets more personalized reading and less passive video.
