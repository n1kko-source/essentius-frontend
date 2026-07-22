"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AccentPreference,
  AgeBand,
  DEFAULT_PROFILE,
  PreferredLanguage,
  VisualProfile,
  recommendAccent,
} from "@/lib/theme/profiles";

interface ThemeState extends VisualProfile {
  setAgeBand: (ageBand: AgeBand, applyRecommendation?: boolean) => void;
  setAccent: (accent: AccentPreference) => void;
  setDisplayName: (displayName: string) => void;
  setCountry: (country: string) => void;
  setPreferredLanguage: (lang: PreferredLanguage) => void;
  setBio: (bio: string) => void;
  setLearningFocus: (focus: string) => void;
  applyRecommendation: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  hydrateProfile: (profile: VisualProfile) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROFILE,

      setAgeBand: (ageBand, applyRecommendation = true) => {
        if (applyRecommendation) {
          set({
            ageBand,
            accent: recommendAccent(ageBand),
            usedRecommendation: true,
          });
        } else {
          set({ ageBand, usedRecommendation: false });
        }
      },

      setAccent: (accent) => {
        const rec = recommendAccent(get().ageBand);
        set({ accent, usedRecommendation: accent === rec });
      },

      setDisplayName: (displayName) =>
        set({ displayName: displayName.slice(0, 40) }),

      setCountry: (country) => set({ country }),

      setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),

      setBio: (bio) => set({ bio: bio.slice(0, 280) }),

      setLearningFocus: (learningFocus) =>
        set({ learningFocus: learningFocus.slice(0, 80) }),

      applyRecommendation: () => {
        const ageBand = get().ageBand;
        set({
          accent: recommendAccent(ageBand),
          usedRecommendation: true,
        });
      },

      completeOnboarding: () => set({ onboardingComplete: true }),

      resetOnboarding: () => set({ onboardingComplete: false }),

      hydrateProfile: (profile) => set({ ...DEFAULT_PROFILE, ...profile }),
    }),
    { name: "essentius-visual-profile" }
  )
);
