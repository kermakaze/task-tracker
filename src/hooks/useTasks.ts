import { useContext } from "react";
import type { TaskContextType } from "../context/TaskContext.ts";
import { TaskContext } from "../context/TaskContext.ts";

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
