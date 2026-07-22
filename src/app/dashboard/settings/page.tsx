"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ACCENT_OPTIONS,
    AccentPreference,
    AGE_RECOMMENDATIONS,
    AgeBand,
    COUNTRY_OPTIONS,
    LANGUAGE_OPTIONS,
    LEARNING_FOCUS_SUGGESTIONS,
    PreferredLanguage,
} from "@/lib/theme/profiles";
import { upsertVisualProfile } from "@/lib/theme/syncProfile";
import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";
import { Check, Palette, Save, UserRound } from "lucide-react";
import { useState } from "react";

const AGE_BANDS: AgeBand[] = ["12-17", "18-25", "26-40", "40+"];

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const ageBand = useThemeStore((s) => s.ageBand);
  const accent = useThemeStore((s) => s.accent);
  const displayName = useThemeStore((s) => s.displayName);
  const country = useThemeStore((s) => s.country);
  const preferredLanguage = useThemeStore((s) => s.preferredLanguage);
  const bio = useThemeStore((s) => s.bio);
  const learningFocus = useThemeStore((s) => s.learningFocus);
  const usedRecommendation = useThemeStore((s) => s.usedRecommendation);

  const setAgeBand = useThemeStore((s) => s.setAgeBand);
  const setAccent = useThemeStore((s) => s.setAccent);
  const setDisplayName = useThemeStore((s) => s.setDisplayName);
  const setCountry = useThemeStore((s) => s.setCountry);
  const setPreferredLanguage = useThemeStore((s) => s.setPreferredLanguage);
  const setBio = useThemeStore((s) => s.setBio);
  const setLearningFocus = useThemeStore((s) => s.setLearningFocus);
  const applyRecommendation = useThemeStore((s) => s.applyRecommendation);

  const rec = AGE_RECOMMENDATIONS[ageBand];

  const save = async () => {
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    setNameError(null);
    setSaving(true);
    setMessage(null);
    const state = useThemeStore.getState();
    const result = await upsertVisualProfile({
      ageBand: state.ageBand,
      accent: state.accent,
      usedRecommendation: state.usedRecommendation,
      onboardingComplete: true,
      displayName: trimmed,
      country: state.country,
      preferredLanguage: state.preferredLanguage,
      bio: state.bio,
      learningFocus: state.learningFocus,
    });
    setSaving(false);
    setMessage(
      result.ok
        ? "Preferencias guardadas."
        : result.error || "No se pudo guardar. ¿Sesión activa?"
    );
  };

  return (
    <div className="dashboard-page p-8 md:p-10 max-w-3xl space-y-10">
      <motion.div
        className="dashboard-section space-y-2"
      >
        <h1 className="font-display text-4xl tracking-tight">Ajustes</h1>
        <p className="dashboard-prose text-muted-foreground text-base leading-relaxed">
          Tu identidad, preferencias de aprendizaje y estilo visual en un solo
          lugar.
        </p>
      </motion.div>

      {/* Identidad */}
      <section className="dashboard-form space-y-5">
        <div className="flex items-center justify-center gap-2 text-primary">
          <UserRound className="h-4 w-4" />
          <h2 className="font-display text-xl">Identidad</h2>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="settings-name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (nameError) setNameError(null);
            }}
            maxLength={40}
            placeholder="Cómo quieres que te llamemos"
            className="h-11 rounded-xl bg-background"
          />
          {nameError && (
            <p className="text-xs text-destructive">{nameError}</p>
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
            Usamos el rango para recomendar tipografía y densidad — no para
            etiquetar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="settings-country" className="text-sm font-medium">
              País
            </label>
            <select
              id="settings-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Selecciona…</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Idioma preferido</label>
            <div className="flex gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() =>
                    setPreferredLanguage(lang.id as PreferredLanguage)
                  }
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    preferredLanguage === lang.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-focus" className="text-sm font-medium">
            Foco de aprendizaje
          </label>
          <Input
            id="settings-focus"
            value={learningFocus}
            onChange={(e) => setLearningFocus(e.target.value)}
            list="focus-suggestions"
            placeholder="Ej. Tecnología, Humanidades…"
            maxLength={80}
            className="h-11 rounded-xl bg-background"
          />
          <datalist id="focus-suggestions">
            {LEARNING_FOCUS_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-bio" className="text-sm font-medium">
            Sobre ti
          </label>
          <textarea
            id="settings-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="Qué estás aprendiendo o por qué usas Essentius…"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-y min-h-[88px]"
          />
          <p className="text-[11px] text-muted-foreground text-right">
            {bio.length}/280
          </p>
        </div>
      </section>

      {/* Estilo */}
      <section className="dashboard-form space-y-5 border-t border-border pt-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Palette className="h-4 w-4" />
            <h2 className="font-display text-xl">Estilo visual</h2>
          </div>
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
        <p className="text-xs text-muted-foreground">
          Recomendación actual: <strong>{rec.label}</strong> — {rec.description}
        </p>
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
                {accent === opt.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{opt.hint}</span>
            </button>
          ))}
        </div>
        <div
          className="h-14 rounded-xl border border-border essentius-mesh flex items-center justify-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          Vista previa del tema
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 pt-2">
        <Button
          size="lg"
          className="gap-2"
          onClick={save}
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
