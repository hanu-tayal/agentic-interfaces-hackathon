// Stub CopilotKit runtime endpoint. Bedtime School Bridge does its agent loop
// in /api/bedtime/generate (multi-provider router). This endpoint returns 200
// so the CopilotKit provider's discovery probe doesn't spam unhandledRejection.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
