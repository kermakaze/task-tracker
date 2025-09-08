import React, { useEffect, useState } from "react";
import type { Theme } from "./ThemeContext.ts";
import { ThemeContext } from "./ThemeContext";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

export const THEME_PREFERENCE_KEY = "theme";
export const ATTRIBUTE_KEY = "data-theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Retrieve from localStorage or default to 'light'
    return (localStorage.getItem(THEME_PREFERENCE_KEY) as Theme) || LIGHT_THEME;
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_PREFERENCE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
