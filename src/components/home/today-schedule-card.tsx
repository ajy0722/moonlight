"use client";

import { CalendarDays, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EventForm } from "@/components/event-form";
import { sortEventsByTime } from "@/hooks/use-events";
import { toDateKey } from "@/lib/date-utils";
import { cardClass, cardIconClass } from "@/lib/ui";
import type { NewEventInput, ScheduleEvent } from "@/types/event";

interface TodayScheduleCardProps {
  events: ScheduleEvent[];
  onAdd: (input: NewEventInput) => void;
  onDelete: (id: string) => void;
}

export function TodayScheduleCard({ events, onAdd, onDelete }: TodayScheduleCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const today = useMemo(() => toDateKey(new Date()), []);

  const todayEvents = useMemo(
    () => sortEventsByTime(events.filter((e) => e.date === today)),
    [events, today]
  );

  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={cardIconClass}>
            <CalendarDays className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">오늘의 일정</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="곧 지원 예정입니다"
            className="rounded-lg border border-[#2e2e2e] px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            Google Calendar 연동
          </button>
          <button
            type="button"
            onClick={() => setIsAdding((v) => !v)}
            aria-label={isAdding ? "일정 추가 닫기" : "일정 추가"}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition hover:bg-cyan-500/20"
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isAdding && <EventForm date={today} onAdd={onAdd} onDone={() => setIsAdding(false)} />}

      {todayEvents.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">오늘 등록된 일정이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todayEvents.map((event) => (
            <li
              key={event.id}
              className="group flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3.5 py-2.5 transition hover:border-[#3a3a3a]"
            >
              <span className="mt-0.5 w-12 shrink-0 font-mono text-sm font-medium text-cyan-400 tabular-nums">
                {event.time || "종일"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-100">{event.title}</p>
                {event.memo && (
                  <p className="mt-0.5 truncate text-xs text-neutral-500">{event.memo}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                aria-label={`${event.title} 삭제`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
