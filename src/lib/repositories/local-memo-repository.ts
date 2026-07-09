import type { MemoRepository } from "@/lib/repositories/memo-repository";
import type { Memo } from "@/types/memo";

const STORAGE_KEY = "moonlight:memos";

function readStorage(): Memo[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  try {
    return JSON.parse(raw) as Memo[];
  } catch {
    return [];
  }
}

function writeStorage(memos: Memo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

/** localStorage 기반 퀵 메모 저장소 구현. */
export class LocalMemoRepository implements MemoRepository {
  async list(): Promise<Memo[]> {
    return readStorage();
  }

  async create(content: string): Promise<Memo> {
    const memo: Memo = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
    };

    const memos = readStorage();
    memos.push(memo);
    writeStorage(memos);
    return memo;
  }

  async remove(id: string): Promise<void> {
    const memos = readStorage().filter((m) => m.id !== id);
    writeStorage(memos);
  }
}
