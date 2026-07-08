export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  /** YYYY-MM-DD (로컬 날짜 기준) */
  dueDate: string;
  createdAt: string;
}

export interface NewTaskInput {
  title: string;
  priority: Priority;
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string;
}
