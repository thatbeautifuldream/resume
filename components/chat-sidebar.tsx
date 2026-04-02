"use client";

import {
	useSidebarOpen,
	useSidebarWidth,
	useSidebarActions,
	useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { ChatContent } from "@/components/chat-content";
// import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, motion } from "motion/react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
	const isOpen = useSidebarOpen();
	const width = useSidebarWidth();
	const isResizing = useSidebarResizing();
	const { close, setWidth, setIsResizing } = useSidebarActions();
	const isDesktop = useIsDesktop();

	// Close on Escape key - only active when sidebar is open
	useHotkeys(
		"escape",
		() => {
			close();
		},
		{
			enabled: isOpen,
			enableOnFormTags: true,
		},
	);

	// Initialize CSS variable from store on mount
	useEffect(() => {
		if (isDesktop) {
			document.documentElement.style.setProperty(
				"--sidebar-width",
				`${width}px`,
			);
		} else {
			document.documentElement.style.setProperty("--sidebar-width", "0px");
		}
	}, [width, isDesktop]);

	// Handle resize drag with direct CSS variable updates (zero latency)
	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing) return;

			const windowWidth = window.innerWidth;
			const newWidth = windowWidth - e.clientX;

			// Clamp width
			const minWidth = 320;
			const maxWidth = windowWidth * 0.5;
			const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

			// Update CSS variable directly - instant update, no re-render!
			document.documentElement.style.setProperty(
				"--sidebar-width",
				`${clampedWidth}px`,
			);
		};

		const handleMouseUp = () => {
			setIsResizing(false);

			// Only persist to store after drag ends
			const finalWidth = getComputedStyle(
				document.documentElement,
			).getPropertyValue("--sidebar-width");
			const widthValue = parseInt(finalWidth);
			if (!isNaN(widthValue)) {
				setWidth(widthValue);
			}
		};

		if (isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			// Prevent text selection while dragging
			document.body.style.userSelect = "none";
			document.body.style.cursor = "ew-resize";
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		};
	}, [isResizing, setWidth, setIsResizing]);

	return (
		<>
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.aside
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						style={{
							width: isDesktop ? "var(--sidebar-width)" : "100%",
						}}
						className="@container fixed bottom-0 right-0 top-0 z-50 flex flex-col border-l border-sidebar-border bg-sidebar/96 print:hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] shadow-[-24px_0_60px_rgba(15,23,42,0.12)] supports-[backdrop-filter]:bg-sidebar/82 supports-[backdrop-filter]:backdrop-blur-2xl"
					>
						{/* Resize handle - shows highlight on hover, overlays the border */}
						{isDesktop && (
							<button
								type="button"
								aria-label="Resize chat sidebar"
								onMouseDown={handleMouseDown}
								className="absolute bottom-0 left-[-8.5px] top-0 z-[60] w-[17px] cursor-ew-resize border-0 bg-transparent p-0 transition-all duration-200 hover:bg-muted-foreground/12"
							>
								<div
									className={cn(
										"absolute bottom-4 left-1/2 top-4 -translate-x-1/2 rounded-full transition-all duration-200",
										isResizing ? "w-1 bg-primary" : "w-px bg-border",
									)}
								/>
							</button>
						)}
						<div className="flex-1 min-h-0 flex flex-col">
							<ChatContent />
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* {process.env.NODE_ENV === "development" && <AIDevtools />} */}
		</>
	);
}
