"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { profileToDataAttrs } from "@/lib/theme/profiles";
import { fetchVisualProfile } from "@/lib/theme/syncProfile";
import { useEffect } from "react";

/** Applies age/accent CSS data attributes on <html> for token theming. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const ageBand = useThemeStore((s) => s.ageBand);
  const accent = useThemeStore((s) => s.accent);
  const usedRecommendation = useThemeStore((s) => s.usedRecommendation);
  const onboardingComplete = useThemeStore((s) => s.onboardingComplete);
  const displayName = useThemeStore((s) => s.displayName);
  const country = useThemeStore((s) => s.country);
  const preferredLanguage = useThemeStore((s) => s.preferredLanguage);
  const bio = useThemeStore((s) => s.bio);
  const learningFocus = useThemeStore((s) => s.learningFocus);
  const hydrateProfile = useThemeStore((s) => s.hydrateProfile);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchVisualProfile();
      if (!cancelled && remote) hydrateProfile(remote);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrateProfile]);

  useEffect(() => {
    const root = document.documentElement;
    const attrs = profileToDataAttrs({
      ageBand,
      accent,
      usedRecommendation,
      onboardingComplete,
      displayName,
      country,
      preferredLanguage,
      bio,
      learningFocus,
    });
    Object.entries(attrs).forEach(([key, value]) => {
      root.setAttribute(key, value);
    });
    root.classList.remove("dark");
    root.classList.add("light");
  }, [
    ageBand,
    accent,
    usedRecommendation,
    onboardingComplete,
    displayName,
    country,
    preferredLanguage,
    bio,
    learningFocus,
  ]);

  return <>{children}</>;
}
