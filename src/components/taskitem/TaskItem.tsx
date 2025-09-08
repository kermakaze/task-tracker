import type { Task } from "../../types/task.ts";
import { useTasks } from "../../hooks/useTasks.ts";
import styles from "./TaskItem.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useState } from "react";
import { Priority } from "../../types/task.ts";

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);

  const priorityOptions = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

  const handleSave = () => {
    if (editTitle.trim() === "" || editDescription.trim() === "") return;
    updateTask({
      ...task,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  return (
    <div className={styles.taskItem}>
      {isEditing ? (
        <>
          <input
            className={styles.taskInput}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <select
            className={styles.taskSelect}
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              aria-label="Save"
              disabled={
                editTitle.trim() === "" || editDescription.trim() === ""
              }
            >
              <SaveIcon />
            </button>
            <button
              className={styles.cancelBtn}
              onClick={handleCancel}
              aria-label="Cancel"
            >
              <CancelIcon />
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>
            {task.title}
            <div style={{ float: "right" }}>
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
                aria-label="Edit"
              >
                <EditIcon />
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteTask(task.id)}
                aria-label="Delete"
              >
                <DeleteIcon />
              </button>
            </div>
          </h3>
          <p>{task.description}</p>
          <div
            className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}
          >
            {task.priority}
          </div>
          <div className={`${styles.id}`}>ST-{task.id}</div>
        </>
      )}
    </div>
  );
};
