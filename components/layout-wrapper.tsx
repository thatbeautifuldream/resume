"use client";

import type React from "react";
import {
  useSidebarOpen,
  useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { useIsDesktop } from "@/hooks/use-media-query";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarOpen();
  const isResizing = useSidebarResizing();
  const isDesktop = useIsDesktop();

  return (
    <div
      style={{
        marginRight: isOpen && isDesktop ? "var(--sidebar-width)" : "0",
        transition: isResizing ? "none" : "margin-right 0.3s ease-in-out",
      }}
      className="print:!mr-0"
    >
      {children}
    </div>
  );
}
