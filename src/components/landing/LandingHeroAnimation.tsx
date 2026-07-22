"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useReducedMotion } from "framer-motion";

const SRC = "/animations/student.lottie";

/**
 * Hero illustration for the marketing landing.
 * Respects prefers-reduced-motion: shows a static first frame (no loop/autoplay).
 */
export function LandingHeroAnimation() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[1080/950] max-w-md mx-auto w-full" aria-hidden>
      <DotLottieReact
        src={SRC}
        loop={!reduce}
        autoplay={!reduce}
        className="h-full w-full"
      />
    </div>
  );
}
