import type { Memo } from "@/types/memo";

export interface MemoRepository {
  list(): Promise<Memo[]>;
  create(content: string): Promise<Memo>;
  remove(id: string): Promise<void>;
}
