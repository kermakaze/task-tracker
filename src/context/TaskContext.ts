import { Priority, type Task } from "../types/task.ts";
import { createContext } from "react";

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: number) => void;
  filterApplied: Priority | Priority.ALL;
  setFilterApplied: (filter: Priority | Priority.ALL) => void;
  reorderTasks: (newOrder: Task[]) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);
