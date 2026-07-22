"use client";

import {
  PHRASE_KIND_LABEL,
  WISDOM_PHRASES,
  type WisdomPhrase,
} from "@/lib/wisdom/phrases";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const ROTATE_MS = 9000;
const WORD_STAGGER = 0.02;

function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function PhraseText({
  phrase,
  reduce,
}: {
  phrase: WisdomPhrase;
  reduce: boolean | null;
}) {
  const words = useMemo(() => phrase.text.split(/\s+/), [phrase.text]);

  if (reduce) {
    return (
      <p className="font-display text-base md:text-lg leading-snug text-foreground/90 italic text-center">
        “{phrase.text}”
      </p>
    );
  }

  return (
    <p
      className="font-display text-base md:text-lg leading-snug text-foreground/90 italic text-center"
      aria-label={phrase.text}
    >
      <span aria-hidden>“</span>
      {words.map((word, i) => (
        <motion.span
          key={`${phrase.id}-${i}-${word}`}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: WORD_STAGGER * i,
            duration: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
      <span aria-hidden>”</span>
    </p>
  );
}

export function WisdomPhrases() {
  const reduce = useReducedMotion();
  // Deterministic order for SSR + first client paint; shuffle after mount.
  const [order, setOrder] = useState(() =>
    Array.from({ length: WISDOM_PHRASES.length }, (_, i) => i)
  );
  const [cursor, setCursor] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setOrder(shuffleIndices(WISDOM_PHRASES.length));
  }, []);

  const index = order[cursor % order.length] ?? 0;
  const phrase = WISDOM_PHRASES[index]!;

  const go = useCallback(
    (delta: number) => {
      setCursor((c) => {
        const next = (c + delta) % order.length;
        return next < 0 ? order.length - 1 : next;
      });
    },
    [order.length]
  );

  useEffect(() => {
    if (paused || hovering || reduce) return;
    const id = window.setInterval(() => go(1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, hovering, reduce, go]);

  return (
    <div
      className="min-w-0 max-w-2xl flex items-center justify-center gap-3 select-none"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Siguiente frase. Usa las flechas o haz clic para cambiar."
        className="min-w-0 flex-1 cursor-pointer rounded-lg px-2 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={() => go(1)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={phrase.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="min-w-0"
          >
            <div className="flex items-baseline justify-center gap-2 min-w-0 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.16em] text-primary/80 font-medium shrink-0">
                {PHRASE_KIND_LABEL[phrase.kind]}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                — {phrase.source}
              </span>
            </div>
            <PhraseText phrase={phrase} reduce={reduce} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="Frase anterior"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label={paused ? "Reanudar rotación" : "Pausar rotación"}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setPaused((p) => !p);
          }}
        >
          {paused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          aria-label="Siguiente frase"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
