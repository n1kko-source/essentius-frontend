export type AgeBand = "12-17" | "18-25" | "26-40" | "40+";
export type AccentPreference = "neutral" | "warm" | "cool" | "high-contrast";
export type PreferredLanguage = "es" | "en";

export interface VisualProfile {
  ageBand: AgeBand;
  accent: AccentPreference;
  /** True when user accepted the age-based recommendation without override */
  usedRecommendation: boolean;
  onboardingComplete: boolean;
  /** Nombre elegido por el usuario (RankBar / perfil) */
  displayName: string;
  country: string;
  preferredLanguage: PreferredLanguage;
  bio: string;
  learningFocus: string;
}

export const DEFAULT_PROFILE: VisualProfile = {
  ageBand: "18-25",
  accent: "cool",
  usedRecommendation: true,
  onboardingComplete: false,
  displayName: "",
  country: "",
  preferredLanguage: "es",
  bio: "",
  learningFocus: "",
};

/** Age-based palette recommendations (user can override accent). */
export const AGE_RECOMMENDATIONS: Record<
  AgeBand,
  {
    accent: AccentPreference;
    label: string;
    description: string;
    density: "comfortable" | "compact" | "balanced";
    typeScale: "lg" | "md" | "xl";
  }
> = {
  "12-17": {
    accent: "warm",
    label: "Energía y claridad",
    description: "Contraste alto, acento cálido (ámbar/coral), tipografía grande.",
    density: "comfortable",
    typeScale: "xl",
  },
  "18-25": {
    accent: "cool",
    label: "Foco profundo",
    description: "Azul-teal con acento coral; layout cómodo para sesiones largas.",
    density: "balanced",
    typeScale: "lg",
  },
  "26-40": {
    accent: "neutral",
    label: "Equilibrio",
    description: "Verde-azul suave, menos saturación, ritmo visual calmado.",
    density: "comfortable",
    typeScale: "lg",
  },
  "40+": {
    accent: "high-contrast",
    label: "Legibilidad máxima",
    description: "Contraste máximo, tipografía mayor, acentos índigo/teal sobrios.",
    density: "comfortable",
    typeScale: "xl",
  },
};

export const ACCENT_OPTIONS: {
  id: AccentPreference;
  label: string;
  hint: string;
}[] = [
  { id: "neutral", label: "Neutro", hint: "Verde-azul equilibrado" },
  { id: "warm", label: "Cálido", hint: "Ámbar / coral suave" },
  { id: "cool", label: "Frío", hint: "Teal / azul foco" },
  { id: "high-contrast", label: "Alto contraste", hint: "Índigo sobrio, máximo contraste" },
];

export const LANGUAGE_OPTIONS: {
  id: PreferredLanguage;
  label: string;
}[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

/** Países habituales para Essentius (LatAm + ES + otros). */
export const COUNTRY_OPTIONS: { code: string; label: string }[] = [
  { code: "CO", label: "Colombia" },
  { code: "MX", label: "México" },
  { code: "AR", label: "Argentina" },
  { code: "CL", label: "Chile" },
  { code: "PE", label: "Perú" },
  { code: "EC", label: "Ecuador" },
  { code: "VE", label: "Venezuela" },
  { code: "BO", label: "Bolivia" },
  { code: "UY", label: "Uruguay" },
  { code: "PY", label: "Paraguay" },
  { code: "CR", label: "Costa Rica" },
  { code: "PA", label: "Panamá" },
  { code: "GT", label: "Guatemala" },
  { code: "ES", label: "España" },
  { code: "US", label: "Estados Unidos" },
  { code: "OTHER", label: "Otro" },
];

export const LEARNING_FOCUS_SUGGESTIONS = [
  "Ciencias",
  "Humanidades",
  "Tecnología",
  "Idiomas",
  "Negocios",
  "Arte y diseño",
  "Otro",
] as const;

export function recommendAccent(ageBand: AgeBand): AccentPreference {
  return AGE_RECOMMENDATIONS[ageBand].accent;
}

export function profileToDataAttrs(profile: VisualProfile): Record<string, string> {
  return {
    "data-age": profile.ageBand,
    "data-accent": profile.accent,
    "data-density": AGE_RECOMMENDATIONS[profile.ageBand].density,
    "data-type": AGE_RECOMMENDATIONS[profile.ageBand].typeScale,
  };
}
