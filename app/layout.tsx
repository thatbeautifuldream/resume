import { ClarityProvider } from "@/components/providers/clarity-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import type React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { KeyboardShortcuts } from "@/components/providers/keyboard-shortcuts";
import { ChatSidebar } from "@/components/chat-sidebar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { QueryProvider } from "@/components/providers/query-provider";
import { inter, newsreader } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "Milind Mishra",
  description: "Product Engineer based in India.",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
      <head />
      <body className="@container min-h-screen bg-background text-foreground antialiased">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <ServiceWorkerProvider />
            <KeyboardShortcuts />
            <LayoutWrapper>
              {children}
              <ChatSidebar />
              <GoogleAnalytics gaId="G-G7VF0PLE22" />
              <ClarityProvider />
            </LayoutWrapper>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
