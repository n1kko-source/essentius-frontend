"use client";

import { listDocuments } from "@/services/api-client";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useRef } from "react";

/** Loads persisted library documents from the API into the app store. */
export function LibraryHydrator() {
  const setDocuments = useAppStore((s) => s.setDocuments);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const docs = await listDocuments();
        const seen = new Set<string>();
        const unique = docs.filter((d) => {
          if (!d.id || seen.has(d.id)) return false;
          seen.add(d.id);
          return true;
        });
        if (unique.length) setDocuments(unique);
      } catch {
        /* tabla aún no creada o sin sesión */
      }
    })();
  }, [setDocuments]);

  return null;
}
