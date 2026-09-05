"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  heightClass = "h-[min(60vh,28rem)]",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  heightClass?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar panel"
            className="fixed inset-0 z-[45] bg-foreground/35 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 md:hidden flex flex-col rounded-t-2xl border-t border-border bg-card shadow-[0_-16px_40px_-20px_rgba(24,24,27,0.35)] pb-[env(safe-area-inset-bottom,0px)]",
              heightClass
            )}
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border shrink-0">
              <p className="font-medium text-sm truncate">{title}</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
