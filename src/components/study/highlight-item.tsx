"use client";

import { Trash2 } from "lucide-react";
import type { SubjectHighlight } from "@/types/highlight";

interface HighlightItemProps {
  highlight: SubjectHighlight;
  onDelete: (id: string) => void;
}

export function HighlightItem({ highlight, onDelete }: HighlightItemProps) {
  return (
    <li className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {highlight.title}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(highlight.id)}
          aria-label={`${highlight.title} 삭제`}
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {highlight.summary && (
        <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
          {highlight.summary}
        </p>
      )}
    </li>
  );
}
