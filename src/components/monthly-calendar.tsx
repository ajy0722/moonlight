"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PriorityDot } from "@/components/priority-badge";
import { sortEventsByTime } from "@/hooks/use-events";
import {
  addMonths,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  toDateKey,
  WEEKDAY_LABELS_KO,
} from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import type { ScheduleEvent } from "@/types/event";
import type { Task } from "@/types/task";

interface MonthlyCalendarProps {
  tasks: Task[];
  events: ScheduleEvent[];
  /** 날짜 셀 클릭 시 호출 (YYYY-MM-DD) */
  onSelectDate: (dateKey: string) => void;
}

const MAX_VISIBLE = 3;

export function MonthlyCalendar({ tasks, events, onSelectDate }: MonthlyCalendarProps) {
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);
  const gridDates = useMemo(() => getMonthGrid(anchorDate), [anchorDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasks]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  const monthLabel = `${anchorDate.getFullYear()}년 ${anchorDate.getMonth() + 1}월`;

  const navButtonClass =
    "flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition hover:bg-[#2a2a2a] hover:text-neutral-100";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-200">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addMonths(d, -1))}
            aria-label="이전 달"
            className={navButtonClass}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate(new Date())}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-neutral-400 transition hover:bg-[#2a2a2a] hover:text-neutral-100"
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addMonths(d, 1))}
            aria-label="다음 달"
            className={navButtonClass}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-neutral-500">
            {WEEKDAY_LABELS_KO.map((label) => (
              <div key={label} className="pb-1">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {gridDates.map((date) => {
              const key = toDateKey(date);
              const dayEvents = sortEventsByTime(eventsByDate.get(key) ?? []);
              const dayTasks = sortByPriority(tasksByDate.get(key) ?? []);
              const inMonth = isSameMonth(date, anchorDate);
              const isToday = isSameDay(date, today);
              const visibleEvents = dayEvents.slice(0, MAX_VISIBLE);
              const visibleTasks = dayTasks.slice(0, Math.max(0, MAX_VISIBLE - visibleEvents.length));
              const hiddenCount =
                dayEvents.length + dayTasks.length - visibleEvents.length - visibleTasks.length;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDate(key)}
                  aria-label={`${key} 일정 보기`}
                  className={`flex min-h-[96px] flex-col gap-1 rounded-xl border p-1.5 text-left transition ${
                    isToday
                      ? "border-cyan-500/50 bg-cyan-500/10 hover:border-cyan-400/70"
                      : inMonth
                        ? "border-[#2a2a2a] bg-[#1f1f1f] hover:border-cyan-500/30 hover:bg-[#242424]"
                        : "border-transparent bg-[#141414] hover:border-[#2a2a2a]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-cyan-400 text-black"
                        : inMonth
                          ? "text-neutral-300"
                          : "text-neutral-700"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  <div className="flex flex-1 flex-col gap-0.5">
                    {visibleEvents.map((event) => (
                      <span
                        key={event.id}
                        className="flex items-center gap-1 truncate rounded bg-cyan-500/10 px-1 py-0.5 text-[11px] text-cyan-300"
                      >
                        {event.time && (
                          <span className="shrink-0 font-mono tabular-nums">{event.time}</span>
                        )}
                        <span className="truncate">{event.title}</span>
                      </span>
                    ))}
                    {visibleTasks.map((task) => (
                      <span
                        key={task.id}
                        className={`flex items-center gap-1 px-1 py-0.5 text-[11px] ${
                          task.completed
                            ? "text-neutral-600 line-through"
                            : "text-neutral-300"
                        }`}
                      >
                        <PriorityDot priority={task.priority} />
                        <span className="truncate">{task.title}</span>
                      </span>
                    ))}
                    {hiddenCount > 0 && (
                      <span className="px-1 text-[11px] text-neutral-500">
                        +{hiddenCount}개 더보기
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
