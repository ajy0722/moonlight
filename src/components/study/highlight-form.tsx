"use client";

import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { NewHighlightInput } from "@/types/highlight";

interface HighlightFormProps {
  onAdd: (input: Omit<NewHighlightInput, "subjectSlug">) => void;
}

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export function HighlightForm({ onAdd }: HighlightFormProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAdd({ title: trimmedTitle, summary: summary.trim() });
    setTitle("");
    setSummary("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className={fieldClass}
      />
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="중요한 내용을 요약하세요"
        rows={3}
        className={`${fieldClass} resize-y`}
      />
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-500 active:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        추가
      </button>
    </form>
  );
}
