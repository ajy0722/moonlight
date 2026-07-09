"use client";

import { useCallback, useEffect, useState } from "react";
import { getMemoRepository } from "@/lib/repositories";
import type { Memo } from "@/types/memo";

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMemoRepository()
      .list()
      .then((loaded) => {
        if (!cancelled) setMemos(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addMemo = useCallback(async (content: string) => {
    const created = await getMemoRepository().create(content);
    setMemos((prev) => [...prev, created]);
  }, []);

  const deleteMemo = useCallback(async (id: string) => {
    await getMemoRepository().remove(id);
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { memos, isLoading, addMemo, deleteMemo };
}
