import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskItem } from "./TaskItem.tsx";
import { Priority, type Task } from "../../types/task.ts";

// Prepare a mock for deleteTask that can be reset between tests
const deleteTaskMock = vi.fn();

// Mock useTasks to always return our deleteTaskMock
vi.mock("../hooks/useTasks", () => ({
  useTasks: () => ({
    deleteTask: deleteTaskMock,
  }),
}));

const sampleTask: Task = {
  id: 42,
  title: "Sample Task",
  description: "Sample Description",
  priority: Priority.HIGH,
};

describe("TaskItem", () => {
  beforeEach(() => {
    deleteTaskMock.mockReset();
  });

  it("renders task title, description, priority, and id", () => {
    render(<TaskItem task={sampleTask} />);
    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    expect(screen.getByText("Sample Description")).toBeInTheDocument();
    expect(screen.getByText(Priority.HIGH)).toBeInTheDocument();
    expect(screen.getByText("ST-42")).toBeInTheDocument();
  });

  it("calls deleteTask with task id when delete button is clicked", () => {
    render(<TaskItem task={sampleTask} />);
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(deleteTaskMock).toHaveBeenCalledWith(42);
  });
});
