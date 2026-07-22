"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ACCENT_OPTIONS,
  AGE_RECOMMENDATIONS,
  AgeBand,
  AccentPreference,
} from "@/lib/theme/profiles";
import { upsertVisualProfile } from "@/lib/theme/syncProfile";
import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AGE_BANDS: AgeBand[] = ["12-17", "18-25", "26-40", "40+"];

export default function OnboardingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const ageBand = useThemeStore((s) => s.ageBand);
  const accent = useThemeStore((s) => s.accent);
  const displayName = useThemeStore((s) => s.displayName);
  const usedRecommendation = useThemeStore((s) => s.usedRecommendation);
  const setAgeBand = useThemeStore((s) => s.setAgeBand);
  const setAccent = useThemeStore((s) => s.setAccent);
  const setDisplayName = useThemeStore((s) => s.setDisplayName);
  const applyRecommendation = useThemeStore((s) => s.applyRecommendation);
  const completeOnboarding = useThemeStore((s) => s.completeOnboarding);

  const rec = AGE_RECOMMENDATIONS[ageBand];

  const finish = async () => {
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setNameError("Elige un nombre de al menos 2 caracteres.");
      return;
    }
    setNameError(null);
    setSaving(true);
    completeOnboarding();
    const profile = {
      ageBand: useThemeStore.getState().ageBand,
      accent: useThemeStore.getState().accent,
      usedRecommendation: useThemeStore.getState().usedRecommendation,
      displayName: trimmed,
      onboardingComplete: true,
      country: useThemeStore.getState().country,
      preferredLanguage: useThemeStore.getState().preferredLanguage,
      bio: useThemeStore.getState().bio,
      learningFocus: useThemeStore.getState().learningFocus,
    };
    await upsertVisualProfile(profile);
    setSaving(false);
    router.push("/dashboard");
  };

  return (
    <div className="essentius-mesh min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-xl space-y-8 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="space-y-2">
          <p className="text-sm text-primary font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Perfil visual
          </p>
          <h1 className="font-display text-3xl tracking-tight">
            Cómo quieres aprender
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Elige cómo te llamamos en Essentius y una paleta según tu edad.
            Puedes cambiar el acento cuando quieras. No etiquetamos por género.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="display-name" className="text-sm font-medium">
            Tu nombre
          </label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Ej. Nico, María, Alex…"
            maxLength={40}
            autoComplete="nickname"
            className="h-11 rounded-xl bg-background"
          />
          {nameError ? (
            <p className="text-xs text-destructive">{nameError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Aparecerá junto a tu nivel e insignia en el dashboard.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Rango de edad</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AGE_BANDS.map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setAgeBand(band, true)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  ageBand === band
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {band}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendación: <strong>{rec.label}</strong>. {rec.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Acento de color</label>
            {!usedRecommendation && (
              <button
                type="button"
                onClick={applyRecommendation}
                className="text-xs text-primary hover:underline"
              >
                Usar recomendación por edad
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccent(opt.id as AccentPreference)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  accent === opt.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {accent === opt.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground">{opt.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="h-16 rounded-xl border border-border essentius-mesh flex items-center justify-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          {displayName.trim()
            ? `Hola, ${displayName.trim()}`
            : "Vista previa del tema activo"}
        </div>

        <Button className="w-full" size="lg" onClick={finish} disabled={saving}>
          {saving ? "Guardando…" : "Continuar al dashboard"}
        </Button>
      </motion.div>
    </div>
  );
}
