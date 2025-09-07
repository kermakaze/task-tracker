import "./App.css";
import { TaskForm } from "./components/taskform/TaskForm.tsx";
import { TaskList } from "./components/tasklist/TaskList.tsx";
import { useState } from "react";
import { useTasks } from "./hooks/useTasks.ts";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const { tasks, filterApplied } = useTasks();

  return (
    <div className={"app"}>
      <h1>Task Tracker</h1>
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
