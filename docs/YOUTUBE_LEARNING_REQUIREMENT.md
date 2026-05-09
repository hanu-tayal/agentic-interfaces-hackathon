# YouTube Learning Requirement

## Product Requirement

Bedtime School Bridge should help parents turn video time into intentional learning time.

The product should support two related paths:

1. Recommend existing high-quality YouTube videos that reinforce today's daycare learning.
2. Generate parent-owned video scripts/storyboards that could later become private or public learning videos.

The goal is not more passive video. The goal is:

> If the child is going to watch YouTube, make it aligned with school, home interests, and parent-approved learning goals.

## Use Cases

- School theme is "Move It" -> recommend movement songs, red-light/green-light, basketball basics, body parts, and fast/slow videos.
- School theme is "Our Earth" -> recommend recycling, garbage truck, cleanup, plant, and nature videos.
- School theme is "Gardening" -> recommend plant growth, vegetables, colors, counting seeds, and garden songs.
- School theme is "Five Senses" -> recommend simple smell, sound, color, texture, and taste videos.
- Home interest is garbage trucks -> find recycling/cleanup videos that teach responsibility, not just vehicle noise.
- Home interest is Blippi/Super Simple style -> favor educational, song-based, calm, clear-language content.

## Recommendation Rail

The app should generate a curated watchlist, not an infinite feed.

Generated UI modules:

- Learning Goal: what today's video time should reinforce.
- Recommended Videos: 3-5 parent-approved video cards.
- Why This Video: school theme, skill, vocabulary, and home-interest match.
- Watch Together Prompt: what the parent can ask before/during/after watching.
- Print/Play Follow-up: paper or toy activity after the video.
- Safety Flags: why the agent rejected lower-quality videos.
- Stop Point: one explicit end-of-session card.

## Video Quality Heuristics

Prefer videos that:

- are designed for preschool children
- use simple language
- teach one clear concept
- connect to the daycare theme
- encourage movement, singing, reading, counting, or pretend play
- are calm enough for evening use when needed
- avoid product-push or toy-unboxing overload
- avoid sensational thumbnails and keyword-stuffed titles
- are short enough for intentional viewing

Reject or down-rank videos that:

- are long compilations with no clear learning goal
- are primarily ads, product packaging, or toy accumulation
- use misleading/sensational thumbnails
- mix unrelated child-interest keywords
- encourage endless autoplay
- include violence, scary content, mature themes, or unsafe imitation

## Protocol And API Direction

YouTube recommendation path:

- Use YouTube Data API `search.list` in future implementations to search for videos/channels by generated query.
- Use whitelisted channels and parent-approved sources when possible.
- Store only video IDs, titles, channel names, recommendation rationale, and parent approval metadata.
- Do not store raw account watch history in the public repo.

YouTube content creation path:

- Use generated scripts, storyboards, captions, and thumbnails as the MVP output.
- Treat upload as a future, explicit creator workflow.
- If upload is added later, YouTube Data API `videos.insert` can upload videos, but the parent must review metadata, audience settings, privacy status, title, description, and thumbnail before upload.

## Made-For-Kids And Policy Requirements

If the app helps publish videos for children, the workflow must account for YouTube's child-directed content rules.

Requirements:

- Parent reviews whether the video is made for kids before upload.
- Content aimed at young children should be marked appropriately.
- Do not rely on YouTube to classify the content for the creator.
- Avoid direct product-promotion in child-facing videos.
- Avoid deceptive, sensational, or clickbait packaging.
- Include an AI-generated-content disclosure workflow if synthetic audio/images/video are used and platform rules require it.
- Do not imitate existing YouTube creators or characters.

## Hackathon MVP

Build recommendation, not upload:

1. Generate 3-5 recommended video cards from the daycare theme and home interests.
2. Use a mock/seeded catalog for reliability during the demo.
3. Show why each video was chosen.
4. Add `Watch together` prompts.
5. Add `After watching` printable or physical activity.
6. Add `Stop after this` boundary.
7. Optionally include a generated video script/storyboard card.

MVP should not:

- auto-play videos
- open an infinite feed
- upload to YouTube
- scrape private watch history
- recommend videos without parent review

## Future Generated Content Flow

Future flow:

1. Agent reads daycare context and home-interest profile.
2. Agent drafts a 60-90 second custom learning video script.
3. Parent chooses format: slideshow, simple animation, read-aloud, or song.
4. App generates:
   - script
   - shot list
   - captions
   - parent narration
   - thumbnail draft
   - made-for-kids checklist
   - privacy setting recommendation
5. Parent may export locally, keep private, or manually upload.

Default should be private/local export. Public YouTube publishing is a future path, not the hackathon core.

