// @ts-nocheck
/**
 * Supabase 연동 참고용 템플릿 (현재 미사용).
 *
 * 사용 방법:
 *   1) npm install @supabase/supabase-js
 *   2) 이 파일명을 supabase-task-repository.ts 로 변경하고 상단의 @ts-nocheck 제거
 *   3) .env.local 에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 설정
 *   4) Supabase에 아래 컬럼을 갖는 `tasks` 테이블 생성
 *      id (uuid, pk) / title (text) / completed (bool) / priority (text)
 *      due_date (date) / created_at (timestamptz)
 *   5) src/lib/repositories/index.ts 의 getTaskRepository()에서
 *      new SupabaseTaskRepository()를 반환하도록 교체
 *
 * Task 타입의 필드(camelCase)와 DB 컬럼(snake_case)을 서로 변환해주는
 * toTask / toRow 매핑만 지키면 나머지 앱 코드는 수정할 필요가 없다.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { TaskRepository } from "@/lib/repositories/task-repository";
import type { NewTaskInput, Task, UpdateTaskInput } from "@/types/task";

type TaskRow = {
  id: string;
  title: string;
  completed: boolean;
  priority: Task["priority"];
  due_date: string;
  created_at: string;
};

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

export class SupabaseTaskRepository implements TaskRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async list(): Promise<Task[]> {
    const { data, error } = await this.client
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as TaskRow[]).map(toTask);
  }

  async create(input: NewTaskInput): Promise<Task> {
    const { data, error } = await this.client
      .from("tasks")
      .insert({
        title: input.title,
        priority: input.priority,
        due_date: input.dueDate,
        completed: false,
      })
      .select()
      .single();
    if (error) throw error;
    return toTask(data as TaskRow);
  }

  async update(id: string, updates: UpdateTaskInput): Promise<Task> {
    const { data, error } = await this.client
      .from("tasks")
      .update({
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.completed !== undefined && { completed: updates.completed }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toTask(data as TaskRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("tasks").delete().eq("id", id);
    if (error) throw error;
  }
}
