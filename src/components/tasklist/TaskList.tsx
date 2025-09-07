import { Priority, type Task } from "../../types/task.ts";
import { TaskItem } from "../taskitem/TaskItem.tsx";
import KitchenIcon from "@mui/icons-material/Kitchen";
import React from "react";
import styles from "./TaskList.module.css";

export const TaskList: React.FC<{
  onAddTask?: () => void;
  showAddButton?: boolean;
  tasks: Task[];
  filterApplied?: Priority | Priority.ALL;
}> = ({ onAddTask, showAddButton, filterApplied, tasks }) => {
  const filteredTasks =
    filterApplied === Priority.ALL
      ? tasks
      : tasks.filter((task) => task.priority === filterApplied);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {filteredTasks.length === 0 ? (
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
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
      {showAddButton && (
        <button className={styles.addTaskBtn} onClick={onAddTask}>
          Add New Task
        </button>
      )}
    </div>
  );
};
