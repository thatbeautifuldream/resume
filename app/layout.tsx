import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ClarityProvider } from "@/components/providers/clarity-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { createMetadata } from "@/lib/metadata";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { ebGaramond, inter } from "@/lib/fonts";

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
      </head>
      <body
        className={cn(
          ebGaramond.className,
          inter.className,
          "min-h-screen bg-background font-serif antialiased"
        )}
      >
        <NuqsAdapter>
          {children}
          <Suspense fallback={null}>
            <ThemeSwitcher />
          </Suspense>
        </NuqsAdapter>
        <GoogleAnalytics gaId="G-G7VF0PLE22" />
        <ClarityProvider />
      </body>
    </html>
  );
}
