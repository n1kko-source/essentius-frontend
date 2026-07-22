"use client";

import { DocumentDetail } from "@/features/library/DocumentDetail";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";

export default function LibraryPage() {
  return (
    <div className="h-full flex">
      <DocumentSidebar variant="page" />
      <DocumentDetail />
    </div>
  );
}
