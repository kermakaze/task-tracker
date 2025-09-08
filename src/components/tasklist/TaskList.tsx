import { Priority, type Task } from "../../types/task.ts";
import { TaskItem } from "../taskitem/TaskItem.tsx";
import KitchenIcon from "@mui/icons-material/Kitchen";
import React, { useState } from "react";
import styles from "./TaskList.module.css";
import AddIcon from "@mui/icons-material/Add";

export const TaskList: React.FC<{
  onAddTask?: () => void;
  showAddButton?: boolean;
  tasks: Task[];
  filterApplied?: Priority | Priority.ALL;
}> = ({ onAddTask, showAddButton, filterApplied, tasks }) => {
  const [search, setSearch] = useState("");

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
      {searchedTasks.length === 0 ? (
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
        searchedTasks.map((task) => <TaskItem key={task.id} task={task} />)
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
