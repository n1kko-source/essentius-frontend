"use client";

import { Button } from "@/components/ui/button";
import { uploadPDF, type LibraryDocument } from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

function toLibraryDoc(
  raw: Partial<LibraryDocument> | null | undefined,
  fallbackTitle: string
): LibraryDocument {
  return {
    id: raw?.id || `local-${crypto.randomUUID()}`,
    title: raw?.title || fallbackTitle,
    user_id: raw?.user_id ?? null,
    chunk_count: raw?.chunk_count ?? 0,
    created_at: raw?.created_at ?? new Date().toISOString(),
  };
}

export function DocumentSidebar({
  variant = "page",
}: {
  variant?: "page" | "compact";
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { documents, activeDocument, addDocument, setActiveDocument } =
    useAppStore();
  const award = useProgressStore((s) => s.award);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, sube solo archivos PDF.");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadPDF(file);
      const doc = toLibraryDoc(result?.document, file.name);
      addDocument(doc, file);
      void award("pdf_upload");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Hubo un error al subir el documento.";
      alert(message);
    } finally {
      setIsUploading(false);
    }
  };

  const width = variant === "compact" ? "w-56" : "w-72";

  return (
    <aside
      className={`${width} shrink-0 h-full min-h-0 bg-card/70 border-r border-border p-4 flex flex-col gap-4`}
    >
      {variant === "page" && (
        <h1 className="font-display text-2xl tracking-tight">Biblioteca</h1>
      )}

      <div>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          className="w-full flex gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          {isUploading ? "Indexando..." : "Subir PDF"}
        </Button>
      </div>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Tus fuentes
      </div>

      <div className="space-y-1.5 min-h-0 flex-1 overflow-y-auto">
        {documents.length === 0 && (
          <p className="text-xs text-muted-foreground leading-relaxed px-1">
            Aún no hay PDFs. Sube uno para alimentar chat y comparación.
          </p>
        )}
        {documents.map((doc) => {
          const isActive = activeDocument === doc.title;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setActiveDocument(doc.title)}
              className={`w-full p-3 rounded-xl text-sm text-left transition-colors flex items-center gap-3 border ${
                isActive
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate font-medium">{doc.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
