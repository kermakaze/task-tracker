import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskForm } from "./TaskForm";
import { Priority } from "../../types/task";

// Prepare a mock for addTask that can be reset between tests
const addTaskMock = vi.fn();

// Mock useTasks to always return our addTaskMock
vi.mock("../../hooks/useTasks", () => ({
  useTasks: () => ({
    addTask: addTaskMock,
  }),
}));

describe("TaskForm", () => {
  beforeEach(() => {
    addTaskMock.mockReset();
  });

  it("renders input fields and button", () => {
    render(<TaskForm />);
    expect(screen.getByPlaceholderText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Task/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("updates input values", () => {
    render(<TaskForm />);
    const titleInput = screen.getByPlaceholderText(/Task Title/i);
    const descInput = screen.getByPlaceholderText(/Description/i);

    fireEvent.change(titleInput, { target: { value: "Test Task" } });
    fireEvent.change(descInput, { target: { value: "Test Desc" } });

    expect(titleInput).toHaveValue("Test Task");
    expect(descInput).toHaveValue("Test Desc");
  });

  it("calls addTask with correct data and resets form", () => {
    render(<TaskForm />);
    fireEvent.change(screen.getByPlaceholderText(/Task Title/i), {
      target: { value: "My Task" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "My Desc" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: Priority.HIGH },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(addTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "My Task",
        description: "My Desc",
        priority: Priority.HIGH,
      }),
    );
    expect(screen.getByPlaceholderText(/Task Title/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue(Priority.LOW);
  });

  it("does not submit if title or description is empty", () => {
    render(<TaskForm />);
    fireEvent.change(screen.getByPlaceholderText(/Task Title/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(addTaskMock).not.toHaveBeenCalled();
  });

  it("calls onClose after submit", () => {
    const onClose = vi.fn();
    render(<TaskForm onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText(/Task Title/i), {
      target: { value: "T" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "D" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("button is disabled if title or description is empty", () => {
    render(<TaskForm />);
    const button = screen.getByRole("button", { name: /Add Task/i });
    // Initially both empty
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Task Title/i), {
      target: { value: "Some Title" },
    });
    // Description still empty
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Some Desc" },
    });
    // Both filled
    expect(button).not.toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Task Title/i), {
      target: { value: "" },
    });
    // Title empty again
    expect(button).toBeDisabled();
  });
});
