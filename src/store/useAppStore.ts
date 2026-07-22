import { create } from "zustand";
import { Node, Edge } from "reactflow";
import type { HumanNote, LibraryDocument } from "@/services/api-client";

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

interface DocumentMeta {
  name: string;
  file?: File;
}

interface AppState {
  documents: LibraryDocument[];
  documentFiles: Record<string, File>;
  activeDocument: string | null;
  roadmaps: Record<string, RoadmapData>;
  notes: HumanNote[];
  selectedNoteId: string | null;

  addDocument: (doc: LibraryDocument, file?: File) => void;
  setDocuments: (docs: LibraryDocument[]) => void;
  renameDocument: (id: string, nextTitle: string) => void;
  removeDocument: (id: string) => void;
  clearLibrary: () => void;
  setActiveDocument: (fileName: string | null) => void;
  saveRoadmap: (fileName: string, data: RoadmapData) => void;
  setNotes: (notes: HumanNote[]) => void;
  upsertNote: (note: HumanNote) => void;
  removeNote: (noteId: string) => void;
  setSelectedNoteId: (id: string | null) => void;
}

function remapKeyedRecord<T>(
  record: Record<string, T>,
  from: string,
  to: string
): Record<string, T> {
  if (from === to || !(from in record)) return record;
  const next = { ...record };
  next[to] = next[from];
  delete next[from];
  return next;
}

export const useAppStore = create<AppState>((set) => ({
  documents: [],
  documentFiles: {},
  activeDocument: null,
  roadmaps: {},
  notes: [],
  selectedNoteId: null,

  addDocument: (doc, file) =>
    set((state) => {
      const withoutSame = state.documents.filter(
        (d) => d.id !== doc.id && d.title !== doc.title
      );
      return {
        documents: [doc, ...withoutSame],
        activeDocument: doc.title,
        documentFiles: file
          ? { ...state.documentFiles, [doc.title]: file }
          : state.documentFiles,
      };
    }),

  setDocuments: (docs) =>
    set((state) => {
      const titles = docs.map((d) => d.title);
      return {
        documents: docs,
        activeDocument:
          state.activeDocument && titles.includes(state.activeDocument)
            ? state.activeDocument
            : titles[0] ?? null,
      };
    }),

  renameDocument: (id, nextTitle) =>
    set((state) => {
      const current = state.documents.find((d) => d.id === id);
      if (!current) return state;
      const oldTitle = current.title;
      return {
        documents: state.documents.map((d) =>
          d.id === id ? { ...d, title: nextTitle } : d
        ),
        activeDocument:
          state.activeDocument === oldTitle ? nextTitle : state.activeDocument,
        documentFiles: remapKeyedRecord(
          state.documentFiles,
          oldTitle,
          nextTitle
        ),
        roadmaps: remapKeyedRecord(state.roadmaps, oldTitle, nextTitle),
      };
    }),

  removeDocument: (id) =>
    set((state) => {
      const current = state.documents.find((d) => d.id === id);
      if (!current) return state;
      const nextDocs = state.documents.filter((d) => d.id !== id);
      const { [current.title]: _removedFile, ...restFiles } =
        state.documentFiles;
      const { [current.title]: _removedRoadmap, ...restRoadmaps } =
        state.roadmaps;
      return {
        documents: nextDocs,
        documentFiles: restFiles,
        roadmaps: restRoadmaps,
        activeDocument:
          state.activeDocument === current.title
            ? nextDocs[0]?.title ?? null
            : state.activeDocument,
      };
    }),

  clearLibrary: () =>
    set({
      documents: [],
      documentFiles: {},
      activeDocument: null,
      roadmaps: {},
    }),

  setActiveDocument: (fileName) => set({ activeDocument: fileName }),

  saveRoadmap: (fileName, data) =>
    set((state) => ({
      roadmaps: {
        ...state.roadmaps,
        [fileName]: data,
      },
    })),

  setNotes: (notes) => set({ notes }),

  upsertNote: (note) =>
    set((state) => {
      const idx = state.notes.findIndex((n) => n.id === note.id);
      if (idx === -1) return { notes: [note, ...state.notes] };
      const next = [...state.notes];
      next[idx] = note;
      return { notes: next };
    }),

  removeNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
      selectedNoteId:
        state.selectedNoteId === noteId ? null : state.selectedNoteId,
    })),

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
}));

export type { DocumentMeta, RoadmapData };
