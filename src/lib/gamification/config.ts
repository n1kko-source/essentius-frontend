export type XpEventType =
  | "note_create"
  | "note_link"
  | "pdf_upload"
  | "chat_message"
  | "bias_mirror"
  | "world_search";

export const MAX_LEVEL = 20;
export const MAX_PRESTIGE = 5;

export interface BadgeDef {
  id: string;
  label: string;
  image: string;
  kind: "rank" | "prestige";
  unlockPrestige?: number;
  unlockLevel?: number;
}

export const BADGES: BadgeDef[] = [
  {
    id: "badge-01",
    label: "Primer paso",
    image: "/gamification/badge-01.png",
    kind: "rank",
    unlockLevel: 1,
  },
  {
    id: "badge-02",
    label: "Aprendiz",
    image: "/gamification/badge-02.png",
    kind: "rank",
    unlockLevel: 8,
  },
  {
    id: "rank-mid-01",
    label: "Conector",
    image: "/gamification/rank-mid-01.png",
    kind: "rank",
    unlockLevel: 12,
  },
  {
    id: "rank-mid-02",
    label: "Sintetizador",
    image: "/gamification/rank-mid-02.png",
    kind: "rank",
    unlockLevel: 16,
  },
  {
    id: "prestige-01",
    label: "Prestigio I: Primer ascenso",
    image: "/gamification/prestige-01.png",
    kind: "prestige",
    unlockPrestige: 1,
  },
  {
    id: "prestige-02",
    label: "Prestigio II: Síntesis",
    image: "/gamification/prestige-02.png",
    kind: "prestige",
    unlockPrestige: 2,
  },
  {
    id: "prestige-03",
    label: "Prestigio III: Contraste",
    image: "/gamification/prestige-03.png",
    kind: "prestige",
    unlockPrestige: 3,
  },
  {
    id: "prestige-04",
    label: "Prestigio IV: Mundo",
    image: "/gamification/prestige-04.png",
    kind: "prestige",
    unlockPrestige: 4,
  },
  {
    id: "prestige-05",
    label: "Prestigio V: Leyenda Essentius",
    image: "/gamification/prestige-05.png",
    kind: "prestige",
    unlockPrestige: 5,
  },
];

export const PRESTIGE_NAMES = [
  "Iniciado",
  "Explorador",
  "Erudito",
  "Crítico",
  "Sabio",
  "Leyenda",
] as const;

/** Lottie ceremonias de logro */
export const UNLOCK_LOTTIE = {
  level: "/gamification/unlock-level.lottie",
  badge: "/gamification/unlock-badge.lottie",
  prestige: "/gamification/unlock-prestige.lottie",
  legend: "/gamification/unlock-legend.lottie",
  success: "/gamification/unlock-success.lottie",
} as const;

export function emblemFor(prestige: number, level: number): string {
  if (prestige >= 5) return "/gamification/prestige-05.png";
  if (prestige >= 1) {
    const id = `prestige-0${Math.min(prestige, 4)}`;
    return `/gamification/${id}.png`;
  }
  if (level >= 16) return "/gamification/rank-mid-02.png";
  if (level >= 12) return "/gamification/rank-mid-01.png";
  if (level >= 8) return "/gamification/badge-02.png";
  return "/gamification/badge-01.png";
}

export function prestigeTitle(prestige: number): string {
  return PRESTIGE_NAMES[Math.min(prestige, PRESTIGE_NAMES.length - 1)] ?? "Iniciado";
}
