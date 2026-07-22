import { createClient } from "@/lib/supabase/client";
import {
  AccentPreference,
  AgeBand,
  PreferredLanguage,
  VisualProfile,
} from "@/lib/theme/profiles";

const AGE_BANDS: readonly AgeBand[] = ["12-17", "18-25", "26-40", "40+"];
const ACCENTS: readonly AccentPreference[] = [
  "neutral",
  "warm",
  "cool",
  "high-contrast",
];
const LANGS: readonly PreferredLanguage[] = ["es", "en"];

function isAgeBand(v: unknown): v is AgeBand {
  return typeof v === "string" && (AGE_BANDS as readonly string[]).includes(v);
}

function isAccent(v: unknown): v is AccentPreference {
  return typeof v === "string" && (ACCENTS as readonly string[]).includes(v);
}

function isLang(v: unknown): v is PreferredLanguage {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Load visual profile for the current auth user. null = no session or no row. */
export async function fetchVisualProfile(): Promise<VisualProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "age_band, accent, used_recommendation, onboarding_complete, display_name, country, preferred_language, bio, learning_focus"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  if (!isAgeBand(data.age_band) || !isAccent(data.accent)) return null;

  return {
    ageBand: data.age_band,
    accent: data.accent,
    usedRecommendation: Boolean(data.used_recommendation),
    onboardingComplete: Boolean(data.onboarding_complete),
    displayName: str(data.display_name, 40),
    country: str(data.country, 8),
    preferredLanguage: isLang(data.preferred_language)
      ? data.preferred_language
      : "es",
    bio: str(data.bio, 280),
    learningFocus: str(data.learning_focus, 80),
  };
}

/** Upsert visual profile for the current auth user. Soft-fails if no session. */
export async function upsertVisualProfile(
  profile: VisualProfile
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "no-session" };

  const displayName = profile.displayName.trim().slice(0, 40);

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      age_band: profile.ageBand,
      accent: profile.accent,
      used_recommendation: profile.usedRecommendation,
      onboarding_complete: profile.onboardingComplete,
      display_name: displayName || null,
      country: profile.country.trim().slice(0, 8) || null,
      preferred_language: profile.preferredLanguage || "es",
      bio: profile.bio.trim().slice(0, 280) || null,
      learning_focus: profile.learningFocus.trim().slice(0, 80) || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) return { ok: false, error: error.message };

  if (displayName) {
    await supabase.auth.updateUser({
      data: { display_name: displayName, full_name: displayName },
    });
  }

  return { ok: true };
}
