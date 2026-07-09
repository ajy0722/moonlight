"use client";

import { ListTodo } from "lucide-react";
import { useMemo } from "react";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskItem } from "@/components/task-item";
import { useTasks } from "@/hooks/use-tasks";
import { toDateKey } from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import { cardClass, cardIconClass } from "@/lib/ui";

export function TodoPage() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();
  const today = useMemo(() => toDateKey(new Date()), []);

  const todayTasks = useMemo(() => {
    const sorted = sortByPriority(tasks.filter((t) => t.dueDate === today));
    return [...sorted.filter((t) => !t.completed), ...sorted.filter((t) => t.completed)];
  }, [tasks, today]);

  const remaining = todayTasks.filter((t) => !t.completed).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">할 일</h1>
        <p className="text-sm text-neutral-400">오늘 할 일을 추가하고 관리하세요.</p>
      </header>

      <section className={cardClass}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={cardIconClass}>
              <ListTodo className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-semibold text-neutral-100">오늘 할 일</h2>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
            {remaining}개 남음
          </span>
        </div>

        <AddTaskForm defaultDate={today} onAdd={addTask} />

        {todayTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            오늘 등록된 할 일이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
