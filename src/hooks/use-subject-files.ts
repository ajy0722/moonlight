"use client";

import { useCallback, useEffect, useState } from "react";
import { getFileRepository } from "@/lib/repositories";
import type { SubjectFileWithUrl } from "@/types/subject-file";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function useSubjectFiles(subjectSlug: string) {
  const [files, setFiles] = useState<SubjectFileWithUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const repo = getFileRepository();

    (async () => {
      const metas = await repo.listBySubject(subjectSlug);
      const withUrls = await Promise.all(
        metas.map(async (meta) => {
          const blob = await repo.getBlob(meta.id);
          return { ...meta, url: blob ? URL.createObjectURL(blob) : "" };
        })
      );
      if (!cancelled) {
        setFiles(withUrls);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subjectSlug]);

  const uploadFiles = useCallback(
    async (fileList: FileList) => {
      setError(null);
      const incoming = Array.from(fileList);

      if (incoming.some((file) => !isPdf(file))) {
        setError("PDF 파일만 업로드할 수 있습니다.");
        return;
      }
      if (incoming.some((file) => file.size > MAX_FILE_SIZE)) {
        setError("파일 크기는 20MB를 넘을 수 없습니다.");
        return;
      }

      const repo = getFileRepository();
      for (const file of incoming) {
        const created = await repo.upload(subjectSlug, file);
        setFiles((prev) => [...prev, { ...created, url: URL.createObjectURL(file) }]);
      }
    },
    [subjectSlug]
  );

  const deleteFile = useCallback(async (id: string) => {
    await getFileRepository().remove(id);
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return { files, isLoading, error, uploadFiles, deleteFile };
}
