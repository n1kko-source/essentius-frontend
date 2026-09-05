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
          className="grid grid-cols-6 h-14"
          style={{ height: "var(--mobile-nav-h)" }}
        >
          {MOBILE_TABS.map(({ href, label, icon: Icon }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] leading-none",
                  active
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[10px] leading-none",
              moreActive ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            <Ellipsis className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
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
        <div className="p-3 space-y-1">
          {MORE_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMoreOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm",
                navActive(pathname, href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted/60"
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
