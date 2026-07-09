"use client";

import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/lib/ui";
import type { NewEventInput } from "@/types/event";

interface EventFormProps {
  /** 일정이 추가될 날짜 (YYYY-MM-DD) */
  date: string;
  onAdd: (input: NewEventInput) => void;
  /** 추가 완료 후 호출 (폼 닫기 등) */
  onDone?: () => void;
}

export function EventForm({ date, onAdd, onDone }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd({ title: trimmed, date, time, memo: memo.trim() });
    setTitle("");
    setTime("");
    setMemo("");
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="일정 시간"
          className={fieldClass}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="일정 이름"
          aria-label="일정 이름"
          className={`min-w-0 flex-1 ${fieldClass}`}
        />
      </div>
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모 (선택)"
        rows={2}
        className={`resize-none ${fieldClass}`}
      />
      <button type="submit" className={primaryButtonClass}>
        <Plus className="h-4 w-4" />
        일정 추가
      </button>
    </form>
  );
}
