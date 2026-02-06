"use client";

import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import { ChatContent } from "@/app/chat/_components/chat-content";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, motion } from "motion/react";

export function ChatSidebar() {
  const { isOpen, close } = useChatSidebar();

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

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] lg:w-[480px] bg-background border-l z-50 overflow-y-auto"
          >
            <ChatContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </>
  );
}
