"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PriorityDot } from "@/components/priority-badge";
import {
  addMonths,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  toDateKey,
  WEEKDAY_LABELS_KO,
} from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import type { Task } from "@/types/task";

interface MonthlyCalendarProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

const MAX_VISIBLE = 3;

export function MonthlyCalendar({ tasks, onToggle }: MonthlyCalendarProps) {
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

  const monthLabel = `${anchorDate.getFullYear()}년 ${anchorDate.getMonth() + 1}월`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {monthLabel}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addMonths(d, -1))}
            aria-label="이전 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate(new Date())}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addMonths(d, 1))}
            aria-label="다음 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="min-w-[640px]">
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-slate-400">
        {WEEKDAY_LABELS_KO.map((label) => (
          <div key={label} className="pb-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {gridDates.map((date) => {
          const key = toDateKey(date);
          const dayTasks = sortByPriority(tasksByDate.get(key) ?? []);
          const inMonth = isSameMonth(date, anchorDate);
          const isToday = isSameDay(date, today);
          const visibleTasks = dayTasks.slice(0, MAX_VISIBLE);
          const hiddenCount = dayTasks.length - visibleTasks.length;

          return (
            <div
              key={key}
              className={`flex min-h-[92px] flex-col gap-1 rounded-xl border p-1.5 transition ${
                isToday
                  ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-500/40 dark:bg-indigo-500/10"
                  : inMonth
                    ? "border-slate-200/70 bg-white/50 dark:border-slate-800/70 dark:bg-slate-900/20"
                    : "border-transparent bg-slate-50/40 dark:bg-slate-900/5"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday
                    ? "bg-indigo-600 text-white"
                    : inMonth
                      ? "text-slate-600 dark:text-slate-300"
                      : "text-slate-300 dark:text-slate-700"
                }`}
              >
                {date.getDate()}
              </span>

              <div className="flex flex-1 flex-col gap-0.5">
                {visibleTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onToggle(task.id)}
                    className={`flex items-center gap-1 rounded-md px-1 py-0.5 text-left text-[11px] transition ${
                      task.completed
                        ? "text-slate-300 line-through dark:text-slate-600"
                        : "text-slate-600 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-500/10"
                    }`}
                  >
                    <PriorityDot priority={task.priority} />
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
                {hiddenCount > 0 && (
                  <span className="px-1 text-[11px] text-slate-400">
                    +{hiddenCount}개 더보기
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      </div>
    </div>
  );
}
