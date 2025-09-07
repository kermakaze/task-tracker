import React from "react";
import { useTasks } from "../../hooks/useTasks.ts";
import { Priority } from "../../types/task.ts";
import styles from "./PriorityFilter.module.css";

export const PriorityFilter: React.FC = () => {
  const { filterApplied, setFilterApplied } = useTasks();
  const options: Priority[] = [
    Priority.ALL,
    Priority.LOW,
    Priority.MEDIUM,
    Priority.HIGH,
  ];

  return (
    <div>
      <span>Filter by </span>
      <select
        className={styles.priorityFilter}
        value={filterApplied}
        onChange={(e) =>
          setFilterApplied(e.target.value as Priority | Priority.ALL)
        }
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
