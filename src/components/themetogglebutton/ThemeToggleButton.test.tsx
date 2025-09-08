import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { describe, it, beforeEach, expect } from "vitest";
import {
  ATTRIBUTE_KEY,
  DARK_THEME,
  THEME_PREFERENCE_KEY,
  ThemeProvider,
} from "../../context/ThemeContext.tsx";
import { LIGHT_THEME } from "../../context/ThemeContext.tsx";

describe("ThemeToggleButton", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.removeAttribute(ATTRIBUTE_KEY);
  });

  it("renders light mode by default and toggles to dark mode", () => {
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    // Button shows dark mode toggle initially
    expect(screen.getByText(/dark mode/i)).toBeInTheDocument();
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(LIGHT_THEME);

    // Click it -> switches to dark
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText(/light mode/i)).toBeInTheDocument();
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(DARK_THEME);
    expect(localStorage.getItem(THEME_PREFERENCE_KEY)).toBe(DARK_THEME);
  });

  it("persists theme from localStorage", () => {
    localStorage.setItem(THEME_PREFERENCE_KEY, DARK_THEME);

    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    // Should start as dark
    expect(screen.getByText(/light mode/i)).toBeInTheDocument();
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(DARK_THEME);
  });
});
