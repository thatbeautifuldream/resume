import { ClarityProvider } from "@/components/providers/clarity-provider";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import type React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { KeyboardShortcuts } from "@/components/providers/keyboard-shortcuts";
import { ChatSidebar } from "@/components/chat-sidebar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { QueryProvider } from "@/components/providers/query-provider";
import { sans, mono } from "@/lib/fonts";

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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${sans.variable} ${mono.variable}`}
		>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className="@container min-h-screen bg-background text-foreground antialiased">
				<QueryProvider>
					<ThemeProvider attribute="class" defaultTheme="light">
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
