"use client";

import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { MonthlyCalendar } from "@/components/monthly-calendar";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import type { Task } from "@/types/task";

type ViewMode = "week" | "month";

interface CalendarSectionProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function CalendarSection({ tasks, onToggle }: CalendarSectionProps) {
  const [view, setView] = useState<ViewMode>("week");

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <CalendarRange className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            캘린더
          </h2>
        </div>

        <div className="flex items-center rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setView("week")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              view === "week"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            주간
          </button>
          <button
            type="button"
            onClick={() => setView("month")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              view === "month"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            월간
          </button>
        </div>
      </div>

      {view === "week" ? (
        <WeeklyCalendar tasks={tasks} onToggle={onToggle} />
      ) : (
        <MonthlyCalendar tasks={tasks} onToggle={onToggle} />
      )}
    </section>
  );
}
