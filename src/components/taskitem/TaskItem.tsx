import type { Task } from "../../types/task.ts";
import { useTasks } from "../../hooks/useTasks.ts";
import styles from "./TaskItem.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask } = useTasks();

  return (
    <div className={styles.taskItem}>
      <h3>
        {task.title}
        <button
          className={styles.deleteBtn}
          onClick={() => deleteTask(task.id)}
          aria-label="Delete"
        >
          <DeleteIcon />
        </button>
      </h3>

      <p>{task.description}</p>
      <div
        className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}
      >
        {task.priority}
      </div>

      <div className={`${styles.id}`}>ST-{task.id}</div>
    </div>
  );
};
