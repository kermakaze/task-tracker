import { Priority } from "../../types/task.ts";

import React, { type FormEvent, useState } from "react";
import styles from "./TaskForm.module.css";
import AddIcon from "@mui/icons-material/Add";
import { getNextId } from "../../utils/idGenerator.ts";
import { useTasks } from "../../hooks/useTasks.ts";

const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

export const TaskForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") return;

    const newTask = {
      id: getNextId(),
      title,
      description,
      priority,
      isCompleted: false,
    };

    addTask(newTask);
    setTitle("");
    setDescription("");
    setPriority(Priority.LOW);
    if (onClose) onClose();
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus={true}
        className={styles.taskInput}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className={styles.taskSelect}
      >
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        className={styles.addBtn}
        type="submit"
        disabled={title.trim() === "" || description.trim() === ""}
      >
        <AddIcon /> Add Task <span className={styles.hintCommand}>⏎</span>
      </button>
    </form>
  );
};
