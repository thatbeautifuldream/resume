"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "next-themes";
import {
  useSidebarActions,
  useSidebarOpen,
  useSidebarKeyboardShortcuts,
} from "@/components/providers/chat-sidebar-store";

// Registry for callbacks
let registeredJsonToggleHandler: (() => void) | null = null;

export function registerJsonToggleHandler(handler: () => void) {
  registeredJsonToggleHandler = handler;
}

export function unregisterJsonToggleHandler() {
  registeredJsonToggleHandler = null;
}

export function useGlobalKeyboardShortcuts() {
  const { close: closeSidebar } = useSidebarActions();
  const isOpen = useSidebarOpen();
  const { theme, setTheme } = useTheme();

  // Sidebar toggle (Cmd/Ctrl + K) - handled by useSidebarKeyboardShortcuts
  useSidebarKeyboardShortcuts();

  // Print: P
  useHotkeys(
    "p",
    () => {
      if (isOpen) {
        closeSidebar();
        // Wait for sidebar animation to complete before printing
        setTimeout(() => window.print(), 350);
      } else {
        window.print();
      }
    },
    { preventDefault: true }
  );

  // Toggle JSON view: J
  useHotkeys(
    "j",
    () => {
      registeredJsonToggleHandler?.();
    },
    { preventDefault: true }
  );

  // Toggle theme: T
  useHotkeys(
    "t",
    () => {
      setTheme(theme === "dark" ? "light" : "dark");
    },
    { preventDefault: true }
  );
}

export function KeyboardShortcuts() {
  useGlobalKeyboardShortcuts();
  return null;
}
