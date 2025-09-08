import "./App.css";
import { TaskForm } from "./components/taskform/TaskForm.tsx";
import { TaskList } from "./components/tasklist/TaskList.tsx";
import { useEffect, useState } from "react";
import { useTasks } from "./hooks/useTasks.ts";
import { PriorityFilter } from "./components/priorityfilter/PriorityFilter.tsx";
import { ThemeToggleButton } from "./components/themetogglebutton/ThemeToggleButton.tsx";

const NEW_TASK_HOTKEY = "n";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const { tasks, filterApplied } = useTasks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === NEW_TASK_HOTKEY.toLowerCase() && !showForm) {
        e.preventDefault();
        setShowForm(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForm]);
  return (
    <div className={"app"}>
      <h1>Task Tracker</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PriorityFilter />
        <ThemeToggleButton />
      </div>

      <TaskList
        tasks={tasks}
        filterApplied={filterApplied}
        onAddTask={handleAddTask}
        showAddButton={!showForm}
      />
      {showForm && <TaskForm onClose={handleCloseForm} />}
    </div>
  );
}

export default App;
