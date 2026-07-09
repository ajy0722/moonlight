"use client";

import { GreetingBar } from "@/components/greeting-bar";
import { HourlyWeatherCard } from "@/components/home/hourly-weather-card";
import { QuickMemoCard } from "@/components/home/quick-memo-card";
import { TodayScheduleCard } from "@/components/home/today-schedule-card";
import { TodayTodosCard } from "@/components/home/today-todos-card";
import { useEvents } from "@/hooks/use-events";
import { useMemos } from "@/hooks/use-memos";
import { useTasks } from "@/hooks/use-tasks";

export function HomeOverview() {
  const { tasks, isLoading: tasksLoading, toggleTask, deleteTask } = useTasks();
  const { events, isLoading: eventsLoading, addEvent, deleteEvent } = useEvents();
  const { memos, addMemo, deleteMemo } = useMemos();

  if (tasksLoading || eventsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <GreetingBar />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <TodayScheduleCard events={events} onAdd={addEvent} onDelete={deleteEvent} />
        <TodayTodosCard tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        <QuickMemoCard memos={memos} onAdd={addMemo} onDelete={deleteMemo} />
        <HourlyWeatherCard />
      </div>
    </div>
  );
}
