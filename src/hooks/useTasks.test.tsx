import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTasks } from "./useTasks.ts";
import { TaskProvider } from "../context/TaskContext.tsx";
import { Priority } from "../types/task.ts";

describe("useTasks hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty task list", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TaskProvider });
    expect(result.current.tasks).toEqual([]);
  });

  it("adds a task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TaskProvider });

    act(() => {
      result.current.addTask({
        id: 1,
        title: "My Task",
        description: "Test description",
        priority: Priority.LOW,
        isCompleted: false,
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("My Task");
  });

  it("deletes a task", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TaskProvider });

    act(() => {
      result.current.addTask({
        id: 1,
        title: "Delete Me",
        description: "",
        priority: Priority.LOW,
        isCompleted: false,
      });
    });

    act(() => {
      result.current.deleteTask(1);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("sets a filter and filters tasks correctly", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TaskProvider });

    act(() => {
      result.current.addTask({
        id: 1,
        title: "Low task",
        description: "",
        priority: Priority.LOW,
        isCompleted: false,
      });
      result.current.addTask({
        id: 2,
        title: "High task",
        description: "",
        priority: Priority.HIGH,
        isCompleted: false,
      });
    });

    act(() => {
      result.current.setFilterApplied(Priority.HIGH);
    });

    expect(result.current.filterApplied).toBe(Priority.HIGH);
    expect(
      result.current.tasks.find(
        (t) => t.priority === result.current.filterApplied,
      )?.title,
    ).toBe("High task");
  });

  it("updates a task by id", () => {
    const { result } = renderHook(() => useTasks(), { wrapper: TaskProvider });

    act(() => {
      result.current.addTask({
        id: 1,
        title: "My Task",
        description: "Original description",
        priority: Priority.LOW,
        isCompleted: false,
      });
    });

    act(() => {
      result.current.updateTask({
        id: 1,
        title: "Updated Task",
        description: "Updated description",
        priority: Priority.HIGH,
        isCompleted: false,
      });
    });

    const updated = result.current.tasks.find((t) => t.id === 1);
    expect(updated?.title).toBe("Updated Task");
    expect(updated?.description).toBe("Updated description");
    expect(updated?.priority).toBe("High");
  });
});
