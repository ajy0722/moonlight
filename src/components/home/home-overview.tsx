"use client";

import { HighlightsSummary } from "@/components/home/highlights-summary";
import { UpcomingTasks } from "@/components/home/upcoming-tasks";
import { useAllHighlights } from "@/hooks/use-all-highlights";
import { useTasks } from "@/hooks/use-tasks";

export function HomeOverview() {
  const { tasks, isLoading: tasksLoading, toggleTask, deleteTask } = useTasks();
  const { highlights, isLoading: highlightsLoading } = useAllHighlights();

  if (tasksLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Moonlight
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          오늘과 내일의 할 일, 그리고 정리해 둔 전공 요약을 한눈에 확인하세요.
        </p>
      </header>

      <UpcomingTasks tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      <HighlightsSummary highlights={highlights} isLoading={highlightsLoading} />
    </div>
  );
}
