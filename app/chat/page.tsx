"use client";

import { AIDevtools } from "@ai-sdk-tools/devtools";
import { Suspense } from "react";
import { ChatContent } from "./_components/chat-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </Suspense>
  );
}
