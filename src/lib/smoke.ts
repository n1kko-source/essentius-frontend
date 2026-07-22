/**
 * Smoke checklist (manual / future Playwright):
 * 1. Landing loads light theme, Essentius brand, Lenis scroll
 * 2. Login → onboarding age recommendation → dashboard
 * 3. Create 2 notes with link → graph shows edge
 * 4. Click node → bias-mirror panel (library)
 * 5. Mundo tab → live search returns citations
 * 6. prefers-reduced-motion: no Lenis / GSAP pulse
 */
export const SMOKE_FLOW = [
  "landing",
  "login",
  "onboarding",
  "notes-crud",
  "thought-graph",
  "bias-mirror-library",
  "bias-mirror-live",
] as const;
