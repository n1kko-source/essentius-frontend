"use client";

import gsap from "gsap";

/** Shared GSAP helpers for graph micro-animations. Skip if reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function pulseNode(el: HTMLElement | null, color = "var(--focus)") {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { scale: 1, boxShadow: "0 0 0 0 color-mix(in oklab, var(--accent) 0%, transparent)" },
    {
      scale: 1.04,
      boxShadow: `0 0 0 6px color-mix(in oklab, ${color} 25%, transparent)`,
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    }
  );
}

export function revealLines(els: Element[], delay = 0) {
  if (prefersReducedMotion() || !els.length) return;
  gsap.fromTo(
    els,
    { opacity: 0, strokeDashoffset: 40 },
    { opacity: 1, strokeDashoffset: 0, duration: 0.6, stagger: 0.04, delay, ease: "power2.out" }
  );
}

export { gsap };
