"use client";

import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import { ChatContent } from "@/app/chat/_components/chat-content";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ChatSidebar() {
  const { isOpen, close } = useChatSidebar();
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

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="@container fixed top-0 right-0 bottom-0 w-full md:w-[400px] lg:w-[480px] bg-background border-l z-50 flex flex-col print:hidden"
          >
            {/* Back to Resume button - only visible on mobile (when sidebar is full-width) */}
            <div className="md:hidden shrink-0 bg-background border-b">
              <div className="px-4 sm:px-6 lg:px-8 py-1.5">
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
            <div className="flex-1 overflow-y-auto">
              <ChatContent />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </>
  );
}
