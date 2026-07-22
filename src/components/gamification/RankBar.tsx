"use client";

import {
  emblemFor,
  prestigeTitle,
} from "@/lib/gamification/config";
import { createClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/useProgressStore";
import { useThemeStore } from "@/store/useThemeStore";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function fallbackFromEmail(email?: string | null): string {
  const local = (email || "").split("@")[0] || "Explorador";
  return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function pctFromProgress(p: {
  level: number;
  max_level: number;
  xp_cycle: number;
  xp_to_next: number;
  can_prestige: boolean;
}): number {
  if (p.can_prestige || p.level >= p.max_level) return 100;
  const need = p.xp_to_next || 1;
  return Math.min(100, Math.round((p.xp_cycle / need) * 100));
}

function useTickPercent(target: number, reduce: boolean | null) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (reduce) {
      setDisplay(target);
      return;
    }
    const from = displayRef.current;
    if (from === target) return;

    let raf = 0;
    const start = performance.now();
    const dur = 420;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);

  return display;
}

export function RankBar() {
  const progress = useProgressStore((s) => s.progress);
  const refresh = useProgressStore((s) => s.refresh);
  const lastAward = useProgressStore((s) => s.lastAward);
  const clearLastAward = useProgressStore((s) => s.clearLastAward);
  const displayName = useThemeStore((s) => s.displayName);
  const [emailFallback, setEmailFallback] = useState("Explorador");
  const reduce = useReducedMotion();
  const emblemControls = useAnimationControls();
  const [floatXp, setFloatXp] = useState<number | null>(null);
  const [floatKey, setFloatKey] = useState(0);
  const hydratedRef = useRef(false);

  useEffect(() => {
    void emblemControls.set({ scale: 1 });
  }, [emblemControls]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled && user) setEmailFallback(fallbackFromEmail(user.email));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pct = progress ? pctFromProgress(progress) : 0;
  const displayPct = useTickPercent(pct, reduce);
  const label = displayName.trim() || emailFallback;

  useEffect(() => {
    if (progress) hydratedRef.current = true;
  }, [progress]);

  useEffect(() => {
    if (!lastAward || !hydratedRef.current) return;

    const award = lastAward;
    clearLastAward();

    if (reduce) return;

    setFloatKey(award.id);
    setFloatXp(award.xp);
    void emblemControls.start({
      scale: [1, 1.16, 1],
      transition: { duration: 0.4, ease: EASE, times: [0, 0.35, 1] },
    });
  }, [lastAward, clearLastAward, reduce, emblemControls]);

  useEffect(() => {
    if (floatXp == null) return;
    const t = window.setTimeout(() => setFloatXp(null), 900);
    return () => window.clearTimeout(t);
  }, [floatXp, floatKey]);

  if (!progress) {
    return (
      <Link
        href="/dashboard/rank"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        {label}
      </Link>
    );
  }

  const emblem = emblemFor(progress.prestige, progress.level);
  const levelLine = `P${progress.prestige} · Nv.${progress.level}`;

  return (
    <Link
      href="/dashboard/rank"
      className="relative flex items-center justify-center gap-3 min-w-0 shrink-0 group"
      title={`${prestigeTitle(progress.prestige)} · Nivel ${progress.level}`}
    >
      <motion.img
        src={emblem}
        alt=""
        className="h-10 w-10 object-contain shrink-0 drop-shadow-sm"
        animate={emblemControls}
        initial={false}
      />

      <div className="min-w-0 space-y-1">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-display text-base tracking-tight text-foreground truncate max-w-[9rem]">
            {label}
          </span>
          <motion.span
            key={levelLine}
            className="text-[11px] text-primary font-medium tabular-nums shrink-0"
            initial={reduce ? false : { opacity: 0.6, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {levelLine}
          </motion.span>
        </div>

        <div className="flex items-center gap-2 w-36 max-w-full">
          <div className="h-1 flex-1 rounded-full bg-foreground/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary/80 origin-left"
              initial={false}
              animate={{ scaleX: pct / 100 }}
              transition={{
                duration: reduce ? 0 : 0.45,
                ease: EASE,
              }}
              style={{ width: "100%" }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 group-hover:text-foreground transition-colors min-w-[2rem] text-right">
            {progress.can_prestige ? "MAX" : `${displayPct}%`}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {floatXp != null ? (
          <motion.span
            key={floatKey}
            className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm tabular-nums whitespace-nowrap"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            +{floatXp} XP
          </motion.span>
        ) : null}
      </AnimatePresence>
    </Link>
  );
}
