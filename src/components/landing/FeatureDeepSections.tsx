"use client";

import { RevealWords } from "@/components/landing/RevealWords";
import { motion, useReducedMotion } from "framer-motion";
import { Link2, PenLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function FadeBlock({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function NotesVisual() {
  const reduce = useReducedMotion();
  const notes = [
    { t: "Hipótesis propia", d: "Sin sugerencias de IA", x: "8%", y: "12%", delay: 0 },
    { t: "Evidencia leída", d: "Marcada como humana", x: "48%", y: "28%", delay: 0.12 },
    { t: "Duda abierta", d: "Para contrastar después", x: "22%", y: "58%", delay: 0.22 },
  ];

  return (
    <div className="relative aspect-[5/4] w-full max-w-lg mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-zinc-100/50 via-transparent to-zinc-200/30" />
      {notes.map((n) => (
        <motion.div
          key={n.t}
          className="essentius-soft-card absolute w-[42%] rounded-2xl border px-4 py-3 shadow-[0_12px_40px_-18px_rgba(24,24,27,0.28)] backdrop-blur-sm"
          style={{ left: n.x, top: n.y }}
          initial={reduce ? false : { opacity: 0, y: 24, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: n.delay, ease: EASE }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{
              duration: 4.2 + n.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: n.delay,
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-primary">
              <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Nota humana
              </span>
            </div>
            <p className="font-display text-sm text-foreground leading-snug">{n.t}</p>
            <p className="mt-1 text-xs text-muted-foreground">{n.d}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function GraphVisual() {
  const reduce = useReducedMotion();
  const nodes = [
    { id: "A", cx: 80, cy: 90, label: "Concepto" },
    { id: "B", cx: 220, cy: 70, label: "Ejemplo" },
    { id: "C", cx: 160, cy: 180, label: "Pregunta" },
    { id: "D", cx: 300, cy: 160, label: "Conclusión" },
    { id: "E", cx: 70, cy: 210, label: "Fuente" },
  ];
  const edges: [string, string][] = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "D"],
    ["A", "E"],
    ["C", "E"],
  ];
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative aspect-[5/4] w-full max-w-lg mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-bl from-zinc-100/45 via-transparent to-zinc-200/35" />
      <svg viewBox="0 0 360 280" className="h-full w-full">
        {edges.map(([a, b], i) => {
          const x1 = map[a].cx;
          const y1 = map[a].cy;
          const x2 = map[b].cx;
          const y2 = map[b].cy;
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#71717a"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray={len}
              initial={reduce ? false : { strokeDashoffset: len, opacity: 0 }}
              whileInView={{ strokeDashoffset: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.55, delay: 0.35 + i * 0.08, ease: EASE }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          >
            <circle
              cx={n.cx}
              cy={n.cy}
              r="22"
              fill="#ffffff"
              stroke="#a1a1aa"
              strokeWidth="1.5"
            />
            <circle cx={n.cx} cy={n.cy} r="4" fill="#f5c542" />
            <text
              x={n.cx}
              y={n.cy + 38}
              textAnchor="middle"
              className="fill-slate-600"
              style={{ fontSize: 11 }}
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute left-[42%] top-[38%] h-3 w-3 rounded-full bg-[#f5c542] shadow-[0_0_20px_rgba(245,197,66,0.55)]"
          animate={{
            x: [0, 48, -20, 0],
            y: [0, -30, 40, 0],
            opacity: [0.4, 1, 0.7, 0.4],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function CompareVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-[5/4] w-full max-w-lg mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-zinc-100/50 via-transparent to-zinc-100/45" />
      <div className="relative z-10 grid h-full grid-cols-2 gap-3 p-6 md:p-8">
        <motion.div
          className="essentius-soft-card flex flex-col justify-between rounded-2xl border p-4 shadow-sm"
          initial={reduce ? false : { opacity: 0, x: -24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: false }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Tu nota
            </p>
            <p className="mt-3 font-display text-lg leading-snug text-foreground">
              “Creo que X ocurre porque…”
            </p>
          </div>
          <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">
            <Sparkles className="h-3 w-3" /> Pensamiento humano
          </span>
        </motion.div>

        <motion.div
          className="essentius-soft-card relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-sm"
          initial={reduce ? false : { opacity: 0, x: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: false }}
          transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
        >
          <span
            className="absolute inset-y-0 left-0 w-[3px] bg-[#f5c542]"
            aria-hidden
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
              Biblioteca
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Fragmentos indexados, citas y contexto que respaldan o matizan tu
              idea.
            </p>
          </div>
          <span className="mt-4 inline-flex w-fit items-center gap-1 text-[11px] text-stone-500">
            <Link2 className="h-3 w-3" /> Evidencia estructurada
          </span>
        </motion.div>
      </div>

      <motion.div
        className="essentius-soft-card absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground shadow-md"
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
      >
        Contrastar
      </motion.div>
    </div>
  );
}

const SECTIONS = [
  {
    index: "01",
    title: "Notas humanas",
    kicker: "Escribir sin intermediarios",
    lead: "Tu pensamiento, sin reescribirlo la máquina.",
    body: [
      "En Essentius las notas se escriben con tu propia voz. No hay autocompletado que “mejore” tu frase ni un asistente que reemplace el esfuerzo de formular una idea.",
      "Cada nota queda marcada como humana: así puedes distinguir lo que pensaste tú de lo que más adelante contrastarás con fuentes. Ese límite es deliberado: aprender de verdad empieza cuando sostienes tu hipótesis.",
      "Úsalas para dudas, intuiciones, resúmenes de lectura o preguntas abiertas. El objetivo no es producir texto bonito: es dejar rastros claros de cómo razonas.",
    ],
    bullets: [
      "Escritura libre, sin IA en el editor",
      "Origen humano visible en el flujo de aprendizaje",
      "Base para conectar y comparar después",
    ],
    Visual: NotesVisual,
    flip: false,
  },
  {
    index: "02",
    title: "Grafo de ideas",
    kicker: "Ver cómo se relacionan tus pensamientos",
    lead: "De lista suelta a red de significado.",
    body: [
      "Cuando enlazas notas, Essentius las muestra como un grafo, al estilo Obsidian: nodos, aristas y una vista espacial de tu conocimiento.",
      "Así dejas de depender solo de carpetas o fechas. Ves clusters, puentes entre temas y huecos donde aún no has conectado ideas. Explorar el grafo es otra forma de estudiar: seguir el hilo de tu propio pensamiento.",
      "Seleccionar un nodo abre el detalle de esa nota y prepara el siguiente paso: contrastarla con lo que ya tienes en tu biblioteca.",
    ],
    bullets: [
      "Enlaces entre notas como en un segundo cerebro",
      "Vista espacial para descubrir relaciones",
      "Navegación centrada en ideas, no en archivos",
    ],
    Visual: GraphVisual,
    flip: true,
  },
  {
    index: "03",
    title: "Comparación",
    kicker: "Contrastar tu mente con evidencia",
    lead: "Tu idea frente a lo que ya indexaste.",
    body: [
      "Al elegir una nota en el grafo, Essentius la compara con tu biblioteca: documentos y fragmentos que subiste y quedaron indexados.",
      "No se trata de “ganar” un debate con la IA. Se trata de ver coincidencias, matices y posibles sesgos: un espejo entre lo que crees y lo que tus fuentes sostienen.",
      "Más adelante, el mismo flujo podrá ampliarse a evidencia externa (fuentes vivas). En el MVP el foco es claro: primero tu biblioteca, con trazabilidad y contexto.",
    ],
    bullets: [
      "Panel de contraste al seleccionar un nodo",
      "Biblioteca indexada como fuente primaria",
      "Camino preparado hacia evidencia del mundo",
    ],
    Visual: CompareVisual,
    flip: false,
  },
] as const;

export function FeatureDeepSections() {
  return (
    <div className="relative z-10">
      <FadeBlock className="essentius-copy-panel max-w-6xl mx-auto px-6 pt-10 pb-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Cómo aprendes aquí
        </p>
        <RevealWords
          as="h2"
          inView
          text="Tres movimientos. Un hábito de pensamiento."
          className="mt-4 font-display text-3xl md:text-5xl leading-[1.1] tracking-tight text-foreground max-w-3xl"
          delay={0.05}
        />
        <FadeBlock delay={0.15} className="mt-5 max-w-2xl">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Essentius no es un chat genérico. Es un ciclo: escribir con claridad,
            conectar ideas y contrastarlas con conocimiento estructurado.
          </p>
        </FadeBlock>
      </FadeBlock>

      {SECTIONS.map((section) => {
        const Visual = section.Visual;
        return (
          <section
            key={section.index}
            className="min-h-[min(100svh,920px)] flex items-center py-20 md:py-28 border-t border-border/50"
          >
            <div className="max-w-6xl mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                className={`essentius-copy-panel space-y-6 ${
                  section.flip ? "lg:order-2" : ""
                }`}
              >
                <FadeBlock>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-mono text-xs tracking-wider">
                      [{section.index}]
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.24em]">
                      {section.kicker}
                    </span>
                  </div>
                </FadeBlock>

                <RevealWords
                  as="h3"
                  inView
                  text={section.title}
                  className="font-display text-4xl md:text-5xl tracking-tight text-foreground"
                  delay={0.04}
                />

                <FadeBlock delay={0.1}>
                  <p className="font-display text-xl md:text-2xl text-foreground/85 leading-snug max-w-md">
                    {section.lead}
                  </p>
                </FadeBlock>

                <div className="space-y-4 max-w-xl">
                  {section.body.map((paragraph, i) => (
                    <FadeBlock key={paragraph.slice(0, 24)} delay={0.12 + i * 0.08}>
                      <p className="text-muted-foreground text-[15px] md:text-base leading-relaxed">
                        {paragraph}
                      </p>
                    </FadeBlock>
                  ))}
                </div>

                <ul className="space-y-3 pt-2">
                  {section.bullets.map((b, i) => (
                    <FadeBlock key={b} delay={0.35 + i * 0.07}>
                      <li className="flex gap-3 text-sm text-foreground/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5c542]" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    </FadeBlock>
                  ))}
                </ul>
              </div>

              <FadeBlock
                delay={0.18}
                className={`relative ${section.flip ? "lg:order-1" : ""}`}
              >
                <Visual />
              </FadeBlock>
            </div>
          </section>
        );
      })}

      <FadeBlock className="essentius-copy-panel max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-border/50 text-center">
        <RevealWords
          as="h2"
          inView
          text="Listo para pensar con método."
          className="font-display text-3xl md:text-4xl tracking-tight text-foreground"
        />
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Entra, elige tu perfil y empieza por una nota humana. El grafo y la
          comparación aparecen cuando tus ideas ya tienen forma.
        </p>
      </FadeBlock>
    </div>
  );
}
