"use client";

import { ChatInterface } from "@/features/chat/ChatInterface";
import { DocumentSidebar } from "@/features/library/DocumentSidebar";

export default function ChatPage() {
  return (
    <div className="flex h-full min-h-0">
      <DocumentSidebar variant="compact" />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
        <ChatInterface />
      </div>
    </div>
  );
}
