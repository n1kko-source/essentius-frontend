"use client";

import { KnowledgeGraph } from "@/features/roadmap/KnowledgeGraph";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";

export default function PathPage() {
  return (
    <div className="h-full flex">
      <DocumentSidebar variant="compact" />
      <div className="flex-1 p-4 min-w-0">
        <KnowledgeGraph />
      </div>
    </div>
  );
}
