# Voice Output Requirement

## Product Requirement

Bedtime School Bridge should be able to turn generated bedtime material into calm audio that a parent can play or read along with.

The voice feature should support:

- narrated bedtime story
- parent read-aloud guide
- call-and-response prompts
- short song/rhyme suggestions
- printable mini-book with companion audio
- calm mode for winding down

## Why Voice

The child already responds to spoken/sung media from kids videos. Voice can preserve the engaging part of those videos while removing the screen.

The product goal is not "more YouTube." The product goal is:

> Use voice as a bridge away from video and toward print, reading, and parent interaction.

## Generated UI Modules

Add these voice modules:

- Listen Mode: play the generated bedtime story as audio.
- Read Together Mode: highlight one sentence at a time for the parent.
- Parent Voice Script: gives the parent exact words and pacing.
- Call And Response: toddler-friendly repeated lines.
- Calm Voice Controls: slower, softer, shorter.
- Audio Disclosure: clearly marks AI-generated narration.
- No-Video Boundary: reminds parent this replaces video, not starts video.

## Voice Provider Direction

Hackathon options:

- Browser speech synthesis for no-credential local demo.
- OpenAI text-to-speech for higher-quality generated narration.
- ElevenLabs text-to-speech for expressive voices and multi-speaker story output if credentials are available.

OpenAI's Audio API supports text-to-speech with built-in voices and streaming output. OpenAI policy requires clear disclosure that generated TTS audio is AI-generated.

ElevenLabs provides text-to-speech, voice APIs, and expressive/multilingual models through REST and SDKs.

## Hackathon MVP

Implement one of these, in this order:

1. Browser-native speech synthesis for immediate local demo.
2. If credentials are available, server-side TTS that writes an audio file for the generated story.
3. Add a visible `Listen` button and voice controls.

Generated audio should be short:

- 30-90 seconds for a bedtime story
- under 20 seconds for call-and-response prompts
- optional 2-minute full plan narration

## Safety And Rights

- Do not clone a real person's voice without explicit consent.
- Do not imitate a YouTube creator's voice or character voice.
- Do not generate audio that encourages the child to keep watching videos.
- Keep audio calm for bedtime.
- Provide a transcript for every generated audio output.
- Make AI-generated voice disclosure visible.
- Let the parent choose whether audio is generated or only a script is shown.

## Future Voice Workflow

Future flow:

1. Agent generates story, parent script, and print pack.
2. Parent selects voice mode: parent script, calm narrator, or call-and-response.
3. App generates audio plus synchronized text.
4. Parent can print the story and play the companion audio.
5. App stores only the generated story metadata and transcript unless the parent saves audio.

