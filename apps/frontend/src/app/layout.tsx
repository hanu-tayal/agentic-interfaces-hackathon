import type { Metadata } from "next";

import "./globals.css";

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
      <body className="subpixel-antialiased">{children}</body>
    </html>
  );
}
