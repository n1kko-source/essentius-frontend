"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteDocument,
  updateDocument,
  type LibraryDocument,
} from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import {
  Eye,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isPersistedId(id: string) {
  return Boolean(id) && !id.startsWith("local-");
}

export function DocumentDetail() {
  const documents = useAppStore((s) => s.documents);
  const activeDocument = useAppStore((s) => s.activeDocument);
  const documentFiles = useAppStore((s) => s.documentFiles);
  const renameDocument = useAppStore((s) => s.renameDocument);
  const removeDocument = useAppStore((s) => s.removeDocument);

  const selected: LibraryDocument | null = useMemo(
    () => documents.find((d) => d.title === activeDocument) ?? null,
    [documents, activeDocument]
  );

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditing(false);
    setError(null);
    setTitleDraft(selected?.title ?? "");
  }, [selected?.id, selected?.title]);

  if (!selected) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground text-sm">
        <p className="max-w-sm text-center leading-relaxed">
          Selecciona o sube un PDF. Las fuentes indexadas alimentan el chat y la
          comparación de tus notas (Fase 1: tu biblioteca).
        </p>
      </div>
    );
  }

  const localFile = documentFiles[selected.title];

  const openLocalPdf = () => {
    if (!localFile) return;
    const url = URL.createObjectURL(localFile);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const saveTitle = async () => {
    const next = titleDraft.trim();
    if (!next) {
      setError("El título no puede estar vacío.");
      return;
    }
    if (next === selected.title) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (isPersistedId(selected.id)) {
        const updated = await updateDocument(selected.id, next);
        renameDocument(selected.id, updated.title);
      } else {
        renameDocument(selected.id, next);
      }
      setEditing(false);
    } catch (e) {
      console.error(e);
      setError("No se pudo renombrar. ¿Corriste 008_documents_update_policy?");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (
      !confirm(
        `¿Eliminar «${selected.title}» de tu biblioteca? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      if (isPersistedId(selected.id)) {
        await deleteDocument(selected.id);
      }
      removeDocument(selected.id);
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el documento.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-xl space-y-8"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {editing ? (
              <Input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="font-display text-lg h-11"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(selected.title);
                    setEditing(false);
                  }
                }}
              />
            ) : (
              <h2 className="font-display text-2xl md:text-3xl tracking-tight truncate">
                {selected.title}
              </h2>
            )}
            <p className="text-sm text-muted-foreground">
              Fuente indexada · {selected.chunk_count} fragmento
              {selected.chunk_count === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <dl className="grid gap-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">Añadido</dt>
            <dd className="text-foreground">{formatDate(selected.created_at)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">Fragmentos indexados</dt>
            <dd className="text-foreground">{selected.chunk_count}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">PDF local</dt>
            <dd className="text-foreground">
              {localFile ? "Disponible en esta sesión" : "Solo catálogo"}
            </dd>
          </div>
        </dl>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button onClick={() => void saveTitle()} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Guardar nombre"
                )}
              </Button>
              <Button
                variant="ghost"
                disabled={saving}
                onClick={() => {
                  setTitleDraft(selected.title);
                  setEditing(false);
                }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                Editar nombre
              </Button>

              {localFile && (
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={openLocalPdf}
                >
                  <Eye className="h-4 w-4" />
                  Ver PDF
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </Button>
              )}

              <Button
                variant="ghost"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => void remove()}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar
              </Button>
            </>
          )}
        </div>

        {!localFile && (
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            El PDF original no se retiene en el servidor tras indexar. Puedes ver
            metadatos, renombrar o eliminar la fuente. Para abrir el archivo,
            súbelo de nuevo en esta sesión.
          </p>
        )}
      </motion.div>
    </div>
  );
}
