import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** PDFs medianos + embeddings free-tier pueden tardar varios minutos en local. */
export const maxDuration = 300;

const backend =
  process.env.BACKEND_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const target = `${backend}/api/v1/ingest/upload-pdf`;
  const auth = request.headers.get("authorization");

  try {
    const formData = await request.formData();
    const upstream = await fetch(target, {
      method: "POST",
      headers: auth ? { Authorization: auth } : undefined,
      body: formData,
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Proxy upload falló";
    return NextResponse.json(
      {
        detail: `No se pudo completar la subida hacia el backend (${message}). ¿uvicorn en :8000? PDFs muy largos: divide el archivo (máx. ~40 fragmentos free-tier).`,
      },
      { status: 502 }
    );
  }
}
