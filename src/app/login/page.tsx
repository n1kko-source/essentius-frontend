"use client";

import { CursorParticles } from "@/components/landing/CursorParticles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { fetchVisualProfile } from "@/lib/theme/syncProfile";
import { useThemeStore } from "@/store/useThemeStore";
import { Brain, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateProfile = useThemeStore((s) => s.hydrateProfile);
  const supabase = createClient();

  const handleAuth = async (action: "login" | "register") => {
    if (!email || !password) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (action === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;

      if (
        action === "register" &&
        result.data.user?.identities?.length === 0
      ) {
        setError("Este correo ya está registrado.");
        return;
      }

      const remote = await fetchVisualProfile();
      if (remote) {
        hydrateProfile(remote);
      }

      const next = searchParams.get("next");
      const done =
        remote?.onboardingComplete ??
        useThemeStore.getState().onboardingComplete;

      if (!done) {
        router.push("/onboarding");
      } else {
        router.push(next || "/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error en la autenticación.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="essentius-yellow-cta essentius-mesh relative min-h-screen flex items-center justify-center p-4">
      <CursorParticles id="essentius-login-particles" />

      <Card className="relative z-10 w-full max-w-md border-border bg-card/90 backdrop-blur-sm shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/15">
              <Brain className="w-9 h-9 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="font-display text-3xl tracking-tight">
            Essentius
          </CardTitle>
          <CardDescription>
            Entra para gestionar tu aprendizaje y comparar tus ideas
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl text-center">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="correo@universidad.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full"
              onClick={() => handleAuth("login")}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAuth("register")}
              disabled={isLoading}
            >
              Crear cuenta
            </Button>
          </div>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline"
            >
              Volver al inicio
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="essentius-mesh min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
