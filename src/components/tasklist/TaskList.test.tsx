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
  {
    id: 3,
    title: "Another",
    description: "Special Description",
    priority: Priority.LOW,
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
    expect(screen.getByText("Another")).toBeInTheDocument();
  });

  it("renders 'No tasks available.' message if filtered tasks is empty", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          filterApplied={Priority.MEDIUM}
          showAddButton={true}
        />
      </TaskProvider>,
    );
    expect(screen.getByText(/no tasks available/i)).toBeInTheDocument();
  });

  it("renders add button if showAddButton is true", () => {
    render(
      <TaskProvider>
        <TaskList tasks={tasks} showAddButton={true} />
      </TaskProvider>,
    );
    expect(
      screen.getByRole("button", { name: /add new task/i }),
    ).toBeInTheDocument();
  });

  it("does not render add button if showAddButton is false", () => {
    render(
      <TaskProvider>
        <TaskList tasks={tasks} showAddButton={false} />
      </TaskProvider>,
    );
    expect(
      screen.queryByRole("button", { name: /add new task/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onAddTask when add button is clicked", () => {
    const onAddTask = vi.fn();
    render(
      <TaskProvider>
        <TaskList tasks={tasks} showAddButton={true} onAddTask={onAddTask} />,
      </TaskProvider>,
    );
    const addBtn = screen.getByRole("button", { name: /add new task/i });
    fireEvent.click(addBtn);
    expect(onAddTask).toHaveBeenCalled();
  });

  it("filters tasks by search input (title)", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          showAddButton={false}
          filterApplied={Priority.ALL}
        />
      </TaskProvider>,
    );
    const searchInput = screen.getByPlaceholderText(
      /search by title or description/i,
    );
    fireEvent.change(searchInput, { target: { value: "Another" } });
    expect(screen.getByText("Another")).toBeInTheDocument();
    expect(screen.queryByText("Task One")).not.toBeInTheDocument();
    expect(screen.queryByText("Task Two")).not.toBeInTheDocument();
  });

  it("filters tasks by search input (description)", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          showAddButton={false}
          filterApplied={Priority.ALL}
        />
      </TaskProvider>,
    );
    const searchInput = screen.getByPlaceholderText(
      /search by title or description/i,
    );
    fireEvent.change(searchInput, { target: { value: "Special" } });
    expect(screen.getByText("Another")).toBeInTheDocument();
    expect(screen.queryByText("Task One")).not.toBeInTheDocument();
    expect(screen.queryByText("Task Two")).not.toBeInTheDocument();
  });

  it("shows 'No tasks available.' if search yields no results", () => {
    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          showAddButton={false}
          filterApplied={Priority.ALL}
        />
      </TaskProvider>,
    );
    const searchInput = screen.getByPlaceholderText(
      /search by title or description/i,
    );
    fireEvent.change(searchInput, { target: { value: "notfound" } });
    expect(screen.getByText(/no tasks available/i)).toBeInTheDocument();
  });

  it("reorders tasks via drag and drop", () => {
    //Use the real TaskItem for this test to validate DOM order
    vi.unmock("./TaskItem");

    render(
      <TaskProvider>
        <TaskList
          tasks={tasks}
          showAddButton={false}
          filterApplied={Priority.ALL}
        />
      </TaskProvider>,
    );

    // Find draggable containers by test id
    const taskOne = screen.getByTestId("draggable-task-1");
    const taskTwo = screen.getByTestId("draggable-task-2");

    // Simulate drag and drop: drag taskOne below taskTwo
    fireEvent.dragStart(taskOne);
    fireEvent.dragOver(taskTwo);
    fireEvent.drop(taskTwo);

    // After drag and drop, the order in the DOM should be [Task Two, Task One, Another]
    const allTasks = screen.getAllByTestId(/draggable-task-/);
    const titles = allTasks.map((el) => el.textContent);
    // The first two should be Task Two and Task One in new order
    expect(titles[0]).toContain("Task Two");
    expect(titles[1]).toContain("Task One");
  });
});
