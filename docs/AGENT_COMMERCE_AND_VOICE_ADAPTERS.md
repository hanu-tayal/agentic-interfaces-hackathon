# Agent Commerce And Voice Adapters

Status: post-MVP implementation lane.

## Decision

Build commerce and voice behind adapter contracts. The MVP uses mock checkout and browser speech. Production can swap in protocol-backed providers without changing the generated UI surface.

## Commerce Path

The product should not automate checkout on Amazon or other consumer websites by clicking through a browser. That is fragile, hard to audit, and unsafe for a toddler-facing product.

Use this hierarchy:

1. Protocol-native checkout where merchants support it.
2. Parent-approved marketplace handoff where protocol checkout is unavailable.
3. Browser-assisted checkout only for a reviewed cart, with parent confirmation before payment.
4. No autonomous purchase without scoped authorization, spend cap, and audit record.

Current protocol notes as of May 9, 2026:

- Stripe/OpenAI Agentic Commerce Protocol (ACP) is the best fit for merchant checkout when a merchant supports agentic commerce.
- AWS Bedrock AgentCore Payments preview uses Coinbase and Stripe wallet connections plus x402 negotiation for paid APIs, MCP servers, web content, and other agent resources.
- Coinbase x402 is a strong fit for machine-to-machine payments and paid resources, not toddler toy checkout by itself.
- Amazon consumer checkout should start as a parent handoff unless an official supported commerce API or agentic checkout surface is available.

Implementation files:

- `apps/frontend/src/lib/bedtime/commerce.ts`
- `apps/frontend/src/app/page.tsx`

## Voice Path

The MVP uses browser speech synthesis because it is fast, local, and demo-safe.

Production voice should support:

- Transcript-first review.
- Parent voice selection.
- No impersonation of YouTube creators or daycare staff.
- Optional cloud TTS provider, such as Gemini TTS or OpenAI TTS, behind a provider contract.
- Audio export for the daily bedtime pack.

Implementation files:

- `apps/frontend/src/lib/bedtime/voice.ts`
- `apps/frontend/src/app/page.tsx`

## Stop Conditions

- Real payments are blocked until the parent explicitly approves the item, merchant, amount, shipping, and return policy.
- Real voice publishing is blocked until the parent reviews transcript and voice.
- Keys, wallet credentials, and child-specific private context never go into the public repo.

## References

- AWS AgentCore Payments preview: https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-agentcore-payments-preview/
- Stripe/OpenAI Agentic Commerce Protocol announcement: https://stripe.com/newsroom/news/stripe-openai-instant-checkout
