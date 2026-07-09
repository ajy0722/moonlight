"use client";

import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/lib/ui";
import type { NewTaskInput, Priority } from "@/types/task";

interface AddTaskFormProps {
  defaultDate: string;
  onAdd: (input: NewTaskInput) => void;
}

export function AddTaskForm({ defaultDate, onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState(defaultDate);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd({ title: trimmed, priority, dueDate });
    setTitle("");
    setPriority("medium");
    setDueDate(defaultDate);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 할 일 추가"
        className={`flex-1 ${fieldClass}`}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        aria-label="우선순위"
        className={fieldClass}
      >
        <option value="high">높음</option>
        <option value="medium">중간</option>
        <option value="low">낮음</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="마감일"
        className={fieldClass}
      />
      <button type="submit" className={primaryButtonClass}>
        <Plus className="h-4 w-4" />
        추가
      </button>
    </form>
  );
}
