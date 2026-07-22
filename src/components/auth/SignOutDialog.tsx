"use client";

import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type SignOutDialogProps = {
  open: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SignOutDialog({
  open,
  busy = false,
  onCancel,
  onConfirm,
}: SignOutDialogProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={busy ? undefined : onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
        >
          <motion.div
            className="w-full max-w-2xl rounded-[2rem] border border-border bg-card/95 px-6 py-8 md:px-12 md:py-12 shadow-xl text-center space-y-6 md:space-y-8"
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto h-[min(42vh,20rem)] w-[min(42vh,20rem)] md:h-[min(48vh,24rem)] md:w-[min(48vh,24rem)]"
              aria-hidden
            >
              <DotLottieReact
                src="/animations/close.lottie"
                autoplay={!reduce}
                loop={!reduce}
                className="h-full w-full"
              />
            </div>
            <div className="space-y-3">
              <h2
                id="signout-title"
                className="font-display text-3xl md:text-4xl tracking-tight"
              >
                ¿Cerrar sesión?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                Saldrás de Essentius y volverás a la página de inicio. Tus notas
                y progreso quedan guardados.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1 max-w-md mx-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={onCancel}
                disabled={busy}
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? "Cerrando…" : "Cerrar sesión"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
