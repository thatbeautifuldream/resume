"use client";

import { InstallStrip } from "@/components/install-strip";
import {
	useSidebarActions,
	useSidebarOpen,
	useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { MessageSquareText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useWebHaptics } from "web-haptics/react";

export function Header() {
	const isOpen = useSidebarOpen();
	const isResizing = useSidebarResizing();
	const { toggle } = useSidebarActions();
	const { trigger } = useWebHaptics();
	const isDesktop = useIsDesktop();

	const headerStyle = useMemo(
		() => ({
			marginRight: isOpen && isDesktop ? "var(--sidebar-width)" : "0",
			transition: isResizing ? "none" : "margin-right 0.3s ease-in-out",
		}),
		[isDesktop, isOpen, isResizing],
	);

	return (
		<header className="fixed inset-x-0 top-0 z-50 print:hidden pt-[env(safe-area-inset-top)]">
			<div style={headerStyle} className="print:!mr-0">
				<div className="container pt-3">
					<div className="grain-overlay rounded-[1.6rem] border border-border/80 bg-background/88 shadow-[var(--page-shadow)] supports-[backdrop-filter]:bg-background/72 supports-[backdrop-filter]:backdrop-blur-xl">
						<div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
							<div className="min-w-0">
								<Link
									href="/"
									aria-label="Homepage"
									className="inline-flex min-w-0 items-center gap-3"
								>
									<span className="flex size-9 items-center justify-center rounded-full bg-primary/12 text-primary">
										<Sparkles className="size-4" />
									</span>
									<span className="min-w-0">
										<span className="block truncate text-base font-semibold tracking-tight text-foreground sm:text-sm">
											Milind Mishra
										</span>
										<span className="block truncate font-mono text-[0.75rem] uppercase tracking-[0.22em] text-muted-foreground">
											Product engineer, design systems, AI UI
										</span>
									</span>
								</Link>
							</div>

							<div className="flex items-center gap-2">
								<div className="hidden rounded-full border border-border/70 bg-muted/70 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground lg:block">
									Bengaluru • Available worldwide
								</div>
								<Button
									type="button"
									variant={isOpen ? "secondary" : "outline"}
									size="sm"
									onClick={() => {
										void trigger("medium", { intensity: 0.75 });
										toggle();
									}}
									aria-label={isOpen ? "Close chat sidebar" : "Open chat sidebar"}
									aria-expanded={isOpen}
									className={cn(
										"rounded-full border-border/80 px-3.5 text-base sm:text-sm",
										isOpen &&
											"bg-primary text-primary-foreground hover:bg-primary/92",
									)}
								>
									<MessageSquareText className="size-4" />
									<span>{isOpen ? "Close Milo" : "Ask Milo"}</span>
								</Button>
							</div>
						</div>
						<InstallStrip />
					</div>
				</div>
			</div>
		</header>
	);
}
