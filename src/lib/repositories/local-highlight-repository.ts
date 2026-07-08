import type { HighlightRepository } from "@/lib/repositories/highlight-repository";
import type { NewHighlightInput, SubjectHighlight } from "@/types/highlight";

const STORAGE_KEY = "moonlight:study-highlights";

function readStorage(): SubjectHighlight[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  try {
    return JSON.parse(raw) as SubjectHighlight[];
  } catch {
    return [];
  }
}

function writeStorage(highlights: SubjectHighlight[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
}

/** localStorage 기반 구현. 브라우저 새로고침 후에도 데이터가 유지된다. */
export class LocalHighlightRepository implements HighlightRepository {
  async list(): Promise<SubjectHighlight[]> {
    return readStorage();
  }

  async listBySubject(subjectSlug: string): Promise<SubjectHighlight[]> {
    return readStorage().filter((h) => h.subjectSlug === subjectSlug);
  }

  async create(input: NewHighlightInput): Promise<SubjectHighlight> {
    const highlight: SubjectHighlight = {
      id: crypto.randomUUID(),
      subjectSlug: input.subjectSlug,
      title: input.title,
      summary: input.summary,
      createdAt: new Date().toISOString(),
    };

    const highlights = readStorage();
    highlights.push(highlight);
    writeStorage(highlights);
    return highlight;
  }

  async remove(id: string): Promise<void> {
    const highlights = readStorage().filter((h) => h.id !== id);
    writeStorage(highlights);
  }
}
