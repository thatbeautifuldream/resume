"use client";

import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import type React from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useChatSidebar();

  return (
    <div
      className="md:data-[open=true]:mr-[480px] transition-[margin] duration-300 ease-in-out"
      data-open={isOpen}
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] print:pt-0">
        {children}
      </main>
    </div>
  );
}
