import type { Metadata } from "next";

import { CopilotKitProviderShell } from "@/components/copilot/CopilotKitProviderShell";
import "./globals.css";
// v2 owns its own stylesheet. Do NOT import @copilotkit/react-ui/styles.css —
// v1's .copilotKitButton / .copilotKitSidebar / .copilotKitWindow rules
// collide with v2's same-name selectors (different DOM, different positioning)
// and break the sidebar layout when both are loaded.
import "@copilotkit/react-core/v2/styles.css";

export const metadata: Metadata = {
  title: "Bedtime School Bridge",
  description:
    "A generated bedtime learning interface from daycare context and home interests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="subpixel-antialiased">
        <CopilotKitProviderShell>{children}</CopilotKitProviderShell>
      </body>
    </html>
  );
}
