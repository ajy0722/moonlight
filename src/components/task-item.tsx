import { Check, X } from "lucide-react";
import { PriorityDot } from "@/components/priority-badge";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="group flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3.5 py-2.5 transition hover:border-[#3a3a3a]">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={`${task.title} 완료 처리`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? "border-cyan-400 bg-cyan-400"
            : "border-neutral-600 hover:border-cyan-400"
        }`}
      >
        {task.completed && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
      </button>

      <PriorityDot priority={task.priority} />

      <span
        className={`flex-1 text-sm ${
          task.completed ? "text-neutral-500 line-through" : "text-neutral-100"
        }`}
      >
        {task.title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`${task.title} 삭제`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
