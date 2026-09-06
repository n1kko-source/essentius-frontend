"use client";

import { SignOutDialog } from "@/components/auth/SignOutDialog";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WisdomPhrases } from "@/components/dashboard/WisdomPhrases";
import { navActive, SIDEBAR_NAV } from "@/components/dashboard/nav";
import { RankBar } from "@/components/gamification/RankBar";
import { UnlockOverlay } from "@/components/gamification/UnlockOverlay";
import { LibraryHydrator } from "@/components/library/LibraryHydrator";
import { Button } from "@/components/ui/button";
import { clearClientSession } from "@/lib/auth/clear-client-session";
import { createClient } from "@/lib/supabase/client";
import { useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";
import { Brain, LogOut, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const onboardingComplete = useThemeStore((s) => s.onboardingComplete);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (signingOut) return;
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [onboardingComplete, router, signingOut]);

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        /* httpOnly cookies: the route handler expires them */
      }
      clearClientSession();
    } finally {
      window.location.assign("/auth/sign-out");
    }
  };

  return (
    <div className="dashboard-shell flex h-dvh flex-col md:flex-row essentius-mesh text-foreground">
      <UnlockOverlay />
      <LibraryHydrator />
      <SignOutDialog
        open={signOutOpen}
        busy={signingOut}
        onCancel={() => setSignOutOpen(false)}
        onConfirm={confirmSignOut}
      />
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-sidebar/80 backdrop-blur-sm flex-col p-5 gap-2">
        <Link
          href="/dashboard"
          className="font-display text-3xl tracking-tight text-foreground px-2 py-3 flex items-center gap-2.5"
        >
          <Brain className="h-7 w-7 text-primary" strokeWidth={1.5} />
          Essentius
        </Link>

        <nav className="flex-1 space-y-1.5 mt-3" aria-label="Principal">
          {SIDEBAR_NAV.map(({ href, label, icon: Icon }) => {
            const active = navActive(pathname, href);
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

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-[var(--mobile-nav-pad)] md:pb-0">
        <header
          className={cn(
            "shrink-0 min-h-14 md:min-h-[4.25rem] border-b border-border bg-card/60 backdrop-blur-sm px-4 md:px-8 items-center justify-center gap-6 md:gap-8",
            pathname.startsWith("/dashboard/chat") ||
              pathname.startsWith("/dashboard/deep-learning/graph")
              ? "hidden md:flex"
              : "flex"
          )}
        >
          <RankBar />
          <div className="hidden md:flex min-w-0">
            <WisdomPhrases />
          </div>
        </header>
        <div data-dashboard-scroll className="flex-1 min-h-0 overflow-auto">
          {children}
        </div>
      </main>

      <MobileBottomNav onSignOut={() => setSignOutOpen(true)} />
    </div>
  );
}
