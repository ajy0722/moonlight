"use client";

import { X } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { sortEventsByTime } from "@/hooks/use-events";
import type { NewEventInput, ScheduleEvent } from "@/types/event";

interface EventModalProps {
  /** 선택된 날짜 (YYYY-MM-DD) */
  dateKey: string;
  events: ScheduleEvent[];
  onClose: () => void;
  onAdd: (input: NewEventInput) => void;
  onDelete: (id: string) => void;
}

function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(year, month - 1, day).getDay()
  ];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function EventModal({ dateKey, events, onClose, onAdd, onDelete }: EventModalProps) {
  const dayEvents = sortEventsByTime(events.filter((e) => e.date === dateKey));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${formatDateLabel(dateKey)} 일정`}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-xl border border-[#2e2e2e] bg-[#1c1c1c] p-5 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-100">
            {formatDateLabel(dateKey)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#2a2a2a] hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {dayEvents.length > 0 && (
          <ul className="flex flex-col gap-2">
            {dayEvents.map((event) => (
              <li
                key={event.id}
                className="group flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#242424] px-3.5 py-2.5"
              >
                <span className="mt-0.5 w-12 shrink-0 font-mono text-sm font-medium text-cyan-400 tabular-nums">
                  {event.time || "종일"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-100">{event.title}</p>
                  {event.memo && (
                    <p className="mt-0.5 text-xs whitespace-pre-wrap text-neutral-500">
                      {event.memo}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  aria-label={`${event.title} 삭제`}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-600 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 border-t border-[#2e2e2e] pt-4">
          <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            새 일정 추가
          </span>
          <EventForm date={dateKey} onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
}
