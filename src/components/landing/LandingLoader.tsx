"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "ldloader/index.css";
import { useEffect, useRef, useState } from "react";

type LandingLoaderProps = {
  onComplete: () => void;
  minDurationMs?: number;
};

/**
 * Full-screen intro gate driven by ldloader state (running class + on/off).
 * Light Essentius palette — cinematic exit, not a dark splash.
 */
export function LandingLoader({
  onComplete,
  minDurationMs = 5200,
}: LandingLoaderProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      onComplete();
      setVisible(false);
      return;
    }

    let cancelled = false;
    let progressRaf = 0;
    let ld: { on: () => Promise<void>; off: (d?: number) => Promise<void> } | null =
      null;

    const start = performance.now();

    // Ease-out so the bar spends more time near the end while assets settle.
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const tickProgress = (now: number) => {
      if (cancelled) return;
      const raw = Math.min(1, (now - start) / minDurationMs);
      setProgress(easeOutCubic(raw));
      if (raw < 1) progressRaf = requestAnimationFrame(tickProgress);
    };
    progressRaf = requestAnimationFrame(tickProgress);

    (async () => {
      const LdLoader = (await import("ldloader")).default;
      if (cancelled || !rootRef.current) return;

      ld = new LdLoader({
        root: rootRef.current,
        activeClass: "running",
        className: "ldld essentius-ldld",
        autoZ: false,
      });

      await ld.on();

      const remaining = Math.max(0, minDurationMs - (performance.now() - start));
      await new Promise((r) => setTimeout(r, remaining));
      if (cancelled) return;

      await ld.off(320);
      if (cancelled || doneRef.current) return;
      doneRef.current = true;
      setVisible(false);
      onComplete();
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(progressRaf);
      void ld?.off(0);
    };
  }, [minDurationMs, onComplete, reduce]);

  return (
    <AnimatePresence>
      {visible && !reduce && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center essentius-yellow-cta essentius-loader-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-label="Cargando Essentius"
        >
          <motion.p
            className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-10"
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            Essentius
          </motion.p>

          <div className="relative h-14 w-14">
            <div ref={rootRef} className="ldld default em-2 essentius-ldld" />
          </div>

          <div className="mt-12 h-px w-64 sm:w-80 overflow-hidden bg-border/80">
            <motion.div
              className="h-full origin-left bg-[#f5c542]"
              style={{ scaleX: progress }}
            />
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Preparando tu espacio
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
