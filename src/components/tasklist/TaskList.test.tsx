import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList } from "./TaskList.tsx";
import { Priority, type Task } from "../../types/task.ts";
import { TaskProvider } from "../../context/TaskContext.tsx";

// Mock TaskItem to just render the title for isolation
vi.mock("./TaskItem", () => ({
  TaskItem: ({ task }: { task: Task }) => <div>{task.title}</div>,
}));

const tasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "Desc One",
    priority: Priority.LOW,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Desc Two",
    priority: Priority.HIGH,
  },
];

describe("TaskList", () => {
  it("renders only tasks matching the filter", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          filterApplied={Priority.HIGH}
          showAddButton={true}
        />
      </TaskProvider>,
    );
    expect(screen.queryByText("Task One")).not.toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("renders all tasks if filterApplied is Priority.ALL", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          filterApplied={Priority.ALL}
          showAddButton={true}
        />
      </TaskProvider>,
    );
    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("renders 'No tasks available.' message if filtered tasks is empty", () => {
    render(
      <TaskList
        tasks={tasks}
        filterApplied={Priority.MEDIUM}
        showAddButton={true}
      />,
    );
    expect(screen.getByText(/no tasks available/i)).toBeInTheDocument();
  });

  it("renders add button if showAddButton is true", () => {
    render(<TaskList tasks={tasks} showAddButton={true} />);
    expect(
      screen.getByRole("button", { name: /add new task/i }),
    ).toBeInTheDocument();
  });

  it("does not render add button if showAddButton is false", () => {
    render(<TaskList tasks={tasks} showAddButton={false} />);
    expect(
      screen.queryByRole("button", { name: /add new task/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onAddTask when add button is clicked", () => {
    const onAddTask = vi.fn();
    render(
      <TaskList tasks={tasks} showAddButton={true} onAddTask={onAddTask} />,
    );
    const addBtn = screen.getByRole("button", { name: /add new task/i });
    fireEvent.click(addBtn);
    expect(onAddTask).toHaveBeenCalled();
  });
});
