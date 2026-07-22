import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  return { url, anonKey, ok: Boolean(url && anonKey) };
}

export function createClient() {
  const { url, anonKey, ok } = getSupabaseBrowserConfig();
  if (!ok) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel. Añádelas (Production), guarda y haz Redeploy."
    );
  }
  return createBrowserClient(url, anonKey);
}
