# Toy Commerce Requirement

## Product Requirement

Bedtime School Bridge should be able to recommend and help buy toddler-appropriate toys, books, and print materials that reinforce what the child is learning at school and already enjoys at home.

Examples:

- school theme is "Move It" plus home interest is basketball -> toddler-safe soft ball, movement cards, gross-motor game
- school theme is "Our Earth" plus home interest is garbage trucks -> recycling truck toy, cleanup sorting game, Earth Day picture book
- school theme is "Gardening" plus food report mentions peas/berries -> child-safe planting kit, garden picture book, pretend vegetables
- school theme is "Five Senses" -> texture cards, smell jars, sound matching game

## User Value

The product should not only create a bedtime lesson. It should close the loop into the physical world:

- fewer videos
- more print
- more hands-on play
- toys tied to school learning
- parent-approved purchasing instead of open-ended browsing

## Agent Capabilities

The agent should be able to:

1. Infer a learning goal from daycare context.
2. Match the learning goal to age-appropriate toy/book/activity categories.
3. Explain why each recommendation fits the child, theme, and bedtime/print goal.
4. Filter out unsafe, overstimulating, or developmentally mismatched products.
5. Compare options by age range, materials, size, price, delivery speed, and parent preference.
6. Generate a parent approval card before checkout.
7. Execute or hand off purchase only after explicit parent approval.

## Generated UI Modules

Add these commerce modules:

- Toy Match: why this item fits today's school theme.
- Safety Fit: age range, choking-risk reminder, material notes, and supervision note.
- Print Alternative: printable activity that can replace buying.
- Budget Selector: parent-controlled spending cap.
- Purchase Approval: final cart, price, merchant, delivery estimate, and reason.
- Mandate Receipt: signed authorization summary or mock receipt.
- Audit Trail: what the agent searched, why it chose the item, and what the parent approved.

## Protocol Direction

The product should be designed for agentic commerce protocols, but the hackathon demo should use a mock checkout rail.

Target protocol concepts:

- AP2-style mandate: cryptographically verifiable parent authorization before the agent spends money.
- x402-style payment: HTTP-native machine payment for services or commerce endpoints where supported.
- UCP/merchant integration: structured product discovery and checkout handoff where supported.
- MCP tool boundary: product search, cart creation, and receipt retrieval exposed as tools with strict permissions.

## Hackathon MVP

Implement mock commerce, not real spending:

1. Seed a small catalog of toddler-safe toys/books/print kits.
2. Generate recommendations from daycare theme plus home interests.
3. Render a purchase approval card.
4. Require explicit click on `Approve mock purchase`.
5. Produce a fake receipt and audit trail.
6. Include clear text that no real money moved.

## Safety Rules

- Never buy automatically.
- Never exceed a parent-set budget.
- Never hide shipping, taxes, subscriptions, or recurring charges.
- Never recommend unsafe products without clear warnings.
- Prefer books, printables, and open-ended toys over more screen media.
- Always offer a no-purchase printable alternative.
- Store only sanitized recommendation and approval metadata in the public demo.

## Future Real Purchase Flow

Future flow:

1. Parent sets budget, categories, merchants, and approval policy.
2. Agent searches merchant/product tools.
3. Agent proposes a cart with evidence.
4. Parent signs an AP2-style mandate or equivalent authorization.
5. Agent completes checkout through supported payment rail.
6. App stores receipt, disclosure, and audit trail.

This should remain a controlled action rail. The agent can propose, compare, and prepare. The parent authorizes spending.

