"use client";

import { useCallback, useEffect, useState } from "react";
import { getHighlightRepository } from "@/lib/repositories";
import type { NewHighlightInput, SubjectHighlight } from "@/types/highlight";

export function useSubjectHighlights(subjectSlug: string) {
  const [highlights, setHighlights] = useState<SubjectHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getHighlightRepository()
      .listBySubject(subjectSlug)
      .then((loaded) => {
        if (!cancelled) setHighlights(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subjectSlug]);

  const addHighlight = useCallback(
    async (input: Omit<NewHighlightInput, "subjectSlug">) => {
      const created = await getHighlightRepository().create({ ...input, subjectSlug });
      setHighlights((prev) => [...prev, created]);
    },
    [subjectSlug]
  );

  const deleteHighlight = useCallback(async (id: string) => {
    await getHighlightRepository().remove(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return { highlights, isLoading, addHighlight, deleteHighlight };
}
