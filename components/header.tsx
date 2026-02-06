"use client";

import Link from "next/link";
import { TimezoneClock } from "@/components/timezone-clock";
import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import { motion } from "motion/react";

export function Header() {
  const { toggle, isOpen } = useChatSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 print:hidden bg-background border-b">
      <motion.div
        animate={{
          marginRight: isOpen ? "0" : "0",
        }}
        className="md:data-[open=true]:mr-[480px] transition-[margin] duration-300 ease-in-out"
        data-open={isOpen}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
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
                className="font-medium hover:underline text-sm md:text-md"
              >
                Chat
              </button>
            </div>
            <div className="flex gap-x-3 items-center">
              <TimezoneClock />
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
