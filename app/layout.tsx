import { ClarityProvider } from "@/components/providers/clarity-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#171717" },
	],
};

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
			<head />
			<body className="@container isolate min-h-dvh bg-background text-foreground antialiased">
				<Script id="theme-sync" strategy="beforeInteractive">
					{`(function(){try{var t=localStorage.getItem('theme');var d=t==='dark';var h=document.documentElement;h.classList.toggle('dark',d);h.style.colorScheme=d?'dark':'light';h.style.backgroundColor=d?'#171717':'#ffffff'}catch(e){}})();`}
				</Script>
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
