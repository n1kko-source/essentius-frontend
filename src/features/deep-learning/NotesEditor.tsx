"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
  type HumanNote,
} from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function NotesEditor() {
  const { notes, setNotes, upsertNote, removeNote, selectedNoteId, setSelectedNoteId } =
    useAppStore();
  const award = useProgressStore((s) => s.award);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [linkIds, setLinkIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selected = notes.find((n) => n.id === selectedNoteId) ?? null;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const data = await listNotes(user?.id);
      setNotes(data);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las notas. ¿Backend en marcha?");
    } finally {
      setLoading(false);
    }
  }, [setNotes]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setBody(selected.body);
      setTopic(selected.topic || "");
      setLinkIds(selected.linked_note_ids || []);
    }
  }, [selected]);

  const startNew = () => {
    setSelectedNoteId(null);
    setTitle("");
    setBody("");
    setTopic("");
    setLinkIds([]);
  };

  const save = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Título y cuerpo son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let note: HumanNote;
      if (selected) {
        const prevLinks = new Set(selected.linked_note_ids || []);
        note = await updateNote(selected.id, {
          title: title.trim(),
          body: body.trim(),
          topic: topic.trim() || undefined,
          linked_note_ids: linkIds,
        });
        const added = linkIds.some((id) => !prevLinks.has(id));
        if (added) void award("note_link");
      } else {
        note = await createNote({
          title: title.trim(),
          body: body.trim(),
          topic: topic.trim() || undefined,
          user_id: user?.id,
          linked_note_ids: linkIds,
        });
        setSelectedNoteId(note.id);
        void award("note_create");
      }
      upsertNote(note);
    } catch (e) {
      console.error(e);
      setError("Error al guardar la nota.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selected) return;
    if (!confirm("¿Eliminar esta nota humana?")) return;
    try {
      await deleteNote(selected.id);
      removeNote(selected.id);
      startNew();
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar.");
    }
  };

  const toggleLink = (id: string) => {
    setLinkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      <aside className="w-64 shrink-0 border-r border-border bg-card/60 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Notas</h2>
          <Button size="sm" variant="outline" onClick={startNew}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto mt-8" />
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1">
            {notes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNoteId(n.id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-sm border transition-colors ${
                  selectedNoteId === n.id
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-transparent hover:bg-muted/60"
                }`}
              >
                <span className="font-medium line-clamp-1">{n.title}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">
                  humana · sin IA
                </span>
              </button>
            ))}
            {!notes.length && (
              <p className="text-xs text-muted-foreground px-1">
                Escribe tu primer pensamiento sin ayuda de IA.
              </p>
            )}
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 p-6 gap-4 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide">
              Editor humano
            </p>
            <h1 className="font-display text-3xl tracking-tight">
              {selected ? "Editar pensamiento" : "Nuevo pensamiento"}
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Sin autocompletado de IA. Solo tu escritura.
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            human_authored
          </span>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <Input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
          autoComplete="off"
          data-ai-disabled="true"
        />
        <Input
          placeholder="Tema (opcional)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          autoComplete="off"
        />
        <textarea
          placeholder="Escribe aquí tu comprensión, duda o síntesis… sin IA."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 min-h-[240px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          spellCheck
          autoComplete="off"
          data-form-type="other"
          data-ai-disabled="true"
        />

        {notes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Conectar con otras notas
            </p>
            <div className="flex flex-wrap gap-2">
              {notes
                .filter((n) => n.id !== selected?.id)
                .map((n) => {
                  const on = linkIds.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => toggleLink(n.id)}
                      className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                        on
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {n.title}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        <motion.div className="flex gap-2" layout>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
          </Button>
          {selected && (
            <Button variant="outline" onClick={remove}>
              <Trash2 className="h-4 w-4 mr-1" /> Eliminar
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
