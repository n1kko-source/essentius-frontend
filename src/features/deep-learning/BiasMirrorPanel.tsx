"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BiasMirrorResult } from "@/services/api-client";
import { ExternalLink, Loader2, Scale } from "lucide-react";
import { motion } from "framer-motion";

function ScoreBar({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number;
  tone?: "primary" | "warn" | "growth";
}) {
  const color =
    tone === "warn"
      ? "bg-amber-500"
      : tone === "growth"
        ? "bg-emerald-500"
        : "bg-primary";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
        />
      </div>
    </div>
  );
}

export function BiasMirrorPanel({
  result,
  loading,
  noteTitle,
  onRefreshLive,
  liveLoading,
}: {
  result: BiasMirrorResult | null;
  loading: boolean;
  noteTitle?: string;
  onRefreshLive?: () => void;
  liveLoading?: boolean;
}) {
  if (loading) {
    return (
      <aside className="h-full w-full border-l border-border bg-card/80 p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Contrastando con tu biblioteca…</p>
      </aside>
    );
  }

  if (!result) {
    return (
      <aside className="h-full w-full border-l border-border bg-card/60 p-6 flex flex-col justify-center text-center text-muted-foreground gap-3">
        <Scale className="h-8 w-8 mx-auto text-primary/60" strokeWidth={1.5} />
        <p className="text-sm leading-relaxed">
          Selecciona una nota en el grafo para ver la comparación con fuentes.
        </p>
      </aside>
    );
  }

  const sources = result.sources || "library";

  return (
    <aside className="h-full w-full border-l border-border bg-card/90 backdrop-blur-sm flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border space-y-1">
        <p className="text-xs font-medium text-primary uppercase tracking-wide flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5" /> Espejo de sesgo
        </p>
        <h2 className="font-display text-lg leading-snug line-clamp-2">
          {noteTitle || "Comparación"}
        </h2>
        <p className="text-[11px] text-muted-foreground">
          {sources === "library" && "Comparado con tu biblioteca indexada"}
          {sources === "live" && "Comparado con fuentes vivas (ciencia/educación)"}
          {sources === "hybrid" && "Biblioteca + fuentes vivas del mundo"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ScoreBar label="Alineación" value={result.alignment_score} />
          <ScoreBar
            label="Cobertura"
            value={result.coverage_score}
            tone="growth"
          />
          <ScoreBar
            label="Riesgo de sesgo de confirmación"
            value={result.confirmation_bias_risk}
            tone="warn"
          />
        </motion.div>

        <p className="text-sm leading-relaxed text-foreground/90">
          {result.summary}
        </p>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Tu biblioteca</TabsTrigger>
            <TabsTrigger value="world">Mundo</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="space-y-3 mt-3">
            {result.supporting_evidence?.length > 0 && (
              <EvidenceBlock
                title="Soporta tu idea"
                items={result.supporting_evidence}
              />
            )}
            {result.contradicting_signals?.length > 0 && (
              <EvidenceBlock
                title="Señales relacionadas / tensiones"
                items={result.contradicting_signals}
              />
            )}
            {result.gaps?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Vacíos
                </p>
                <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
                  {result.gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
            {!result.supporting_evidence?.length &&
              !result.contradicting_signals?.length && (
                <p className="text-xs text-muted-foreground">
                  Sin evidencia indexada. Sube PDFs en Biblioteca.
                </p>
              )}
          </TabsContent>
          <TabsContent value="world" className="space-y-3 mt-3">
            {onRefreshLive && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={onRefreshLive}
                disabled={liveLoading}
              >
                {liveLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Buscar en ciencia / educación
              </Button>
            )}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Las fuentes externas no sustituyen revisión humana ni peer-review
              formal.
            </p>
            {(result.external_evidence?.length || 0) > 0 ? (
              <EvidenceBlock
                title="Evidencia externa"
                items={result.external_evidence!}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Aún no hay resultados vivos. Pulsa buscar (Fase 2).
              </p>
            )}
            {(result.citations?.length || 0) > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Citas
                </p>
                <ul className="space-y-2">
                  {result.citations!.map((c, i) => (
                    <li key={i}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-start gap-1"
                      >
                        <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>
                          {c.title}
                          {c.snippet ? (
                            <span className="block text-muted-foreground font-normal mt-0.5">
                              {c.snippet}
                            </span>
                          ) : null}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

function EvidenceBlock({
  title,
  items,
}: {
  title: string;
  items: {
    excerpt: string;
    similarity: number;
    source?: string | null;
    url?: string | null;
  }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs rounded-xl border border-border bg-muted/30 p-2.5 leading-relaxed"
          >
            <p>{item.excerpt}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              sim {item.similarity.toFixed(2)}
              {item.source ? ` · ${item.source}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
