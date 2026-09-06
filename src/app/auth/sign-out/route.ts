import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Full-document sign-out so Set-Cookie actually expires the session
 * cookies that middleware reads (the browser client cannot delete httpOnly ones).
 */
export async function GET(request: NextRequest) {
  return signOutAndRedirect(request, 302);
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request, 303);
}

async function signOutAndRedirect(request: NextRequest, status: 302 | 303) {
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl, { status });
  response.headers.set("Cache-Control", "no-store");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    await supabase.auth.signOut();
  }

  for (const cookie of request.cookies.getAll()) {
    if (!cookie.name.startsWith("sb-")) continue;
    response.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
