"use client";

import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { EventModal } from "@/components/event-modal";
import { MonthlyCalendar } from "@/components/monthly-calendar";
import { useEvents } from "@/hooks/use-events";
import { useTasks } from "@/hooks/use-tasks";
import { cardClass, cardIconClass } from "@/lib/ui";

export function Dashboard() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { events, isLoading: eventsLoading, addEvent, deleteEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (tasksLoading || eventsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">일정</h1>
        <p className="text-sm text-neutral-400">
          날짜를 클릭하면 그 날의 일정을 확인하고 추가할 수 있어요.
        </p>
      </header>

      <section className={cardClass}>
        <div className="flex items-center gap-2.5">
          <span className={cardIconClass}>
            <CalendarRange className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">월간 캘린더</h2>
        </div>

        <MonthlyCalendar tasks={tasks} events={events} onSelectDate={setSelectedDate} />
      </section>

      {selectedDate && (
        <EventModal
          dateKey={selectedDate}
          events={events}
          onClose={() => setSelectedDate(null)}
          onAdd={addEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}
