"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Smooth scroll for marketing/landing only.
 * Do not mount inside dashboard (React Flow + Lenis fight for scroll).
 * Children can drive scroll-linked motion via `useLenis` from `lenis/react`.
 */
export function LenisProvider({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setAllowMotion(false);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [enabled]);

  if (!enabled || !allowMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.35,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
