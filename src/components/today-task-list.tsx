"use client";

import { ListChecks } from "lucide-react";
import { useMemo } from "react";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskItem } from "@/components/task-item";
import { toDateKey } from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import type { NewTaskInput, Task } from "@/types/task";

interface TodayTaskListProps {
  tasks: Task[];
  onAdd: (input: NewTaskInput) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodayTaskList({ tasks, onAdd, onToggle, onDelete }: TodayTaskListProps) {
  const today = useMemo(() => toDateKey(new Date()), []);

  const todayTasks = useMemo(
    () => sortByPriority(tasks.filter((t) => t.dueDate === today)),
    [tasks, today]
  );

  const remaining = todayTasks.filter((t) => !t.completed).length;

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <ListChecks className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            오늘 할 일
          </h2>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          {remaining}개 남음
        </span>
      </div>

      <AddTaskForm defaultDate={today} onAdd={onAdd} />

      {todayTasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          오늘 등록된 할 일이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todayTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
