"use client";

import { RanksGallery } from "@/components/gamification/RanksGallery";
import { Button } from "@/components/ui/button";
import { emblemFor, prestigeTitle } from "@/lib/gamification/config";
import { useProgressStore } from "@/store/useProgressStore";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function RankPage() {
  const progress = useProgressStore((s) => s.progress);
  const refresh = useProgressStore((s) => s.refresh);
  const prestige = useProgressStore((s) => s.prestige);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const unlocked = new Set(progress?.unlocked_badges ?? []);
  const emblem = progress
    ? emblemFor(progress.prestige, progress.level)
    : "/gamification/badge-01.png";

  const onPrestige = async () => {
    setBusy(true);
    await prestige();
    setBusy(false);
  };

  const header = (
    <div className="space-y-8">
      <motion.div
        className="dashboard-section space-y-2 text-center"
      >
        <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
          <Trophy className="h-4 w-4" /> Rango Essentius
        </p>
        <h1 className="font-display text-4xl tracking-tight">
          Nivel y prestigios
        </h1>
        <p className="dashboard-prose text-muted-foreground text-base leading-relaxed mx-auto max-w-lg">
          Gana XP al escribir notas, conectar ideas, subir fuentes y contrastar
          pensamiento. Al nivel 20 puedes prestigiar: el ciclo se reinicia y
          desbloqueas un emblema permanente.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-border bg-card/80 p-6 flex flex-col gap-6 items-center text-center max-w-xl mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblem} alt="" className="h-28 w-28 object-contain" />
        <div className="space-y-3 w-full max-w-md">
          {progress ? (
            <>
              <p className="font-display text-2xl">
                {prestigeTitle(progress.prestige)}
              </p>
              <p className="text-sm text-muted-foreground">
                Prestigio {progress.prestige} · Nivel {progress.level} /{" "}
                {progress.max_level} · {progress.lifetime_xp} XP de por vida
              </p>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary/80 rounded-full"
                  style={{
                    width: `${
                      progress.can_prestige
                        ? 100
                        : Math.min(
                            100,
                            Math.round(
                              (progress.xp_cycle /
                                (progress.xp_to_next || 1)) *
                                100
                            )
                          )
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress.can_prestige
                  ? "Listo para prestigiar"
                  : `${progress.xp_cycle} / ${progress.xp_to_next} XP hasta el siguiente nivel`}
              </p>
              {progress.can_prestige ? (
                <Button onClick={onPrestige} disabled={busy}>
                  {busy
                    ? "Ascendiendo…"
                    : `Ascender a Prestigio ${progress.prestige + 1}`}
                </Button>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sincroniza tu rango al iniciar sesión. Si aún no has corrido la
              migración SQL{" "}
              <code className="text-xs">004_player_progress</code>, el progreso
              usará memoria hasta que exista la tabla.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return <RanksGallery unlocked={unlocked} header={header} />;
}
