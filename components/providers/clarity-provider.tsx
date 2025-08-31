"use client";

import clarity from "@microsoft/clarity";
import { useEffect } from "react";

export function ClarityProvider() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      clarity.init("t3fb0zdg6k");
    }
  }, []);

  return null;
}
