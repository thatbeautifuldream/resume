"use client";

import type React from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="container pt-16 print:pt-0">
      {children}
    </main>
  );
}
