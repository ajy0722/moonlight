"use client";

import { useEffect, useState } from "react";
import { getHighlightRepository } from "@/lib/repositories";
import type { SubjectHighlight } from "@/types/highlight";

export function useAllHighlights() {
  const [highlights, setHighlights] = useState<SubjectHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getHighlightRepository()
      .list()
      .then((loaded) => {
        if (!cancelled) setHighlights(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { highlights, isLoading };
}
