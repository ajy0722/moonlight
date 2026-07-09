import type { EventRepository } from "@/lib/repositories/event-repository";
import type { NewEventInput, ScheduleEvent } from "@/types/event";

const STORAGE_KEY = "moonlight:events";

function readStorage(): ScheduleEvent[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  try {
    return JSON.parse(raw) as ScheduleEvent[];
  } catch {
    return [];
  }
}

function writeStorage(events: ScheduleEvent[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/** localStorage 기반 일정 저장소 구현. */
export class LocalEventRepository implements EventRepository {
  async list(): Promise<ScheduleEvent[]> {
    return readStorage();
  }

  async create(input: NewEventInput): Promise<ScheduleEvent> {
    const event: ScheduleEvent = {
      id: crypto.randomUUID(),
      title: input.title,
      date: input.date,
      time: input.time,
      memo: input.memo,
      createdAt: new Date().toISOString(),
    };

    const events = readStorage();
    events.push(event);
    writeStorage(events);
    return event;
  }

  async remove(id: string): Promise<void> {
    const events = readStorage().filter((e) => e.id !== id);
    writeStorage(events);
  }
}
