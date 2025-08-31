import type React from "react";
import type { Metadata } from "next";
import { ClarityProvider } from "@/components/providers/clarity-provider";
// import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Milind Mishra",
  description: "Product Engineer based in India.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://latex.vercel.app/style.css" />
      </head>
      <body>
        {children}
        {/* <GoogleAnalytics gaId="test" /> */}
        <ClarityProvider />
      </body>
    </html>
  );
}
