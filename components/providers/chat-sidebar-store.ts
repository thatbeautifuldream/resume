"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHotkeys } from "react-hotkeys-hook";

type SidebarState = {
  isOpen: boolean;
  width: number;
  isResizing: boolean;
};

let registeredChatHandler: ((prompt: string) => void) | null = null;

type SidebarActions = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setWidth: (width: number) => void;
  setIsResizing: (resizing: boolean) => void;
  registerChatHandler: (handler: (prompt: string) => void) => void;
  unregisterChatHandler: () => void;
  sendPromptToChat: (prompt: string) => void;
};

type SidebarStore = SidebarState & { actions: SidebarActions };

// Constants
const MIN_WIDTH = 320;
const MAX_WIDTH_RATIO = 0.5;
const DEFAULT_WIDTH = 480;

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      width: DEFAULT_WIDTH,
      isResizing: false,

      actions: {
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
        setWidth: (width: number) => {
          const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
          const maxWidth = windowWidth * MAX_WIDTH_RATIO;
          const clampedWidth = Math.max(MIN_WIDTH, Math.min(width, maxWidth));
          set({ width: clampedWidth });
        },
        setIsResizing: (resizing: boolean) => set({ isResizing: resizing }),

        registerChatHandler: (handler: (prompt: string) => void) => {
          registeredChatHandler = handler;
        },
        unregisterChatHandler: () => {
          registeredChatHandler = null;
        },

        sendPromptToChat: (prompt: string) => {
          const state = get();

          if (!state.isOpen) {
            set({ isOpen: true });
            setTimeout(() => {
              registeredChatHandler?.(prompt);
            }, 350);
          } else {
            registeredChatHandler?.(prompt);
          }
        },
      },
    }),
    {
      name: "chat-sidebar-state",
      partialize: (state) => ({
        isOpen: state.isOpen,
        width: state.width,
      }),
    }
  )
);

export function useSidebarOpen() {
  return useSidebarStore((state) => state.isOpen);
}

export function useSidebarWidth() {
  return useSidebarStore((state) => state.width);
}

export function useSidebarResizing() {
  return useSidebarStore((state) => state.isResizing);
}

export function useSidebarActions() {
  return useSidebarStore((state) => state.actions);
}

export function useSidebarKeyboardShortcuts() {
  const { toggle } = useSidebarActions();

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    toggle();
  });
}
