"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "next-themes";
import {
  useSidebarActions,
  useSidebarOpen,
  useSidebarKeyboardShortcuts,
} from "@/components/providers/chat-sidebar-store";
import {
  useKeyboardShortcutsDialogOpen,
  useKeyboardShortcutsActions,
} from "@/components/providers/keyboard-shortcuts-store";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";

export function useGlobalKeyboardShortcuts() {
  const { close: closeSidebar } = useSidebarActions();
  const isOpen = useSidebarOpen();
  const { theme, setTheme } = useTheme();
  const { openDialog } = useKeyboardShortcutsActions();

  // Sidebar toggle (Cmd/Ctrl + K) - handled by useSidebarKeyboardShortcuts
  useSidebarKeyboardShortcuts();

  // Show keyboard shortcuts: / or ?
  useHotkeys(
    ["slash", "shift+slash"],
    (e) => {
      e.preventDefault();
      openDialog();
    },
    {
      preventDefault: true,
      enableOnFormTags: false, // Don't trigger when typing in inputs
    }
  );

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
  const isDialogOpen = useKeyboardShortcutsDialogOpen();
  const { closeDialog } = useKeyboardShortcutsActions();

  return (
    <KeyboardShortcutsDialog open={isDialogOpen} onOpenChange={closeDialog} />
  );
}
