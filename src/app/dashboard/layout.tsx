import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground dark">
      {/* Sidebar de Documentos (Simulada) */}
      <aside className="w-64 bg-muted/30 border-r p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-primary">Essentius</h1>
        <div className="text-sm text-muted-foreground">Tus Fuentes</div>
        <div className="space-y-2">
          <div className="bg-muted p-2 rounded text-sm cursor-pointer hover:bg-muted/80">📜 fisica_cuantica.pdf</div>
          <div className="bg-muted p-2 rounded text-sm cursor-pointer hover:bg-muted/80">📜 notion_apuntes.txt</div>
        </div>
      </aside>

      {/* Área Central (Chat) */}
      <main className="flex-1 flex flex-col bg-background/50">
        <header className="h-16 border-b flex items-center px-6 bg-muted/20">
          <h2 className="text-lg font-semibold">Copiloto Académico</h2>
        </header>
        {children}
      </main>
    </div>
  );
}