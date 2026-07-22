import type { NextConfig } from "next";

const backend =
  process.env.BACKEND_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1", "127.0.0.1"],
  // Browser → same origin /api/v1/* → FastAPI.
  // Upload PDF tiene route handler propio (timeout largo): app/api/v1/ingest/upload-pdf
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
        // Route Handlers en app/ tienen prioridad sobre este rewrite.
      },
    ];
  },
};

export default nextConfig;
