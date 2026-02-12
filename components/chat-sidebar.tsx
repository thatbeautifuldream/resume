"use client";

import { ChatContent } from "@/components/chat-content";
import {
	useSidebarActions,
	useSidebarOpen,
	useSidebarResizing,
	useSidebarWidth,
} from "@/components/providers/chat-sidebar-store";
// import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useIsDesktop } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function ChatSidebar() {
	const isOpen = useSidebarOpen();
	const width = useSidebarWidth();
	const isResizing = useSidebarResizing();
	const { close, setWidth, setIsResizing } = useSidebarActions();
	const isDesktop = useIsDesktop();
	const router = useRouter();

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

	const handleBackToResume = () => {
		close();
		router.push("/");
	};

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
						className="@container fixed top-0 right-0 bottom-0 bg-background border-l z-50 flex flex-col print:hidden"
					>
						{/* Resize handle - shows highlight on hover, overlays the border */}
						{isDesktop && (
							<div
								onMouseDown={handleMouseDown}
								className="absolute left-[-8.5px] top-0 bottom-0 w-[17px] cursor-ew-resize z-[60] transition-all duration-200 hover:bg-muted-foreground/20"
							>
								<div
									className={cn(
										"absolute left-1/2 top-0 bottom-0 -translate-x-1/2 transition-all duration-200",
										isResizing ? "w-1 bg-foreground" : "w-[0.5px] bg-border",
									)}
								/>
							</div>
						)}
						{/* Back to Resume button - only visible on mobile/tablet (when sidebar is full-width) */}
						<div className="lg:hidden shrink-0 bg-background border-b">
							<div className="px-3 sm:px-4 md:px-6 lg:px-8 py-1.5">
								<div className="flex items-center">
									<button
										onClick={handleBackToResume}
										className="flex items-center gap-2 font-medium hover:underline text-sm md:text-md"
									>
										<ArrowLeft className="size-4" />
										Back to Resume
									</button>
								</div>
							</div>
						</div>
						<div className="chat-sidebar-scroll flex-1 overflow-y-auto">
							<ChatContent />
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* {process.env.NODE_ENV === "development" && <AIDevtools />} */}
		</>
	);
}
