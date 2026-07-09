"use client";

import { useCallback, useEffect, useState } from "react";
import { getEventRepository } from "@/lib/repositories";
import type { NewEventInput, ScheduleEvent } from "@/types/event";

/** 시간 미지정(종일) 일정이 앞에, 나머지는 시간순 */
export function sortEventsByTime(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => a.time.localeCompare(b.time));
}

export function useEvents() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getEventRepository()
      .list()
      .then((loaded) => {
        if (!cancelled) setEvents(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addEvent = useCallback(async (input: NewEventInput) => {
    const created = await getEventRepository().create(input);
    setEvents((prev) => [...prev, created]);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await getEventRepository().remove(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { events, isLoading, addEvent, deleteEvent };
}
