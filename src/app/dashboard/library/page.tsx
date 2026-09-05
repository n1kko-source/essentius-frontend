"use client";

import { DocumentDetail } from "@/features/library/DocumentDetail";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function LibraryPage() {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="h-full flex min-h-0">
      <DocumentSidebar
        variant="page"
        onPick={() => setShowDetail(true)}
        className={cn(
          "w-full md:w-72 border-r-0 md:border-r",
          showDetail ? "hidden md:flex" : "flex"
        )}
      />
      <div
        className={cn(
          "min-w-0 min-h-0 flex-1",
          showDetail ? "flex" : "hidden md:flex"
        )}
      >
        <DocumentDetail onBack={() => setShowDetail(false)} />
      </div>
    </div>
  );
}
