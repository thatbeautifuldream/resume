import { Header } from "@/components/header";
import { ClarityProvider } from "@/components/providers/clarity-provider";
import { StructuredData } from "@/components/structured-data";
import { ebGaramond, inter } from "@/lib/fonts";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { Suspense } from "react";

import "./globals.css";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://latex.vercel.app/style.css" />
        <StructuredData />
      </head>
      <body
        className={cn(
          ebGaramond.className,
          inter.className,
          "min-h-screen bg-background! font-serif antialiased"
        )}
      >
        <NuqsAdapter>
          <Suspense fallback={null}>
            <Header
              leftItems={[
                { key: "chat", label: "Chat", href: "/chat" },
                { key: "cal", label: "Cal", href: "/cal" },
              ]}
            />
          </Suspense>
          <div className="pt-6 print:pt-0">{children}</div>
        </NuqsAdapter>
        <GoogleAnalytics gaId="G-G7VF0PLE22" />
        <ClarityProvider />
      </body>
    </html>
  );
}
