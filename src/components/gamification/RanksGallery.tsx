"use client";

import {
  BADGES,
  MAX_LEVEL,
  MAX_PRESTIGE,
  type BadgeDef,
} from "@/lib/gamification/config";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Slide = BadgeDef & {
  kicker: string;
  blurb: string;
};

const SLIDES: Slide[] = BADGES.map((badge) => {
  if (badge.kind === "prestige") {
    return {
      ...badge,
      kicker: `Prestigio ${badge.unlockPrestige}`,
      blurb: `Ascenso permanente. Emblema ${badge.unlockPrestige} de ${MAX_PRESTIGE}.`,
    };
  }
  return {
    ...badge,
    kicker: `Nivel ${badge.unlockLevel}`,
    blurb:
      badge.unlockLevel === 1
        ? "El ciclo empieza aquí: escribe, conecta y contrasta."
        : `Se desbloquea al alcanzar el nivel ${badge.unlockLevel} de ${MAX_LEVEL}.`,
  };
});

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function getDashboardScroller(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>("[data-dashboard-scroll]");
}

function StaticBadgeGrid({ unlocked }: { unlocked: Set<string> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto px-6 pb-10">
      {SLIDES.map((slide) => {
        const on = unlocked.has(slide.id);
        return (
          <article
            key={slide.id}
            className={`rounded-3xl border p-6 md:p-8 text-center space-y-3 ${
              on
                ? "border-primary/30 bg-card"
                : "border-border bg-muted/40 opacity-60"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt=""
              className={`mx-auto h-28 w-28 md:h-36 md:w-36 object-contain ${on ? "" : "grayscale"}`}
            />
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {slide.kicker}
            </p>
            <p className="font-display text-base">{slide.label}</p>
            <p className="text-[11px] text-muted-foreground">
              {on ? "Desbloqueada" : "Bloqueada"}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function HorizontalTrack({ unlocked }: { unlocked: Set<string> }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [runwayPx, setRunwayPx] = useState(0);
  const [sidePad, setSidePad] = useState(80);
  const [stickyH, setStickyH] = useState(560);

  const applyScroll = useCallback((scrollY: number, viewport: HTMLElement) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const sectionTop =
      section.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top +
      scrollY;
    const runway = Math.max(1, section.offsetHeight - viewport.clientHeight);
    const progress = clamp((scrollY - sectionTop) / runway, 0, 1);
    const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const x = -progress * maxX;

    track.style.transform = `translate3d(${x}px, 0, 0)`;

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progress})`;
    }

    const center =
      viewport.getBoundingClientRect().left + viewport.clientWidth / 2;

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = (cardCenter - center) / viewport.clientWidth;
      const abs = Math.min(1, Math.abs(dist));
      const focus = 1 - smoothstep(abs);
      const scale = 0.88 + focus * 0.12;
      const rotateY = clamp(-dist * 18, -22, 22);
      const opacity = 0.5 + focus * 0.5;
      card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
    });
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const scroller = getDashboardScroller();
    if (!track || !scroller) return;

    const vw = scroller.clientWidth;
    const vh = scroller.clientHeight;
    setStickyH(vh);

    const first = cardRefs.current[0];
    const cardW = first?.offsetWidth ?? Math.min(380, vw * 0.7);
    const pad = Math.max(24, (vw - cardW) / 2);
    setSidePad(pad);

    requestAnimationFrame(() => {
      const t = trackRef.current;
      if (!t) return;
      const maxX = Math.max(0, t.scrollWidth - vw);
      setRunwayPx(vh + maxX);
      applyScroll(scroller.scrollTop, scroller);
    });
  }, [applyScroll]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const imgs = trackRef.current?.querySelectorAll("img") ?? [];
    const onLoad = () => measure();
    imgs.forEach((img) => img.addEventListener("load", onLoad));
    return () => imgs.forEach((img) => img.removeEventListener("load", onLoad));
  }, [measure]);

  // Drive scrub from the dashboard scroller (native or Lenis-smoothed).
  useEffect(() => {
    const scroller = getDashboardScroller();
    if (!scroller) return;

    const onScroll = () => applyScroll(scroller.scrollTop, scroller);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [applyScroll, runwayPx]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: runwayPx > 0 ? runwayPx : "240vh" }}
      aria-label="Camino de insignias"
    >
      <div
        className="sticky top-0 overflow-hidden flex flex-col justify-center"
        style={{ height: stickyH }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Camino
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight">
            Rangos, niveles y prestigios
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Desplázate para recorrer tus emblemas. El del centro es el foco.
          </p>
        </div>

        <div
          className="relative w-full flex items-center pt-24 pb-12"
          style={{ perspective: "1200px" }}
        >
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 md:gap-10 will-change-transform"
            style={{
              paddingLeft: sidePad,
              paddingRight: sidePad,
              transform: "translate3d(0,0,0)",
            }}
          >
            {SLIDES.map((slide, i) => {
              const on = unlocked.has(slide.id);
              return (
                <article
                  key={slide.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`relative shrink-0 w-[min(78vw,440px)] rounded-[1.75rem] border overflow-hidden backdrop-blur-sm shadow-[0_24px_60px_-28px_rgba(24,24,27,0.35)] ${
                    on
                      ? "border-primary/35 bg-card/90"
                      : "border-border bg-muted/50"
                  }`}
                  style={{
                    transformOrigin: "center center",
                    opacity: i === 0 ? 1 : 0.55,
                  }}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${
                      slide.kind === "prestige"
                        ? "bg-[#f5c542]"
                        : on
                          ? "bg-primary/70"
                          : "bg-zinc-400/50"
                    }`}
                    aria-hidden
                  />
                  <div className="flex flex-col items-center text-center px-8 pt-10 pb-9">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                      {slide.kicker}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt=""
                      className={`mt-6 h-40 w-40 md:h-52 md:w-52 object-contain ${
                        on ? "" : "grayscale opacity-70"
                      }`}
                    />
                    <h3 className="mt-5 font-display text-xl md:text-2xl tracking-tight">
                      {slide.label}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[15rem]">
                      {slide.blurb}
                    </p>
                    <span
                      className={`mt-5 inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                        on
                          ? slide.kind === "prestige"
                            ? "bg-[#f5c542]/25 text-stone-800"
                            : "bg-primary/15 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {on
                        ? "Desbloqueada"
                        : slide.kind === "prestige"
                          ? "Prestigio"
                          : "Rango"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[min(240px,55vw)] h-[2px] rounded-full bg-border/80 overflow-hidden"
          aria-hidden
        >
          <div
            ref={progressFillRef}
            className="h-full w-full origin-left bg-[#f5c542] scale-x-0"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Horizontal badge gallery for /dashboard/rank.
 * Scroll uses the dashboard panel; Lenis smooths that panel only while mounted.
 */
export function RanksGallery({
  unlocked,
  header,
}: {
  unlocked: Set<string>;
  header: ReactNode;
}) {
  const reduce = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const wrapper = getDashboardScroller();
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.35,
      autoRaf: true,
    });

    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(content);
    requestAnimationFrame(() => lenis.resize());

    return () => {
      ro.disconnect();
      lenis.destroy();
    };
  }, [reduce]);

  return (
    <div ref={contentRef} className="w-full pb-16">
      <div className="px-6 md:px-10 pt-8 md:pt-10 pb-4 max-w-5xl mx-auto w-full">
        {header}
      </div>

      {reduce ? (
        <div className="pt-6">
          <div className="text-center px-6 mb-8">
            <h2 className="font-display text-2xl tracking-tight">Insignias</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {MAX_LEVEL} niveles · {MAX_PRESTIGE} prestigios
            </p>
          </div>
          <StaticBadgeGrid unlocked={unlocked} />
        </div>
      ) : (
        <HorizontalTrack unlocked={unlocked} />
      )}
    </div>
  );
}
