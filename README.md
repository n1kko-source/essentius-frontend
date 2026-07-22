Al mismo nivel que tu carpeta BACKEND, deberías crear la carpeta FRONTEND. 
Si quieres hacerlo de una vez con el estándar de Next.js, usa este comando en una nueva terminal

npx create-next-app@latest frontend --typescript --tailwind --eslint

(Cuando te pregunte, selecciona: App Router: Yes, Src Directory: Yes, Import Alias: @/).

#ESTRUCTURA FRONTEND

essentius-frontend/
├── src/
│   ├── app/                    # ROUTING (Next.js App Router)
│   │   ├── (auth)/             # Rutas de Login/Registro
│   │   ├── dashboard/          # Layout principal
│   │   │   ├── library/        # Gestión de archivos
│   │   │   ├── path/           # Visualización del Grafo (React Flow)
│   │   │   ├── deep-learning/  # Aprendizaje profundo (notas humanas)
│   │   │   │   └── notes/      # Editor SIN IA + panel bias-mirror
│   │   │   └── calendar/       # Vista de Notion Calendar
│   ├── components/             # UI ATÓMICA (Shadcn/UI)
│   │   ├── ui/                 # Botones, Inputs, Cards base
│   │   └── shared/             # Navbar, Sidebar, Footer
│   ├── features/               # LÓGICA POR DOMINIO (Modulares)
│   │   ├── chat/               # Componentes y hooks de la IA
│   │   ├── deep-learning/      # Notas humanas + espejo de sesgo
│   │   ├── gamification/       # Widgets de XP, Badges, Streaks
│   │   └── roadmap/            # Lógica del Grafo interactivo
│   ├── hooks/                  # Hooks globales (useAuth, useNotion)
│   ├── services/               # CLIENTES DE API (Httpx/Axios)
│   │   ├── api-client.ts       # Configuración base
│   │   └── mcp-connector.ts    # Cliente para el protocolo MCP
│   ├── store/                  # ESTADO GLOBAL (Zustand)
│   │   └── useUserStore.ts     # XP, Preferencias, Sesión
│   ├── types/                  # Definiciones de TypeScript
│   └── lib/                    # Utilidades (utils.ts, blockchain-config.ts)
├── public/                     # Assets estáticos
└── tailwind.config.ts

# Instalación shadcn Librería de UI
npx shadcn@latest init
npx shadcn@latest add button input card scroll-area avatar progress

# Instalación de ReactFlow
npm install reactflow
npx shadcn@latest add tabs

# Instalación Zustand para Estado Global de Archivos (SPA)
npm install zustand

# Instalación de Librerías Supabase (base de Datos PostgreSql Vectorial)
npm install @supabase/supabase-js @supabase/ssr

## Nota de contexto del proyecto (actualizar al avanzar)

> **Última actualización:** 2026-07-21 — revisión QA + anclaje de visión (frontend).
> App Next.js vive en `frontend/frontend/` (git root). Este README es la visión compartida.
> Backend hermano: `Essentius/backend`. Docs: `Essentius/Documentacion/`.

### Producto

Plataforma web de **aprendizaje personalizado y autónomo**. La IA no sustituye el pensamiento del usuario.

### Doble cerebro

1. **Cerebro humano:** sección Aprendizaje profundo / Notas — editor SIN autocomplete, SIN “mejorar con IA”, SIN copiloto. Solo lo que el usuario entiende.
2. **Cerebro de plataforma (backend):** fuentes + vectores + grafo + contraste de sesgo.
3. **Espejo de sesgo (bias-mirror):** después de escribir, la plataforma indica omisiones, contradicciones, sobreconfianza y lagunas vs fuentes. **No reescribe la nota.**

**Regla de oro:** en notas profundas la IA no escribe por el usuario; solo compara (bias-mirror) después de que el humano escribe.

Nota histórica: en docs Fase 1, “cerebro” = RAG vectorial. Esta visión lo **amplía** al doble cerebro (humano + plataforma).

### Estructura de repos (decisión)

**Mantener carpetas hermanas** `Essentius/backend` + `Essentius/frontend` — **no monorepo por ahora**.

- Encaja con dos ventanas Cursor y stacks distintos (Next vs FastAPI).
- El riesgo no es la carpeta, sino divergir el contrato API → se mitiga con la sección Contrato API de abajo (espejo en ambos README).
- Unificar (Turborepo / tipos compartidos) solo cuando haya CI único, más gente, o paquete `@essentius/api-types`.
- Higiene: el anidamiento `frontend/frontend` confunde; aplanar cuando haya commit limpio. No bloquea producto.

