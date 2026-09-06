"use client";

import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { useThemeStore } from "@/store/useThemeStore";

const THEME_PERSIST_KEY = "essentius-visual-profile";

/** Drops in-memory + persisted client state that belongs to the previous user. */
export function clearClientSession() {
  useThemeStore.getState().resetProfile();
  void useThemeStore.persist.clearStorage();
  try {
    localStorage.removeItem(THEME_PERSIST_KEY);
  } catch {
    /* private mode / SSR */
  }
  useAppStore.getState().resetWorkspace();
  useProgressStore.getState().reset();
}
