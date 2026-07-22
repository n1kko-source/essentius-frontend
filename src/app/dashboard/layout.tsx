"use client";

import { SignOutDialog } from "@/components/auth/SignOutDialog";
import { WisdomPhrases } from "@/components/dashboard/WisdomPhrases";
import { RankBar } from "@/components/gamification/RankBar";
import { UnlockOverlay } from "@/components/gamification/UnlockOverlay";
import { LibraryHydrator } from "@/components/library/LibraryHydrator";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { useThemeStore } from "@/store/useThemeStore";
import {
    BookOpen,
    Brain,
    LayoutDashboard,
    LogOut,
    Map,
    MessageSquare,
    Network,
    PenLine,
    Settings2,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/library", label: "Biblioteca", icon: BookOpen },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/path", label: "Ruta PDF", icon: Map },
  { href: "/dashboard/deep-learning/notes", label: "Notas humanas", icon: PenLine },
  { href: "/dashboard/deep-learning/graph", label: "Grafo de ideas", icon: Network },
  { href: "/dashboard/rank", label: "Rango", icon: Trophy },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const onboardingComplete = useThemeStore((s) => s.onboardingComplete);
  const clearLibrary = useAppStore((s) => s.clearLibrary);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [onboardingComplete, router]);

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      clearLibrary();
      setSignOutOpen(false);
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="dashboard-shell flex h-screen essentius-mesh text-foreground">
      <UnlockOverlay />
      <LibraryHydrator />
      <SignOutDialog
        open={signOutOpen}
        busy={signingOut}
        onCancel={() => setSignOutOpen(false)}
        onConfirm={confirmSignOut}
      />
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar/80 backdrop-blur-sm flex flex-col p-5 gap-2">
        <Link
          href="/dashboard"
          className="font-display text-3xl tracking-tight text-foreground px-2 py-3 flex items-center gap-2.5"
        >
          <Brain className="h-7 w-7 text-primary" strokeWidth={1.5} />
          Essentius
        </Link>

        <nav className="flex-1 space-y-1.5 mt-3" aria-label="Principal">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[0.95rem] transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2.5 text-[0.95rem] text-muted-foreground h-11"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings2 className="h-5 w-5" /> Ajustes
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2.5 text-[0.95rem] text-muted-foreground h-11"
            onClick={() => setSignOutOpen(true)}
          >
            <LogOut className="h-5 w-5" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 min-h-[4.25rem] border-b border-border bg-card/60 backdrop-blur-sm px-5 md:px-8 flex items-center justify-center gap-6 md:gap-8">
          <RankBar />
          <WisdomPhrases />
        </header>
        <div data-dashboard-scroll className="flex-1 min-h-0 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
