"use client";

import { useCallback, useEffect, useState } from "react";
import type { HapticInput, TriggerOptions } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    )
  );
}

export function useAppHaptics() {
  const { trigger, isSupported } = useWebHaptics();
  const [isEligibleDevice, setIsEligibleDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncEligibility = () => {
      setIsEligibleDevice(
        (coarsePointerQuery.matches || isStandaloneMode()) &&
          !reducedMotionQuery.matches,
      );
    };

    syncEligibility();
    coarsePointerQuery.addEventListener("change", syncEligibility);
    reducedMotionQuery.addEventListener("change", syncEligibility);

    return () => {
      coarsePointerQuery.removeEventListener("change", syncEligibility);
      reducedMotionQuery.removeEventListener("change", syncEligibility);
    };
  }, []);

  const gatedTrigger = useCallback(
    (input?: HapticInput, options?: TriggerOptions) => {
      if (!isSupported || !isEligibleDevice) return;
      return trigger(input, options);
    },
    [isEligibleDevice, isSupported, trigger],
  );

  return {
    isSupported: isSupported && isEligibleDevice,
    trigger: gatedTrigger,
  };
}
