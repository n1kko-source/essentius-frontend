"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askEssentius } from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { BrainCircuit, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hola. Soy Essentius. Respondo con tu biblioteca indexada. ¿Qué quieres aclarar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const activeDocument = useAppStore((state) => state.activeDocument);
  const award = useProgressStore((s) => s.award);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askEssentius(userMessage, activeDocument);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: response.answer },
      ]);
      if (activeDocument) void award("chat_message");
    } catch (error) {
      console.error(error);
      const detail =
        error instanceof Error
          ? error.message
          : "No pude conectar con el backend. ¿Está corriendo en :8000?";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: detail,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-xs">
      {activeDocument && (
        <div className="shrink-0 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Contexto: <strong className="text-primary">{activeDocument}</strong>
        </div>
      )}

      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
      >
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 items-start ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar
                className={`h-9 w-9 border ${
                  msg.role === "ai" ? "border-primary/40" : "border-border"
                }`}
              >
                {msg.role === "ai" ? (
                  <BrainCircuit className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
                <AvatarFallback>
                  {msg.role === "ai" ? "AI" : "Tú"}
                </AvatarFallback>
              </Avatar>

              <div
                className={`p-3 rounded-xl max-w-[80%] text-sm whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.role === "ai" && (
                  <p className="text-primary font-semibold mb-1 text-xs">
                    Essentius
                  </p>
                )}
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <Avatar className="h-9 w-9 border border-primary/40">
                <BrainCircuit className="h-5 w-5 text-primary animate-pulse" />
              </Avatar>
              <div className="bg-muted p-3 rounded-xl text-sm text-muted-foreground animate-pulse">
                Analizando contexto...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 p-3 border-t border-border bg-muted/20 flex gap-2">
        <Input
          placeholder={
            activeDocument
              ? `Pregunta sobre ${activeDocument}...`
              : "Haz una pregunta (selecciona un PDF para más contexto)..."
          }
          className="bg-background focus-visible:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
