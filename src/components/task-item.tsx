import { Check, X } from "lucide-react";
import { PriorityBadge } from "@/components/priority-badge";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3.5 py-2.5 transition hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-900/50 dark:hover:border-slate-700">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={`${task.title} 완료 처리`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? "border-indigo-600 bg-indigo-600"
            : "border-slate-300 hover:border-indigo-400 dark:border-slate-600 dark:hover:border-indigo-500"
        }`}
      >
        {task.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>

      <span
        className={`flex-1 text-sm ${
          task.completed
            ? "text-slate-400 line-through"
            : "text-slate-700 dark:text-slate-100"
        }`}
      >
        {task.title}
      </span>

      <PriorityBadge priority={task.priority} />

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`${task.title} 삭제`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
