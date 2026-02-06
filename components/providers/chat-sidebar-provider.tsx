"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

type ChatSidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ChatSidebarContext = createContext<ChatSidebarContextType | null>(null);

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (!context) {
    throw new Error("useChatSidebar must be used within ChatSidebarProvider");
  }
  return context;
}

export function ChatSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Memoize callbacks to prevent unnecessary re-renders
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Keyboard shortcut: Cmd/Ctrl + K to toggle chat
  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    toggle();
  });

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle]
  );

  return (
    <ChatSidebarContext.Provider value={value}>
      {children}
    </ChatSidebarContext.Provider>
  );
}
