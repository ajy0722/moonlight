"use client";

import { ListChecks } from "lucide-react";
import { useMemo } from "react";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskItem } from "@/components/task-item";
import { toDateKey } from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import { cardClass, cardIconClass } from "@/lib/ui";
import type { NewTaskInput, Task } from "@/types/task";

interface TodayTodosCardProps {
  tasks: Task[];
  onAdd: (input: NewTaskInput) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodayTodosCard({ tasks, onAdd, onToggle, onDelete }: TodayTodosCardProps) {
  const today = useMemo(() => toDateKey(new Date()), []);

  const todayTasks = useMemo(() => {
    const sorted = sortByPriority(tasks.filter((t) => t.dueDate === today));
    // 완료된 항목은 아래로
    return [...sorted.filter((t) => !t.completed), ...sorted.filter((t) => t.completed)];
  }, [tasks, today]);

  const remaining = todayTasks.filter((t) => !t.completed).length;

  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cardIconClass}>
            <ListChecks className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">오늘의 할 일</h2>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
          {remaining}개 남음
        </span>
      </div>

      {todayTasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          오늘 등록된 할 일이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todayTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <AddTaskForm defaultDate={today} onAdd={onAdd} />
      </div>
    </section>
  );
}
