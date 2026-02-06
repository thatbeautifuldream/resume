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
            className="@container fixed top-0 right-0 bottom-0 w-full md:w-[400px] lg:w-[480px] bg-background border-l z-50 overflow-y-auto"
          >
            {/* Back to Resume button - only visible on mobile (when sidebar is full-width) */}
            <div className="md:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToResume}
                className="m-2"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Resume
              </Button>
            </div>
            <ChatContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </>
  );
}
