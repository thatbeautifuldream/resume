"use client";

import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { open } = useChatSidebar();
  const router = useRouter();

  useEffect(() => {
    open();
    router.replace("/");
  }, [open, router]);

  return null;
}
