"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "Escribe con tu mente.",
  "Conecta ideas como un grafo.",
  "Compara con tu biblioteca.",
  "Aprende con evidencia.",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic headline cycle: blur + vertical travel between phrases
 * (depth-of-field language from the reference reel, light Essentius tone).
 */
export function MorphingHeadline({
  lines = LINES,
  intervalMs = 3400,
}: {
  lines?: string[];
  intervalMs?: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || lines.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, lines.length, reduce]);

  if (reduce) {
    return (
      <h2 className="font-display text-2xl md:text-4xl leading-snug text-foreground/90 max-w-xl">
        {lines[0]}
      </h2>
    );
  }

  return (
    <div className="relative min-h-[4.5rem] md:min-h-[5.5rem] max-w-xl">
      <AnimatePresence mode="wait">
        <motion.h2
          key={lines[index]}
          className="absolute inset-x-0 top-0 font-display text-2xl md:text-4xl leading-snug text-foreground/90"
          initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -22, filter: "blur(12px)" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {lines[index]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
