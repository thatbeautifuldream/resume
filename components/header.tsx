"use client";

import { InstallStrip } from "@/components/install-strip";
import {
	useSidebarActions,
	useSidebarOpen,
	useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { useAppHaptics } from "@/hooks/use-app-haptics";
import { useIsDesktop } from "@/hooks/use-media-query";
import Link from "next/link";
import { useMemo } from "react";

export function Header() {
	const isOpen = useSidebarOpen();
	const isResizing = useSidebarResizing();
	const { toggle } = useSidebarActions();
	const { trigger } = useAppHaptics();
	const isDesktop = useIsDesktop();

	const headerStyle = useMemo(
		() => ({
			marginRight: isOpen && isDesktop ? "var(--sidebar-width)" : "0",
			transition: isResizing ? "none" : "margin-right 0.3s ease-in-out",
		}),
		[isOpen, isDesktop, isResizing],
	);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 print:hidden bg-background border-b pt-[env(safe-area-inset-top)]">
			<div style={headerStyle} className="print:!mr-0">
				<div className="container py-3">
					<div className="flex justify-between items-center">
						<div className="flex gap-x-4 items-center">
							<Link
								href="/"
								className="font-medium hover:underline text-sm md:text-md"
							>
								Milind's Resume
							</Link>
						</div>
						<div className="flex gap-x-3 items-center">
							<Link
								href="/api/plain"
								className="font-medium hover:underline text-sm md:text-md"
								target="_blank"
								rel="noreferrer"
							>
								ATS TXT
							</Link>
							{/* <button
                type="button"
                onClick={openDialog}
                aria-label="Show keyboard shortcuts"
                className="hidden md:flex items-center gap-1.5 hover:opacity-70 transition-opacity group cursor-pointer font-mono text-xs"
                title="Keyboard shortcuts"
              >
                <span className="text-muted-foreground hidden lg:inline">
                  Press
                </span>
                <Kbd className="group-hover:bg-muted/80 transition-colors">/</Kbd>
                <span className="text-muted-foreground hidden lg:inline">
                  for shortcuts
                </span>
              </button>
              <TimezoneClock /> */}
							{!isOpen && (
								<button
									type="button"
									onClick={() => {
										void trigger("medium", { intensity: 0.75 });
										toggle();
									}}
									aria-label="Open chat sidebar"
									aria-expanded={false}
									className="font-medium hover:underline text-sm md:text-md cursor-pointer"
								>
									Chat
								</button>
							)}
						</div>
					</div>
				</div>
				<InstallStrip />
			</div>
		</header>
	);
}
