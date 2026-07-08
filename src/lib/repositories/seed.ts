import { addDays, toDateKey } from "@/lib/date-utils";
import type { Task } from "@/types/task";

/** 최초 방문 시(저장된 데이터가 전혀 없을 때) 보여줄 예시 할 일 */
export function createSeedTasks(): Task[] {
  const now = new Date();
  const today = toDateKey(now);
  const tomorrow = toDateKey(addDays(now, 1));
  const createdAt = now.toISOString();

  return [
    {
      id: crypto.randomUUID(),
      title: "오늘 회의 자료 준비",
      completed: false,
      priority: "high",
      dueDate: today,
      createdAt,
    },
    {
      id: crypto.randomUUID(),
      title: "이메일 답장하기",
      completed: false,
      priority: "medium",
      dueDate: today,
      createdAt,
    },
    {
      id: crypto.randomUUID(),
      title: "주간 보고서 작성",
      completed: false,
      priority: "low",
      dueDate: tomorrow,
      createdAt,
    },
  ];
}
