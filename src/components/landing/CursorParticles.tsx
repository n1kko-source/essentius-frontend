"use client";

import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

async function initParticles(engine: Engine) {
  await loadSlim(engine);
}

/**
 * Soft black network on light UI — denser & visible, still under copy panels.
 */
function buildOptions(isNarrow: boolean): ISourceOptions {
  return {
    fullScreen: { enable: false },
    fpsLimit: 30,
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    background: { color: { value: "transparent" } },
    particles: {
      number: {
        value: isNarrow ? 90 : 160,
        density: { enable: false },
      },
      color: {
        value: ["#18181b", "#27272a", "#3f3f46"],
      },
      links: {
        enable: true,
        distance: 150,
        color: "#27272a",
        opacity: 0.22,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.4,
        direction: "none",
        outModes: { default: "bounce" },
      },
      opacity: {
        value: { min: 0.22, max: 0.42 },
      },
      size: {
        value: { min: 1.1, max: 2.4 },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: !isNarrow,
          mode: ["attract", "grab"],
        },
        resize: { enable: true },
      },
      modes: {
        attract: {
          distance: 170,
          duration: 0.35,
          speed: 0.9,
          factor: 1.7,
          maxSpeed: 11,
          easing: "ease-out-quad",
        },
        grab: {
          distance: 150,
          links: { opacity: 0.4, color: "#3f3f46" },
        },
      },
    },
  };
}

type CursorParticlesProps = {
  id?: string;
};

/**
 * Soft neural-field particles that attract toward / link to the cursor.
 * Marketing pages; disabled under prefers-reduced-motion.
 */
export function CursorParticles({
  id = "essentius-cursor-particles",
}: CursorParticlesProps) {
  const reduce = useReducedMotion();
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const options = useMemo(() => buildOptions(isNarrow), [isNarrow]);

  if (reduce) return null;

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id={id}
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
        options={options}
      />
    </ParticlesProvider>
  );
}
