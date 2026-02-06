import { Header } from "@/components/header";
import { ClarityProvider } from "@/components/providers/clarity-provider";
import { StructuredData } from "@/components/structured-data";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ChatSidebarProvider } from "@/components/providers/chat-sidebar-provider";
import { ChatSidebar } from "@/components/chat-sidebar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { sans } from "@/lib/fonts";

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
    <html lang="en" suppressHydrationWarning className={sans.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="manifest" href="/manifest.json" />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <ChatSidebarProvider>
            <LayoutWrapper>
              <NuqsAdapter>
                {children}
                <ChatSidebar />
              </NuqsAdapter>
              <GoogleAnalytics gaId="G-G7VF0PLE22" />
              <ClarityProvider />
            </LayoutWrapper>
          </ChatSidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
