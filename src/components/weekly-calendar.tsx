"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/priority-badge";
import { addDays, getWeekDates, isSameDay, toDateKey, WEEKDAY_LABELS_KO } from "@/lib/date-utils";
import { sortByPriority } from "@/lib/priority";
import type { Task } from "@/types/task";

interface WeeklyCalendarProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function WeeklyCalendar({ tasks, onToggle }: WeeklyCalendarProps) {
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);
  const weekDates = useMemo(() => getWeekDates(anchorDate), [anchorDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasks]);

  const weekLabel = `${weekDates[0].getMonth() + 1}월 ${weekDates[0].getDate()}일 - ${
    weekDates[6].getMonth() + 1
  }월 ${weekDates[6].getDate()}일`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {weekLabel}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addDays(d, -7))}
            aria-label="이전 주"
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
            onClick={() => setAnchorDate((d) => addDays(d, 7))}
            aria-label="다음 주"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="grid min-w-[640px] grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const key = toDateKey(date);
          const dayTasks = sortByPriority(tasksByDate.get(key) ?? []);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={key}
              className={`flex min-h-[150px] flex-col gap-2 rounded-2xl border p-2.5 transition ${
                isToday
                  ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-500/40 dark:bg-indigo-500/10"
                  : "border-slate-200/70 bg-white/50 dark:border-slate-800/70 dark:bg-slate-900/20"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {WEEKDAY_LABELS_KO[i]}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1">
                {dayTasks.length === 0 ? (
                  <span className="text-xs text-slate-300 dark:text-slate-700">-</span>
                ) : (
                  dayTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onToggle(task.id)}
                      className={`flex flex-col items-start gap-1 rounded-lg border px-1.5 py-1 text-left text-xs transition ${
                        task.completed
                          ? "border-slate-100 bg-slate-50 text-slate-400 line-through dark:border-slate-800 dark:bg-slate-900"
                          : "border-slate-200/70 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-indigo-500/30"
                      }`}
                    >
                      <span className="line-clamp-2">{task.title}</span>
                      <PriorityBadge priority={task.priority} />
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
