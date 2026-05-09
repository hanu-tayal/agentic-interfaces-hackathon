import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnvConfig(path.resolve(here, "../.."));

const nextConfig: NextConfig = {
  // CopilotKit /api/copilotkit is served by our local stub route in
  // src/app/api/copilotkit/route.ts (Bedtime School Bridge does its agent
  // loop via /api/bedtime/generate). No BFF rewrite needed for this build.
};

export default nextConfig;
