"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MORE_LINKS, MOBILE_TABS, navActive } from "@/components/dashboard/nav";
import { cn } from "@/lib/utils";
import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function MobileBottomNav({
  onSignOut,
}: {
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_LINKS.some((item) => navActive(pathname, item.href));

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-card/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Navegación"
      >
        <div
          className="grid grid-cols-6 px-1"
          style={{ height: "var(--mobile-nav-h)" }}
        >
          {MOBILE_TABS.map(({ href, label, icon: Icon }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl mx-0.5 my-1.5 text-[12px] font-medium leading-tight",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl mx-0.5 my-1.5 text-[12px] font-medium leading-tight",
              moreActive
                ? "text-primary bg-primary/10"
                : "text-foreground/80"
            )}
          >
            <Ellipsis className="h-6 w-6" strokeWidth={2} />
            Más
          </button>
        </div>
      </nav>

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Más"
        heightClass="h-auto max-h-[70vh]"
      >
        <div className="p-4 space-y-1.5">
          {MORE_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMoreOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base",
                navActive(pathname, href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base text-muted-foreground hover:bg-muted/60"
          >
            <LogOut className="h-6 w-6 shrink-0" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
