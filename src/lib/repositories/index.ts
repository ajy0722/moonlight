import { IndexedDbFileRepository } from "@/lib/repositories/indexeddb-file-repository";
import { LocalHighlightRepository } from "@/lib/repositories/local-highlight-repository";
import { LocalTaskRepository } from "@/lib/repositories/local-task-repository";
import type { FileRepository } from "@/lib/repositories/file-repository";
import type { HighlightRepository } from "@/lib/repositories/highlight-repository";
import type { TaskRepository } from "@/lib/repositories/task-repository";

let repositoryInstance: TaskRepository | null = null;
let highlightRepositoryInstance: HighlightRepository | null = null;
let fileRepositoryInstance: FileRepository | null = null;

/**
 * 앱 전역에서 사용할 TaskRepository 인스턴스를 반환한다.
 *
 * Supabase로 전환하려면:
 * 1. `npm install @supabase/supabase-js`
 * 2. `src/lib/repositories/supabase-task-repository.example.ts`를 참고해
 *    `.example.ts`를 떼고 `TaskRepository`를 구현하는 SupabaseTaskRepository를 완성
 * 3. 아래 조건 분기에서 SupabaseTaskRepository를 반환하도록 교체
 *
 * 이 함수를 호출하는 훅/컴포넌트 쪽 코드는 전혀 수정할 필요가 없다.
 */
export function getTaskRepository(): TaskRepository {
  if (!repositoryInstance) {
    repositoryInstance = new LocalTaskRepository();
  }
  return repositoryInstance;
}

/** 앱 전역에서 사용할 HighlightRepository 인스턴스를 반환한다. */
export function getHighlightRepository(): HighlightRepository {
  if (!highlightRepositoryInstance) {
    highlightRepositoryInstance = new LocalHighlightRepository();
  }
  return highlightRepositoryInstance;
}

/** 앱 전역에서 사용할 FileRepository 인스턴스를 반환한다. */
export function getFileRepository(): FileRepository {
  if (!fileRepositoryInstance) {
    fileRepositoryInstance = new IndexedDbFileRepository();
  }
  return fileRepositoryInstance;
}
