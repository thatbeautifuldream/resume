"use client";

import type React from "react";
import {
  useSidebarOpen,
  useSidebarResizing,
} from "@/components/providers/chat-sidebar-store";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useMemo } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarOpen();
  const isResizing = useSidebarResizing();
  const isDesktop = useIsDesktop();

  const wrapperStyle = useMemo(
    () => ({
      marginRight: isOpen && isDesktop ? "var(--sidebar-width)" : "0",
      transition: isResizing ? "none" : "margin-right 0.3s ease-in-out",
    }),
    [isOpen, isDesktop, isResizing],
  );

  return (
    <div style={wrapperStyle} className="print:!mr-0">
      {children}
    </div>
  );
}
