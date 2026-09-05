"use client";

import { MobilePdfPicker } from "@/features/library/MobilePdfPicker";
import { Network, Scale } from "lucide-react";
import Link from "next/link";

export function MobileWorkspaceBar() {
  return (
    <div className="md:hidden shrink-0 flex flex-col gap-2 px-3 pt-3 pb-2">
      <MobilePdfPicker />
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/dashboard/deep-learning/graph"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-[15px] font-medium text-foreground"
        >
          <Network className="h-5 w-5 text-primary" strokeWidth={2} />
          Grafo
        </Link>
        <Link
          href="/dashboard/deep-learning/graph"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 text-[15px] font-medium text-primary"
        >
          <Scale className="h-5 w-5" strokeWidth={2} />
          Contraste
        </Link>
      </div>
    </div>
  );
}
