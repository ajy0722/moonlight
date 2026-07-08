"use client";

import { FileText, Upload } from "lucide-react";
import { useRef } from "react";
import { FileItem } from "@/components/study/file-item";
import { useSubjectFiles } from "@/hooks/use-subject-files";
import type { Subject } from "@/types/subject";

interface SubjectFilesProps {
  subject: Subject;
}

export function SubjectFiles({ subject }: SubjectFilesProps) {
  const { files, isLoading, error, uploadFiles, deleteFile } = useSubjectFiles(subject.slug);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...files].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <FileText className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">자료</h2>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-500 active:bg-indigo-700"
        >
          <Upload className="h-4 w-4" />
          PDF 업로드
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
      ) : sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          업로드된 자료가 없습니다. PDF 파일을 업로드해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((file) => (
            <FileItem key={file.id} file={file} onDelete={deleteFile} />
          ))}
        </ul>
      )}
    </section>
  );
}
