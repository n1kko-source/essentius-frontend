"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";
import { useAppStore } from "@/store/useAppStore";
import { FileText } from "lucide-react";
import { useState } from "react";

export function MobilePdfPicker() {
  const [open, setOpen] = useState(false);
  const activeDocument = useAppStore((s) => s.activeDocument);

  return (
    <div className="md:hidden shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 text-left text-sm"
      >
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate text-muted-foreground">
          {activeDocument ? (
            <>
              PDF: <strong className="text-foreground font-medium">{activeDocument}</strong>
            </>
          ) : (
            "Elegir PDF"
          )}
        </span>
      </button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Tus fuentes"
        heightClass="h-[min(70vh,32rem)]"
      >
        <DocumentSidebar
          variant="compact"
          className="w-full border-0 h-full"
          onPick={() => setOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}
