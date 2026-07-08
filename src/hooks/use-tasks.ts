"use client";

import { useCallback, useEffect, useState } from "react";
import { getTaskRepository } from "@/lib/repositories";
import type { NewTaskInput, Task } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTaskRepository()
      .list()
      .then((loaded) => {
        if (!cancelled) setTasks(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addTask = useCallback(async (input: NewTaskInput) => {
    const created = await getTaskRepository().create(input);
    setTasks((prev) => [...prev, created]);
  }, []);

  const toggleTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const updated = await getTaskRepository().update(id, {
        completed: !target.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    [tasks]
  );

  const deleteTask = useCallback(async (id: string) => {
    await getTaskRepository().remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, isLoading, addTask, toggleTask, deleteTask };
}
