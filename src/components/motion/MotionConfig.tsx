"use client";

import { MotionConfig as FMConfig, useReducedMotion } from "framer-motion";

/**
 * Global Framer Motion policy:
 * - Respects prefers-reduced-motion
 * - Dashboard / UI transitions stay here
 * - Lenis is marketing-only; GSAP is graph micro-animations only
 */
export function AppMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <FMConfig reducedMotion={reduce ? "always" : "user"}>{children}</FMConfig>
  );
}
