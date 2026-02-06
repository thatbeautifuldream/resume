"use client";

import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useChatSidebar();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <motion.div
      animate={{
        marginRight: isOpen && isDesktop ? "480px" : "0",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] print:pt-0">
        {children}
      </main>
    </motion.div>
  );
}
