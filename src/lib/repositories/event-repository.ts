import type { NewEventInput, ScheduleEvent } from "@/types/event";

export interface EventRepository {
  list(): Promise<ScheduleEvent[]>;
  create(input: NewEventInput): Promise<ScheduleEvent>;
  remove(id: string): Promise<void>;
}
