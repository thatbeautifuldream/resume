"use client";

import Link from "next/link";
import { TimezoneClock } from "@/components/timezone-clock";
import {
  useSidebarOpen,
  useSidebarActions,
  useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { useIsDesktop } from "@/hooks/use-media-query";

export function Header() {
  const isOpen = useSidebarOpen();
  const isResizing = useSidebarResizing();
  const { toggle } = useSidebarActions();
  const isDesktop = useIsDesktop();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 print:hidden bg-background border-b">
      <div
        style={{
          marginRight: isOpen && isDesktop ? "var(--sidebar-width)" : "0",
          transition: isResizing ? "none" : "margin-right 0.3s ease-in-out",
        }}
        className="print:!mr-0"
      >
        <div className="container py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-x-4 items-center">
              <Link
                href="/"
                className="font-medium hover:underline text-sm md:text-md"
              >
                Milind's Resume
              </Link>
              <button
                onClick={toggle}
                aria-label={`${isOpen ? "Close" : "Open"} chat sidebar`}
                aria-expanded={isOpen}
                className="font-medium hover:underline text-sm md:text-md cursor-pointer"
              >
                Chat
              </button>
            </div>
            <div className="flex gap-x-3 items-center">
              <TimezoneClock />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
