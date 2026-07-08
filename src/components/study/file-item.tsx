"use client";

import { FileText, Trash2 } from "lucide-react";
import type { SubjectFileWithUrl } from "@/types/subject-file";

interface FileItemProps {
  file: SubjectFileWithUrl;
  onDelete: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileItem({ file, onDelete }: FileItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3.5 py-2.5 dark:border-slate-800/70 dark:bg-slate-900/50">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
        <FileText className="h-4 w-4" />
      </span>

      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 truncate text-sm font-medium text-slate-700 hover:text-indigo-600 hover:underline dark:text-slate-200 dark:hover:text-indigo-300"
      >
        {file.name}
      </a>

      <span className="shrink-0 text-xs text-slate-400">{formatSize(file.size)}</span>

      <button
        type="button"
        onClick={() => onDelete(file.id)}
        aria-label={`${file.name} 삭제`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
