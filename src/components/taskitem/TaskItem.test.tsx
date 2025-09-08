import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskItem } from "./TaskItem.tsx";
import { Priority, type Task } from "../../types/task.ts";

// Prepare a mock for deleteTask that can be reset between tests
const deleteTaskMock = vi.fn();
const updateTaskMock = vi.fn();

// Mock useTasks to always return our deleteTaskMock and updateTaskMock
vi.mock("../../hooks/useTasks", () => ({
  useTasks: () => ({
    deleteTask: deleteTaskMock,
    updateTask: updateTaskMock,
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
    updateTaskMock.mockReset();
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

  it("enters edit mode when edit button is clicked", () => {
    render(<TaskItem task={sampleTask} />);
    const editBtn = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editBtn);
    expect(screen.getByDisplayValue("Sample Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("updates task when save is clicked after editing", () => {
    render(<TaskItem task={sampleTask} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const titleInput = screen.getByDisplayValue("Sample Task");
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    const descInput = screen.getByDisplayValue("Sample Description");
    fireEvent.change(descInput, { target: { value: "Updated Desc" } });

    const prioritySelect = screen.getByDisplayValue(Priority.HIGH);
    fireEvent.change(prioritySelect, { target: { value: Priority.LOW } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(updateTaskMock).toHaveBeenCalledWith({
      ...sampleTask,
      title: "Updated Task",
      description: "Updated Desc",
      priority: Priority.LOW,
    });
  });

  it("restores original values and exits edit mode when cancel is clicked", () => {
    render(<TaskItem task={sampleTask} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const titleInput = screen.getByDisplayValue("Sample Task");
    fireEvent.change(titleInput, { target: { value: "Changed" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    expect(updateTaskMock).not.toHaveBeenCalled();
  });

  it("save button is disabled if title or description is empty", () => {
    render(<TaskItem task={sampleTask} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const titleInput = screen.getByDisplayValue("Sample Task");
    fireEvent.change(titleInput, { target: { value: "" } });

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    const descInput = screen.getByDisplayValue("Sample Description");
    fireEvent.change(descInput, { target: { value: "" } });

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });
});
