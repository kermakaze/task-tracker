import React from "react";
import { useTheme } from "../../hooks/useTheme.ts";
import { LIGHT_THEME } from "../../context/ThemeContext.tsx";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "var(--text-color)",
        color: "var(--bg-color)",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      {theme === LIGHT_THEME ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};
