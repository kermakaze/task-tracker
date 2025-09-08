import { useContext } from "react";
import type { TaskContextType } from "../context/TaskContext.ts";
import { TaskContext } from "../context/TaskContext.ts";
import type { Task } from "../types/task.ts";

export const useTasks = (): TaskContextType & {
  reorderTasks: (tasks: Task[]) => void;
} => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context as TaskContextType & { reorderTasks: (tasks: Task[]) => void };
};
