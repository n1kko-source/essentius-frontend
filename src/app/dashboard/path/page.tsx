"use client";

import { KnowledgeGraph } from "@/features/roadmap/KnowledgeGraph";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";
import { MobileWorkspaceBar } from "@/features/library/MobileWorkspaceBar";

export default function PathPage() {
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <div className="hidden md:flex h-full min-h-0">
        <DocumentSidebar variant="compact" />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-0 md:p-4 gap-0 md:gap-2">
        <MobileWorkspaceBar />
        <div className="flex-1 min-h-0 min-w-0">
          <KnowledgeGraph />
        </div>
      </div>
    </div>
  );
}
