"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { BookOpen, Network, PenLine } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const documents = useAppStore((s) => s.documents);
  const notesCount = useAppStore((s) => s.notes.length);

  return (
    <div className="dashboard-page p-8 md:p-10 max-w-5xl space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="dashboard-section space-y-3"
      >
        <h1 className="font-display text-4xl tracking-tight">Tu espacio</h1>
        <p className="dashboard-prose text-muted-foreground text-base leading-relaxed">
          Gestiona fuentes, escribe pensamientos sin IA y compáralos en el grafo.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {[
          {
            label: "Fuentes",
            value: documents.length,
            href: "/dashboard/library",
            icon: BookOpen,
          },
          {
            label: "Notas humanas",
            value: notesCount,
            href: "/dashboard/deep-learning/notes",
            icon: PenLine,
          },
          {
            label: "Grafo",
            value: "Abrir",
            href: "/dashboard/deep-learning/graph",
            icon: Network,
          },
        ].map(({ label, value, href, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
          >
            <Link
              href={href}
              className="block rounded-2xl border border-border bg-card/80 p-6 hover:border-primary/40 transition-colors text-center"
            >
              <Icon
                className="h-6 w-6 text-primary mb-3 mx-auto"
                strokeWidth={1.5}
              />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <p className="font-display text-3xl mt-1">{value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/deep-learning/notes">Escribir una nota</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/library">Subir PDF</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/rank">Ver rango e insignias</Link>
        </Button>
      </div>
    </div>
  );
}
