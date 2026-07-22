"use client";

import { create } from "zustand";
import type { XpEventType } from "@/lib/gamification/config";
import {
  awardXp as apiAwardXp,
  fetchProgress,
  prestigeUp as apiPrestige,
  type ProgressState,
} from "@/services/api-client";

export type UnlockKind = "level" | "badge" | "prestige" | "legend";

export interface UnlockEvent {
  kind: UnlockKind;
  title: string;
  subtitle?: string;
  badgeImage?: string;
  lottie: string;
}

interface ProgressStore {
  progress: ProgressState | null;
  loading: boolean;
  unlockQueue: UnlockEvent[];
  /** Last XP grant for RankBar feedback (bar/tick/pulse). */
  lastAward: { xp: number; id: number } | null;
  refresh: () => Promise<void>;
  award: (event: XpEventType) => Promise<ProgressState | null>;
  prestige: () => Promise<ProgressState | null>;
  shiftUnlock: () => void;
  enqueueUnlock: (event: UnlockEvent) => void;
  clearLastAward: () => void;
}

import { BADGES, UNLOCK_LOTTIE } from "@/lib/gamification/config";

function badgeImage(id: string): string | undefined {
  return BADGES.find((b) => b.id === id)?.image;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: null,
  loading: false,
  unlockQueue: [],
  lastAward: null,

  enqueueUnlock: (event) =>
    set((s) => ({ unlockQueue: [...s.unlockQueue, event] })),

  shiftUnlock: () =>
    set((s) => ({ unlockQueue: s.unlockQueue.slice(1) })),

  clearLastAward: () => set({ lastAward: null }),

  refresh: async () => {
    set({ loading: true });
    try {
      const progress = await fetchProgress();
      set({ progress });
    } catch {
      /* sin sesión o tabla aún no creada */
    } finally {
      set({ loading: false });
    }
  },

  award: async (event) => {
    try {
      const result = await apiAwardXp(event);
      const {
        levels_gained = [],
        badges_unlocked = [],
        awarded_xp = 0,
        ...rest
      } = result;
      set({
        progress: rest,
        lastAward:
          awarded_xp > 0
            ? { xp: awarded_xp, id: Date.now() }
            : get().lastAward,
      });

      for (const lvl of levels_gained) {
        get().enqueueUnlock({
          kind: "level",
          title: `Nivel ${lvl}`,
          subtitle: awarded_xp ? `+${awarded_xp} XP` : undefined,
          lottie: UNLOCK_LOTTIE.level,
        });
      }
      for (const id of badges_unlocked) {
        get().enqueueUnlock({
          kind: "badge",
          title: BADGES.find((b) => b.id === id)?.label ?? "Insignia",
          badgeImage: badgeImage(id),
          lottie:
            id.startsWith("prestige") && id.endsWith("05")
              ? UNLOCK_LOTTIE.legend
              : UNLOCK_LOTTIE.badge,
        });
      }
      return rest;
    } catch {
      return null;
    }
  },

  prestige: async () => {
    try {
      const result = await apiPrestige();
      const { badges_unlocked = [], prestiged, ...rest } = result;
      set({ progress: rest });
      if (prestiged) {
        const isLegend = rest.prestige >= 5;
        get().enqueueUnlock({
          kind: isLegend ? "legend" : "prestige",
          title: `Prestigio ${rest.prestige}`,
          subtitle: "Ciclo reiniciado · emblema desbloqueado",
          badgeImage: badges_unlocked[0]
            ? badgeImage(badges_unlocked[0])
            : undefined,
          lottie: isLegend ? UNLOCK_LOTTIE.legend : UNLOCK_LOTTIE.prestige,
        });
      }
      return rest;
    } catch {
      return null;
    }
  },
}));