Backend local: `http://localhost:8000`. Flags: `USE_MOCK_AI`, `AUTH_REQUIRED` (ver README del backend).

### Hasta dónde vamos (estado real — MVP técnico temprano)

| Pieza | Estado | Notas |
|-------|--------|-------|
| Auth login/registro Supabase | Parcial | UI en `src/app/login`; **sin** middleware ni protección de `/dashboard` |
| Chat RAG | Cableado | `ChatInterface` → `POST /api/v1/chat/ask` (body solo `question`) |
| Subida PDF | Parcial | `uploadPDF` + sidebar; lista con seeds mock en Zustand |
| Grafo / ruta | Mock | `KnowledgeGraph` usa delay + nodos hardcodeados; **no** llama `generateRoadmap` |
| Notion sync | UI cableada | `syncRoadmapToNotion` |
| Gamificación | Cosmético | Nivel/XP/misiones hardcodeados en dashboard |
| Home `/` | Sin producto | Plantilla Create Next App |
| Deep learning / notas / sesgo | Solo visión | Estructura en este README; **cero rutas/código** |
| Personalización autónoma | Ausente | Sin modelo del aprendiz ni preferencias |

### Revisión QA (hallazgos)

**Altos**

- `/dashboard` accesible sin sesión (sin middleware).
- Grafo “generado” es fake; `generateRoadmap` existe en `api-client.ts` pero no se usa.
- Visión deep-learning desalineada con el código (deuda de verdad).
- `API_BASE_URL` hardcodeado a localhost (falta `NEXT_PUBLIC_API_URL`).
- Mucho WIP sin commit (riesgo de pérdida / historial opaco).

**Medios**

- Home no es Essentius; onboarding roto.
- Chat no envía `document_id` / contexto de documento activo.
- Store mezcla documentos seed ficticios con uploads reales.
- Sin citas/fuentes en la UI del chat.
- Sin `.env.example` (solo `.env.local`).

**Bajos**

- Gamificación inventada puede confundir demos con producto.
- Comentarios “Next.js 15” con Next 16 en package.

### Contrato API espejo (alinear con ventana Backend)

**Ya usados por el frontend**

| Método | Path | Body / notas |
|--------|------|----------------|
| POST | `/api/v1/chat/ask` | `{ question }` — pendiente: añadir `document_id` opcional |
| POST | `/api/v1/ingest/upload-pdf` | `multipart/form-data` file |
| POST | `/api/v1/graph/generate` | `multipart/form-data` file — **definido en client, no usado por UI** |
| POST | `/api/v1/integration/sync-notion` | `{ nodes: [{ id, title, description }] }` |

Auth: header `Authorization: Bearer <supabase_access_token>` cuando hay sesión.

**Pendientes de producto (doble cerebro) — implementar en ambos lados**

| Método | Path | Contrato |
|--------|------|----------|
| POST | `/api/v1/notes` | Crear nota. Contenido 100% humano. **Sin generación IA** en create. |
| GET | `/api/v1/notes` | Listar notas del usuario (filtros opcionales: `document_id`). |
| GET | `/api/v1/notes/{id}` | Obtener una nota. |
| PATCH | `/api/v1/notes/{id}` | Actualizar nota. **Sin reescritura IA**; solo texto del humano. |
| POST | `/api/v1/brain/bias-mirror` | Input: `{ note_id, document_id? }`. Output: sesgos, gaps, contradicciones, cobertura vs fuentes. **No reescribe la nota.** |

Confirmar con backend: si `/graph/generate` y `/chat/ask` ya aceptan Bearer; qué body espera el chat para documento activo.

### Backlog frontend (orden de valor)

1. ~~Anclar contexto en este README~~ (hecho 2026-07-21) + espejo al backend.
2. Proteger rutas (middleware Supabase) + home real → `/login` o `/dashboard`.
3. Wire real del grafo (`generateRoadmap`) y quitar mocks de generación.
4. Epic Aprendizaje profundo: ruta `dashboard/deep-learning/notes`, editor humano-only, CRUD notas, panel bias-mirror.
5. Personalización (preferencias, progreso real) encima del grafo + notas.
6. Gamificación al final (cuando haya señales reales: PDFs, notas, nodos completados).

### Prioridades UI (rutas objetivo)

1. `dashboard/library` — subir/listar PDFs → `POST /api/v1/ingest/upload-pdf`
2. `dashboard/path` — grafo React Flow → `POST /api/v1/graph/generate`
3. `dashboard/deep-learning/notes` — editor humano-only → CRUD `/api/v1/notes` + `POST /api/v1/brain/bias-mirror`
4. Chat RAG → `POST /api/v1/chat/ask` (secundario al aprendizaje profundo)
