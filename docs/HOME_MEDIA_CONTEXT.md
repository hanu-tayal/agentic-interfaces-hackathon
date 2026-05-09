# Home Media Context

## Purpose

This document captures sanitized themes from toddler YouTube watching patterns so Bedtime School Bridge can connect school learning with home interests.

No raw watch history, private account export, timestamps, URLs, or full account data should be committed. Use only broad themes and mock examples.

## Discovery Method

The separate agent did not have a direct YouTube connector. A local authenticated browser sample of YouTube Watch History was used instead.

Privacy rule:

- Record only channel/topic/theme patterns.
- Do not store raw history exports.
- Do not commit video URLs.
- Do not commit account identifiers.
- Treat all media-history data as sensitive.

## Observed Toddler Content Themes

Strong repeated interests:

- vehicles
- garbage trucks
- recycling trucks
- fire trucks
- ambulances
- construction vehicles
- trains
- airplanes
- buses
- basketball and sports play
- movement songs
- colors
- counting
- animals and animal sounds
- food and hunger songs
- hygiene and routine songs
- friendship and helping songs
- calmer story content

Representative channel/content families from the sample:

- Blippi and related kids learning/music channels
- Super Simple Songs and related character channels
- garbage/recycling truck compilation channels
- vehicle-learning channels
- softer narrative preschool content such as Little Bear

## Concrete Topic Patterns

Vehicle and machine topics:

- garbage trucks
- recycling
- toy vehicles
- fire trucks
- ambulances
- excavators
- skid steers
- dump trucks
- trains
- airplanes
- buses
- car wash and traffic signals

Learning topics:

- colors
- counting up to 20
- alphabet songs
- animal sounds
- plant and nature songs
- beach/summer songs
- bubbles
- food vocabulary
- brush teeth
- playground play
- friendship and routines

Movement topics:

- stomp
- walk around the circle
- red light / green light
- dance
- jump
- flap wings
- sports and basketball

## Product Implications

Bedtime School Bridge should not only translate daycare emails into bedtime learning. It should also bridge school context to interests the child already has at home.

Examples:

- If school theme is "Move It", connect it to basketball, stomping, running, buses, and red light / green light.
- If school theme is "Our Earth", connect it to garbage trucks, recycling trucks, cleanup, and caring for the planet.
- If school theme is "Gardening", connect it to food songs, colors, plant growth, and simple counting.
- If the daycare report mentions responsibility, connect it to cleanup, recycling, brushing teeth, and putting one book away.
- If bedtime needs to be calm, transform high-energy vehicle content into low-energy talk prompts: count wheels, whisper vehicle sounds, imagine a truck going to sleep.

## Generated UI Modules To Add

Useful modules for the app:

- Home Interest Match: maps school theme to known child interests.
- Calm Downshift: turns high-energy videos into a quiet bedtime version.
- Vehicle Bridge: connects trucks, trains, buses, and rescue vehicles to school concepts.
- Song Prompt: suggests a short familiar song or rhyme without embedding videos.
- Parent Translation: gives exact bedtime language using the child's interests.
- Media Boundary: makes clear the app is not starting more video at bedtime.

## Demo Addition

Sanitized input:

- School theme: Move It Week 2.
- School activities: hopping, twisting, twirling, sports heroes, body language.
- Home interests: garbage trucks, recycling trucks, Blippi vehicle songs, Super Simple movement songs, basketball.

Expected generated surface:

- A quiet "garbage truck goes to sleep" story using movement words.
- A counting prompt for wheels and green beans.
- A responsibility prompt about recycling or putting one book away.
- A body-language prompt: "Show me a sleepy face, a happy face, and a proud face."
- A no-video bedtime note: "We are using the idea from the videos, not watching another one."
