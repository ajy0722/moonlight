import { createSeedTasks } from "@/lib/repositories/seed";
import type { TaskRepository } from "@/lib/repositories/task-repository";
import type { NewTaskInput, Task, UpdateTaskInput } from "@/types/task";

const STORAGE_KEY = "moonlight:tasks";

function readStorage(): Task[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const seeded = createSeedTasks();
    writeStorage(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeStorage(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** localStorage 기반 구현. 브라우저 새로고침 후에도 데이터가 유지된다. */
export class LocalTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    return readStorage();
  }

  async create(input: NewTaskInput): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      completed: false,
      priority: input.priority,
      dueDate: input.dueDate,
      createdAt: new Date().toISOString(),
    };

    const tasks = readStorage();
    tasks.push(task);
    writeStorage(tasks);
    return task;
  }

  async update(id: string, updates: UpdateTaskInput): Promise<Task> {
    const tasks = readStorage();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task not found: ${id}`);
    }

    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    writeStorage(tasks);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const tasks = readStorage().filter((t) => t.id !== id);
    writeStorage(tasks);
  }
}
