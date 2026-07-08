import type { NewTaskInput, Task, UpdateTaskInput } from "@/types/task";

/**
 * 할 일 데이터 접근 인터페이스.
 *
 * 지금은 LocalTaskRepository(로컬 스토리지)만 구현되어 있지만,
 * 이 인터페이스를 그대로 구현하는 SupabaseTaskRepository를 추가하고
 * `src/lib/repositories/index.ts`의 getTaskRepository()에서 반환값만
 * 바꾸면 나머지 코드(훅/컴포넌트)는 수정 없이 그대로 동작한다.
 */
export interface TaskRepository {
  list(): Promise<Task[]>;
  create(input: NewTaskInput): Promise<Task>;
  update(id: string, updates: UpdateTaskInput): Promise<Task>;
  remove(id: string): Promise<void>;
}
