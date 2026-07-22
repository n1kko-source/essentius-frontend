"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealWordsProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "p" | "span" | "h1" | "h2" | "h3";
  /** When true, animates on scroll into view instead of on mount */
  inView?: boolean;
};

/**
 * Word-by-word reveal with soft blur — gallery-style text entrance.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  as: Tag = "p",
  inView = false,
}: RevealWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    const Comp = Tag;
    return <Comp className={className}>{text}</Comp>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.28em] last:mr-0 will-change-transform"
          initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
          {...(inView
            ? {
                whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
                viewport: { once: false, margin: "-80px" },
              }
            : {
                animate: { opacity: 1, y: 0, filter: "blur(0px)" },
              })}
          transition={{
            duration: 0.75,
            delay: delay + i * 0.04,
            ease: EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
