"use client";

import { UNLOCK_LOTTIE } from "@/lib/gamification/config";
import { useProgressStore } from "@/store/useProgressStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const AUTO_DISMISS_MS = 3800;

export function UnlockOverlay() {
  const current = useProgressStore((s) => s.unlockQueue[0]);
  const shiftUnlock = useProgressStore((s) => s.shiftUnlock);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!current) return;
    const t = window.setTimeout(() => shiftUnlock(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [current, shiftUnlock]);

  return (
    <AnimatePresence>
      {current ? (
        <motion.div
          key={`${current.kind}-${current.title}`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => shiftUnlock()}
          role="dialog"
          aria-label={current.title}
        >
          <motion.div
            className="relative w-full max-w-3xl rounded-[2rem] border border-border bg-card/95 px-6 py-8 md:px-14 md:py-12 shadow-xl text-center space-y-5 md:space-y-6"
            initial={reduce ? false : { opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-[min(46vh,22rem)] w-[min(46vh,22rem)] md:h-[min(52vh,26rem)] md:w-[min(52vh,26rem)]">
              <DotLottieReact
                src={current.lottie || UNLOCK_LOTTIE.success}
                autoplay={!reduce}
                loop={!reduce}
                className="h-full w-full"
              />
            </div>
            {current.badgeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.badgeImage}
                alt=""
                className="mx-auto h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-md"
              />
            ) : null}
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium">
              {current.kind === "prestige" || current.kind === "legend"
                ? "Prestigio"
                : current.kind === "badge"
                  ? "Insignia"
                  : "Nivel"}
            </p>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight">
              {current.title}
            </h2>
            {current.subtitle ? (
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
                {current.subtitle}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
