"use client";

import { CursorParticles } from "@/components/landing/CursorParticles";
import { FeatureDeepSections } from "@/components/landing/FeatureDeepSections";
import { LandingHeroAnimation } from "@/components/landing/LandingHeroAnimation";
import { LandingLoader } from "@/components/landing/LandingLoader";
import { MorphingHeadline } from "@/components/landing/MorphingHeadline";
import { RevealWords } from "@/components/landing/RevealWords";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LandingPage() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(() => Boolean(reduce));
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <>
      <LandingLoader onComplete={handleReady} />

      <LenisProvider enabled={ready}>
        <div
          className={`essentius-yellow-cta essentius-mesh relative min-h-screen flex flex-col transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <CursorParticles id="essentius-landing-particles" />

          <header className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
            <motion.span
              className="font-display text-xl tracking-tight text-foreground"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            >
              Essentius
            </motion.span>
            <motion.div
              className="flex gap-3"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            >
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Empezar</Link>
              </Button>
            </motion.div>
          </header>

          <main className="relative z-10 flex-1 flex flex-col">
            <section className="relative min-h-[calc(100svh-5rem)] flex flex-col justify-center px-6 pb-16 overflow-hidden">
              <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
                <div className="essentius-copy-panel space-y-7 relative z-10">
                  {ready && (
                    <>
                      <RevealWords
                        as="h1"
                        text="Essentius"
                        className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-foreground"
                        delay={0.08}
                      />

                      <MorphingHeadline />

                      <motion.p
                        className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
                        initial={
                          reduce
                            ? false
                            : { opacity: 0, y: 16, filter: "blur(8px)" }
                        }
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                      >
                        Un espacio de aprendizaje de alto nivel: pensamiento
                        propio, conexiones claras y contraste con conocimiento
                        estructurado.
                      </motion.p>

                      <motion.div
                        className="flex flex-wrap gap-3 pt-1"
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.58, ease: EASE }}
                      >
                        <Button size="lg" asChild className="gap-2">
                          <Link href="/login">
                            Empezar a aprender{" "}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>

                <motion.div
                  className="relative z-10 justify-self-center w-full max-w-md"
                  initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
                  animate={
                    ready
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.94, y: 24 }
                  }
                  transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
                >
                  <div className="essentius-hero-orbit pointer-events-none absolute inset-[-8%] rounded-full border border-primary/10" />
                  <div className="essentius-hero-orbit essentius-hero-orbit--delayed pointer-events-none absolute inset-[-16%] rounded-full border border-border/60" />
                  <LandingHeroAnimation />
                </motion.div>
              </div>

              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground/70"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                aria-hidden
              >
                <span className="text-[10px] uppercase tracking-[0.32em]">
                  Descubre
                </span>
                <span className="essentius-scroll-line block h-8 w-px bg-gradient-to-b from-primary/50 to-transparent" />
              </motion.div>
            </section>

            {ready && <FeatureDeepSections />}

            <footer className="relative z-10 border-t border-border/60 px-6 py-10">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-display text-lg text-foreground">
                  Essentius
                </span>
                <Button asChild>
                  <Link href="/login" className="gap-2">
                    Crear cuenta <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </footer>
          </main>
        </div>
      </LenisProvider>
    </>
  );
}
