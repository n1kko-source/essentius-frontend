"use client";

import { MobilePdfPicker } from "@/features/library/MobilePdfPicker";
import { Network, Scale } from "lucide-react";
import Link from "next/link";

export function MobileWorkspaceBar() {
  return (
    <div className="md:hidden shrink-0 flex items-center gap-2 px-2 pt-2 pb-1">
      <div className="min-w-0 flex-1">
        <MobilePdfPicker />
      </div>
      <Link
        href="/dashboard/deep-learning/graph"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-medium text-foreground"
      >
        <Network className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        Grafo
      </Link>
      <Link
        href="/dashboard/deep-learning/graph"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-2 text-xs font-medium text-primary"
      >
        <Scale className="h-3.5 w-3.5" strokeWidth={1.75} />
        Contraste
      </Link>
    </div>
  );
}
