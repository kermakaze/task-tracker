import { Priority, type Task } from "../../types/task.ts";
import { TaskItem } from "../taskitem/TaskItem.tsx";
import KitchenIcon from "@mui/icons-material/Kitchen";
import React, { useState } from "react";
import styles from "./TaskList.module.css";
import AddIcon from "@mui/icons-material/Add";
import { useTasks } from "../../hooks/useTasks.ts";

export const TaskList: React.FC<{
  onAddTask?: () => void;
  showAddButton?: boolean;
  tasks: Task[];
  filterApplied?: Priority | Priority.ALL;
}> = ({ onAddTask, showAddButton, filterApplied, tasks }) => {
  const [search, setSearch] = useState("");
  const { reorderTasks } = useTasks();

  // Maintain local order for drag-and-drop
  const [orderedIds, setOrderedIds] = useState(tasks.map((t) => t.id));

  // Sync local order if tasks change (e.g. add/delete)
  React.useEffect(() => {
    setOrderedIds(tasks.map((t) => t.id));
  }, [tasks]);

  const filteredTasks =
    filterApplied === Priority.ALL
      ? tasks
      : tasks.filter((task) => task.priority === filterApplied);

  const searchedTasks = search.trim()
    ? filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.trim().toLowerCase()) ||
          task.description.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : filteredTasks;

  // Order tasks according to orderedIds
  const orderedTasks = orderedIds
    .map((id) => searchedTasks.find((t) => t.id === id))
    .filter(Boolean) as Task[];

  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;
    const newOrder = [...orderedIds];
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(id);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);
    setOrderedIds(newOrder);
  };

  const handleDrop = () => {
    setDraggedId(null);
    // Only reorder if search is not active
    if (!search.trim()) {
      const newOrderedTasks = orderedIds
        .map((id) => tasks.find((t) => t.id === id))
        .filter(Boolean) as Task[];
      reorderTasks(newOrderedTasks);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="text"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
        style={{
          marginBottom: 16,
          padding: 8,
          borderRadius: 6,
          border: "1px solid #bdbdbd",
          fontSize: "1rem",
        }}
      />
      {orderedTasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", marginTop: 40 }}>
          <KitchenIcon
            fontSize="large"
            style={{
              width: 120,
              opacity: 0.7,
              display: "block",
              margin: "0 auto 12px",
            }}
          />
          No tasks available.
        </p>
      ) : (
        orderedTasks.map((task) => (
          <div
            key={task.id}
            draggable={!search.trim()}
            onDragStart={() => handleDragStart(task.id)}
            onDragOver={(e) => handleDragOver(e, task.id)}
            onDrop={handleDrop}
            style={{
              opacity: draggedId === task.id ? 0.5 : 1,
              cursor: !search.trim() ? "grab" : "default",
            }}
            data-testid={`draggable-task-${task.id}`}
          >
            <TaskItem task={task} />
          </div>
        ))
      )}
      {showAddButton && (
        <button
          className={styles.addTaskBtn}
          onClick={onAddTask}
          style={{
            float: "right",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AddIcon /> Add New Task <span className={styles.hintCommand}>N</span>
        </button>
      )}
    </div>
  );
};
