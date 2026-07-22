"use client";

import { Button } from "@/components/ui/button";
import { generateRoadmap, syncRoadmapToNotion } from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import {
  CalendarPlus,
  CheckCircle2,
  FileQuestion,
  Loader2,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode, { CustomNodeData } from "./CustomNode";

const nodeTypes = { educationalCard: CustomNode };

type ApiNode = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: CustomNodeData["status"];
  position?: { x: number; y: number };
};

type ApiEdge = {
  id?: string;
  source: string;
  target: string;
};

export function KnowledgeGraph() {
  const {
    activeDocument,
    documentFiles,
    roadmaps,
    saveRoadmap,
  } = useAppStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeDocument && roadmaps[activeDocument]) {
      setNodes(roadmaps[activeDocument].nodes);
      setEdges(roadmaps[activeDocument].edges);
      setSyncSuccess(false);
    } else {
      setNodes([]);
      setEdges([]);
      setSyncSuccess(false);
    }
  }, [activeDocument, roadmaps, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: "var(--focus)",
              strokeWidth: 2,
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleGenerateClick = async () => {
    if (!activeDocument) return;
    const file = documentFiles[activeDocument];
    if (!file) {
      setError(
        "Necesitas volver a seleccionar el PDF (subirlo de nuevo) para generar la ruta real."
      );
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateRoadmap(file);
      const apiNodes: ApiNode[] = data.nodes || [];
      const apiEdges: ApiEdge[] = data.edges || [];

      const flowNodes: Node[] = apiNodes.map((n, i) => ({
        id: String(n.id ?? i),
        type: "educationalCard",
        position: n.position || {
          x: 120 + (i % 3) * 260,
          y: 80 + Math.floor(i / 3) * 180,
        },
        data: {
          title: n.title || `Nodo ${i + 1}`,
          description: n.description || "",
          status: n.status || (i === 0 ? "current" : i < 2 ? "completed" : "locked"),
          category: n.category || `Módulo ${Math.floor(i / 2) + 1}`,
        } as CustomNodeData,
      }));

      const flowEdges: Edge[] = apiEdges.map((e, i) => ({
        id: e.id || `e-${e.source}-${e.target}-${i}`,
        source: String(e.source),
        target: String(e.target),
        animated: i === 0,
        style: { stroke: "var(--focus)", strokeWidth: 2 },
      }));

      saveRoadmap(activeDocument, { nodes: flowNodes, edges: flowEdges });
    } catch (err) {
      console.error(err);
      setError("No se pudo generar la ruta. Revisa el backend.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncNotion = async () => {
    if (!activeDocument || !roadmaps[activeDocument]) return;

    setIsSyncing(true);
    try {
      const currentRoadmap = roadmaps[activeDocument];
      const payload = {
        nodes: currentRoadmap.nodes.map((n) => ({
          id: n.id,
          title: (n.data as CustomNodeData).title,
          description: (n.data as CustomNodeData).description,
        })),
      };
      await syncRoadmapToNotion(payload);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al sincronizar con Notion.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!activeDocument) {
    return (
      <div className="w-full h-full min-h-[500px] border border-border rounded-2xl bg-card/60 flex flex-col items-center justify-center text-muted-foreground">
        <FileQuestion className="h-12 w-12 mb-4 opacity-50" />
        <p>Selecciona un documento para ver su ruta de aprendizaje.</p>
      </div>
    );
  }

  const hasRoadmap = roadmaps[activeDocument] !== undefined;

  return (
    <div className="relative w-full h-full min-h-[500px] border border-border rounded-2xl overflow-hidden bg-card/40">
      {!hasRoadmap && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-3 px-6 text-center">
          <p className="text-muted-foreground text-sm">
            No hay ruta generada para{" "}
            <strong className="text-primary">{activeDocument}</strong>
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            {isGenerating
              ? "Analizando con IA..."
              : "Generar ruta de aprendizaje"}
          </Button>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1.5 bg-card/90 backdrop-blur-md rounded-full border border-border shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        {activeDocument}
      </div>

      {hasRoadmap && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          {syncSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Agendado
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncNotion}
            disabled={isSyncing || syncSuccess}
          >
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="mr-2 h-4 w-4" />
            )}
            {isSyncing ? "Sincronizando..." : "Enviar a Notion"}
          </Button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Controls className="!bg-card !border-border" />
        <Background
          color="color-mix(in oklab, var(--focus) 20%, transparent)"
          gap={20}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}
