import { createClient } from "@/lib/supabase/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api/v1";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
};

export interface HumanNote {
  id: string;
  title: string;
  body: string;
  topic?: string | null;
  user_id?: string | null;
  linked_note_ids?: string[];
  human_authored: boolean;
  created_at: string;
  updated_at: string;
}

export interface BiasMirrorResult {
  note_id?: string | null;
  alignment_score: number;
  coverage_score: number;
  confirmation_bias_risk: number;
  summary: string;
  supporting_evidence: EvidenceLink[];
  contradicting_signals: EvidenceLink[];
  gaps: string[];
  mode: string;
  sources?: "library" | "live" | "hybrid";
  external_evidence?: EvidenceLink[];
  citations?: Citation[];
}

export interface EvidenceLink {
  knowledge_node_id?: string | null;
  source?: string | null;
  excerpt: string;
  similarity: number;
  relation: string;
  url?: string | null;
}

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

export const askEssentius = async (
  question: string,
  documentId?: string | null
) => {
  const headers = await getAuthHeaders();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        question,
        ...(documentId ? { document_id: documentId } : {}),
      }),
    });
  } catch {
    throw new Error(
      `No se pudo conectar con el API (${API_BASE_URL}). ¿Backend en :8000?`
    );
  }
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail =
        typeof body?.detail === "string"
          ? body.detail
          : body?.detail
            ? JSON.stringify(body.detail)
            : "";
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Error en el chat (HTTP ${response.status})`);
  }
  return response.json();
};

export const uploadPDF = async (file: File) => {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/ingest/upload-pdf`, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch {
    throw new Error(
      `No se pudo conectar con el API (${API_BASE_URL}). ¿Backend en :8000 y Next reiniciado?`
    );
  }
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail =
        typeof body?.detail === "string"
          ? body.detail
          : body?.detail
            ? JSON.stringify(body.detail)
            : "";
    } catch {
      /* ignore */
    }
    throw new Error(
      detail || `Error al procesar el documento (HTTP ${response.status})`
    );
  }
  return response.json();
};

export interface LibraryDocument {
  id: string;
  title: string;
  user_id?: string | null;
  chunk_count: number;
  created_at?: string;
}

export const listDocuments = async (
  userId?: string
): Promise<LibraryDocument[]> => {
  const headers = await getAuthHeaders();
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`${API_BASE_URL}/ingest/documents${qs}`, {
    headers,
  });
  if (!response.ok) throw new Error("Error al listar documentos");
  return response.json();
};

export const updateDocument = async (
  documentId: string,
  title: string
): Promise<LibraryDocument> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/ingest/documents/${encodeURIComponent(documentId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ title }),
    }
  );
  if (!response.ok) throw new Error("Error al actualizar el documento");
  return response.json();
};

export const deleteDocument = async (
  documentId: string
): Promise<{ status: string; id: string; title?: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/ingest/documents/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
      headers,
    }
  );
  if (!response.ok) throw new Error("Error al eliminar el documento");
  return response.json();
};

export const generateRoadmap = async (file: File) => {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/graph/generate`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error("Error al generar el mapa");
  return response.json();
};

export interface SyncPayload {
  nodes: {
    id: string;
    title: string;
    description: string;
  }[];
}

export const syncRoadmapToNotion = async (roadmapData: SyncPayload) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/integration/sync-notion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(roadmapData),
  });

  if (!response.ok) {
    throw new Error("Error al sincronizar con Notion");
  }

  return response.json();
};

export const listNotes = async (userId?: string): Promise<HumanNote[]> => {
  const headers = await getAuthHeaders();
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`${API_BASE_URL}/notes${qs}`, { headers });
  if (!response.ok) throw new Error("Error al listar notas");
  return response.json();
};

export const createNote = async (payload: {
  title: string;
  body: string;
  topic?: string;
  user_id?: string;
  linked_note_ids?: string[];
}): Promise<HumanNote> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Error al crear nota");
  return response.json();
};

export const updateNote = async (
  noteId: string,
  payload: {
    title?: string;
    body?: string;
    topic?: string;
    linked_note_ids?: string[];
  }
): Promise<HumanNote> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Error al actualizar nota");
  return response.json();
};

export const deleteNote = async (noteId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Error al eliminar nota");
  return response.json();
};

export const biasMirror = async (payload: {
  note_id?: string;
  title?: string;
  body?: string;
  include_live?: boolean;
}): Promise<BiasMirrorResult> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/brain/bias-mirror`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Error en el espejo de sesgo");
  return response.json();
};

export interface ProgressState {
  user_id: string;
  xp_cycle: number;
  xp_to_next: number;
  level: number;
  prestige: number;
  lifetime_xp: number;
  unlocked_badges: string[];
  can_prestige: boolean;
  max_level: number;
  max_prestige: number;
  awarded_xp?: number;
  levels_gained?: number[];
  badges_unlocked?: string[];
  capped?: boolean;
  prestiged?: boolean;
  reason?: string;
}

export const fetchProgress = async (): Promise<ProgressState> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/progress/me`, { headers });
  if (!response.ok) throw new Error("Error al cargar progreso");
  return response.json();
};

export const awardXp = async (
  event_type:
    | "note_create"
    | "note_link"
    | "pdf_upload"
    | "chat_message"
    | "bias_mirror"
    | "world_search"
): Promise<ProgressState> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/progress/award`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ event_type }),
  });
  if (!response.ok) throw new Error("Error al otorgar XP");
  return response.json();
};

export const prestigeUp = async (): Promise<ProgressState> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/progress/prestige`, {
    method: "POST",
    headers,
  });
  if (!response.ok) throw new Error("Error al prestigiar");
  return response.json();
};
