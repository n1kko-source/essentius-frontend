import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, BrainCircuit, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex gap-4 p-4 overflow-hidden">
      {/* 1. SECCIÓN DE CHAT */}
      <Card className="flex-[3] flex flex-col h-full bg-background border-muted/50">
        <ScrollArea className="flex-1 p-4 space-y-4">
          {/* Mensaje de Essentius (Simulado) */}
          <div className="flex gap-3 items-start mb-6">
            <Avatar className="h-9 w-9 border border-primary/50">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm shadow-inner">
              <p className="text-primary font-semibold mb-1">Essentius</p>
              ¡Hola! Tu API Backend ya me responde con código 200. Cuando me conectes a Next.js hooks, aquí verás mis respuestas reales. Mientras tanto, ¡mira qué bien me veo!
            </div>
          </div>
        </ScrollArea>
        
        {/* Input Bar */}
        <div className="p-3 border-t bg-muted/20 flex gap-2">
          <Input placeholder="Hazme una pregunta sobre tus documentos..." className="bg-background" />
          <Button>Preguntar</Button>
        </div>
      </Card>

      {/* 2. SECCIÓN DE GAMIFICACIÓN (Visivamente Bello) */}
      <aside className="flex-1 space-y-4">
        {/* Tarjeta de Nivel */}
        <Card className="border-primary/30 bg-primary/5 shadow-lg shadow-primary/10">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary">Arquitecto del Conocimiento</h3>
              <div className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-xs">NIVEL 5</div>
            </div>
            <Progress value={60} className="h-2 bg-primary/20" />
            <p className="text-xs text-muted-foreground text-center">450 / 1000 XP para el siguiente nivel</p>
          </CardContent>
        </Card>

        {/* Misiones/Metas */}
        <Card className="bg-muted/10">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Target className="h-4 w-4 text-purple-400" /> Misiones Diarias</h4>
            <div className="text-sm bg-muted p-2 rounded flex justify-between">
              <span>Vectorizar 1 PDF</span>
              <span className="text-primary font-bold">+50 XP</span>
            </div>
            <div className="text-sm bg-muted p-2 rounded flex justify-between text-muted-foreground">
              <span className="line-through">Hacer 3 preguntas profundas</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}