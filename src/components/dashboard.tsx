"use client";

import { CalendarSection } from "@/components/calendar-section";
import { TodayTaskList } from "@/components/today-task-list";
import { useTasks } from "@/hooks/use-tasks";

export function Dashboard() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();

  if (isLoading) {
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
          개인 비서 대시보드
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          오늘 할 일을 관리하고 이번 주·달의 일정을 한눈에 확인하세요.
        </p>
      </header>

      <TodayTaskList tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />
      <CalendarSection tasks={tasks} onToggle={toggleTask} />
    </div>
  );
}
