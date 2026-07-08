"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { getSubjectBySlug } from "@/lib/subjects";
import type { SubjectHighlight } from "@/types/highlight";

interface HighlightsSummaryProps {
  highlights: SubjectHighlight[];
  isLoading: boolean;
}

const MAX_ITEMS = 5;

export function HighlightsSummary({ highlights, isLoading }: HighlightsSummaryProps) {
  const recent = [...highlights]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ITEMS);

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <Sparkles className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">전공 요약</h2>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
      ) : recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          아직 정리된 전공 요약이 없습니다. 공부 메뉴에서 추가해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {recent.map((item) => {
            const subject = getSubjectBySlug(item.subjectSlug);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  {subject && (
                    <Link
                      href={`/study/${subject.slug}`}
                      className="shrink-0 text-xs font-medium text-indigo-500 hover:underline dark:text-indigo-300"
                    >
                      {subject.name}
                    </Link>
                  )}
                </div>
                {item.summary && (
                  <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                    {item.summary}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
