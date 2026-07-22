"use client";

import { BiasMirrorPanel } from "@/features/deep-learning/BiasMirrorPanel";
import ThoughtNode from "@/features/deep-learning/ThoughtNode";
import { prefersReducedMotion, pulseNode } from "@/lib/motion/gsap";
import { createClient } from "@/lib/supabase/client";
import {
  biasMirror,
  listNotes,
  type BiasMirrorResult,
  type HumanNote,
} from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { Loader2, Network } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const ReactFlow = dynamic(
  () => import("reactflow").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando grafo…
      </div>
    ),
  }
);

const nodeTypes = { thought: ThoughtNode };

const PANEL_KEY = "essentius-bias-panel-width";
const PANEL_DEFAULT = 400;
const PANEL_MIN = 280;
const PANEL_MAX = 720;

function layoutNotes(notes: HumanNote[]): { nodes: Node[]; edges: Edge[] } {
  const n = notes.length || 1;
  const nodes: Node[] = notes.map((note, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const radius = 200 + (i % 3) * 55;
    return {
      id: note.id,
      type: "thought",
      position: {
        x: 360 + Math.cos(angle) * radius,
        y: 280 + Math.sin(angle) * radius,
      },
      data: {
        title: note.title,
        preview: note.body.slice(0, 120),
      },
    };
  });

  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (const note of notes) {
    for (const target of note.linked_note_ids || []) {
      const key = [note.id, target].sort().join("::");
      if (seen.has(key)) continue;
      if (!notes.some((x) => x.id === target)) continue;
      seen.add(key);
      edges.push({
        id: key,
        source: note.id,
        target,
        animated: true,
        style: {
          stroke: "color-mix(in oklab, var(--ink) 28%, transparent)",
          strokeWidth: 1.15,
        },
      });
    }
  }

  return { nodes, edges };
}

function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: ReturnType<typeof useNodesState>[2];
  onEdgesChange: ReturnType<typeof useEdgesState>[2];
  onNodeClick: NodeMouseHandler;
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.35 }}
      minZoom={0.35}
      maxZoom={2.4}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
      nodesDraggable
      elementsSelectable
    >
      <Controls className="!bg-card !border-border !shadow-sm" />
      <Background
        color="color-mix(in oklab, var(--ink) 12%, transparent)"
        gap={28}
        size={1}
      />
    </ReactFlow>
  );
}

function ThoughtGraphInner() {
  const { notes, setNotes, selectedNoteId, setSelectedNoteId } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [mirrorLoading, setMirrorLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [result, setResult] = useState<BiasMirrorResult | null>(null);
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT);
  const dragging = useRef(false);
  const { setCenter, getZoom } = useReactFlow();

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PANEL_KEY);
      if (!raw) return;
      const n = Number(raw);
      if (Number.isFinite(n)) {
        setPanelWidth(Math.min(PANEL_MAX, Math.max(PANEL_MIN, n)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const data = await listNotes(user?.id);
        setNotes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [setNotes]);

  useEffect(() => {
    const { nodes: n, edges: e } = layoutNotes(notes);
    setNodes(
      n.map((node) => ({
        ...node,
        selected: node.id === selectedNoteId,
      }))
    );
    setEdges(e);
    // Solo relayout cuando cambian las notas; selected se sincroniza aparte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedNoteId,
      }))
    );
  }, [selectedNoteId, setNodes]);

  const runMirror = useCallback(
    async (noteId: string, includeLive = false) => {
      if (includeLive) setLiveLoading(true);
      else setMirrorLoading(true);
      try {
        const res = await biasMirror({
          note_id: noteId,
          include_live: includeLive,
        });
        setResult(res);
        const award = useProgressStore.getState().award;
        if (includeLive) void award("world_search");
        else void award("bias_mirror");
      } catch (e) {
        console.error(e);
        setResult(null);
      } finally {
        setMirrorLoading(false);
        setLiveLoading(false);
      }
    },
    []
  );

  const focusNode = useCallback(
    (node: Node) => {
      const reduce = prefersReducedMotion();
      // Tras expandir la partícula, el nodo crece: centrar con margen amplio.
      const w = 220;
      const h = 160;
      window.setTimeout(() => {
        setCenter(node.position.x + w / 2, node.position.y + h / 2, {
          zoom: Math.max(getZoom(), 1.5),
          duration: reduce ? 0 : 560,
        });
      }, reduce ? 0 : 80);
    },
    [getZoom, setCenter]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      setSelectedNoteId(node.id);
      const el = document.querySelector(
        `.react-flow__node[data-id="${node.id}"]`
      ) as HTMLElement | null;
      pulseNode(el);
      focusNode(node);
      runMirror(node.id, false);
    },
    [focusNode, runMirror, setSelectedNoteId]
  );

  const onResizeStart = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      const startX = e.clientX;
      const startW = panelWidth;

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const next = Math.min(
          PANEL_MAX,
          Math.max(PANEL_MIN, startW + (startX - ev.clientX))
        );
        setPanelWidth(next);
      };

      const onUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setPanelWidth((w) => {
          try {
            localStorage.setItem(PANEL_KEY, String(w));
          } catch {
            /* ignore */
          }
          return w;
        });
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [panelWidth]
  );

  return (
    <div className="h-full flex min-h-0">
      <div className="flex-1 relative min-w-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-8 text-center">
            <Network className="h-10 w-10 text-primary/50" strokeWidth={1.25} />
            <p className="text-sm max-w-sm leading-relaxed">
              Aún no hay notas. Escribe pensamientos en{" "}
              <strong className="text-foreground">Notas humanas</strong> y
              conéctalos para ver el grafo.
            </p>
          </div>
        ) : (
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
          />
        )}
        <div className="absolute top-4 left-4 text-xs font-medium px-3 py-1.5 bg-card/90 border border-border rounded-full text-muted-foreground">
          Grafo de pensamientos · partículas
        </div>
      </div>

      <div
        className="relative shrink-0 h-full min-h-0"
        style={{ width: panelWidth }}
      >
        <button
          type="button"
          aria-label="Redimensionar panel de comparación"
          title="Arrastra para ampliar o reducir"
          className="absolute left-0 top-0 z-20 h-full w-2 -translate-x-1/2 cursor-col-resize group"
          onMouseDown={onResizeStart}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border group-hover:w-1 group-hover:bg-primary/50 group-active:bg-primary/70 transition-all" />
        </button>
        <BiasMirrorPanel
          result={result}
          loading={mirrorLoading}
          noteTitle={selectedNote?.title}
          liveLoading={liveLoading}
          onRefreshLive={
            selectedNoteId
              ? () => runMirror(selectedNoteId, true)
              : undefined
          }
        />
      </div>
    </div>
  );
}

export function ThoughtGraph() {
  return (
    <ReactFlowProvider>
      <ThoughtGraphInner />
    </ReactFlowProvider>
  );
}
