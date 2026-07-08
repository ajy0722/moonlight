"use client";

import { NotebookPen } from "lucide-react";
import { HighlightForm } from "@/components/study/highlight-form";
import { HighlightItem } from "@/components/study/highlight-item";
import { useSubjectHighlights } from "@/hooks/use-subject-highlights";
import type { Subject } from "@/types/subject";

interface SubjectHighlightsProps {
  subject: Subject;
}

export function SubjectHighlights({ subject }: SubjectHighlightsProps) {
  const { highlights, isLoading, addHighlight, deleteHighlight } = useSubjectHighlights(
    subject.slug
  );

  const sorted = [...highlights].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <NotebookPen className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">핵심 요약</h2>
      </div>

      <HighlightForm onAdd={addHighlight} />

      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
      ) : sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">아직 정리한 내용이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((item) => (
            <HighlightItem key={item.id} highlight={item} onDelete={deleteHighlight} />
          ))}
        </ul>
      )}
    </section>
  );
}
