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
        className="w-full flex min-h-12 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-left text-[15px]"
      >
        <FileText className="h-5 w-5 shrink-0 text-primary" />
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
