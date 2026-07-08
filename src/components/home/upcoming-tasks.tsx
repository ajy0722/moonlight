"use client";

import { CalendarClock } from "lucide-react";
import { useMemo } from "react";
import { TaskItem } from "@/components/task-item";
import { addDays, toDateKey } from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import type { Task } from "@/types/task";

interface UpcomingTasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UpcomingTasks({ tasks, onToggle, onDelete }: UpcomingTasksProps) {
  const today = useMemo(() => toDateKey(new Date()), []);
  const tomorrow = useMemo(() => toDateKey(addDays(new Date(), 1)), []);

  const todayTasks = useMemo(
    () => sortByPriority(tasks.filter((t) => t.dueDate === today)),
    [tasks, today]
  );
  const tomorrowTasks = useMemo(
    () => sortByPriority(tasks.filter((t) => t.dueDate === tomorrow)),
    [tasks, tomorrow]
  );

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <CalendarClock className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          오늘·내일 할 일
        </h2>
      </div>

      <TaskGroup label="오늘" tasks={todayTasks} onToggle={onToggle} onDelete={onDelete} />
      <TaskGroup label="내일" tasks={tomorrowTasks} onToggle={onToggle} onDelete={onDelete} />
    </section>
  );
}

function TaskGroup({
  label,
  tasks,
  onToggle,
  onDelete,
}: {
  label: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {label}
      </h3>
      {tasks.length === 0 ? (
        <p className="py-3 text-center text-sm text-slate-400">등록된 할 일이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
