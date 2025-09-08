// src/context/__tests__/useTheme.test.tsx
import { renderHook, act } from "@testing-library/react";

import { describe, it, expect, beforeEach } from "vitest";
import { useTheme } from "./useTheme.ts";
import {
  ATTRIBUTE_KEY,
  DARK_THEME,
  LIGHT_THEME,
  THEME_PREFERENCE_KEY,
  ThemeProvider,
} from "../context/ThemeContext.tsx";

describe("useTheme hook", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.removeAttribute(ATTRIBUTE_KEY);
  });

  it("provides default light theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe(LIGHT_THEME);
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(LIGHT_THEME);
  });

  it("toggles theme and persists to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(DARK_THEME);
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(DARK_THEME);
    expect(localStorage.getItem(THEME_PREFERENCE_KEY)).toBe(DARK_THEME);
  });

  it("reads theme from localStorage on init", () => {
    localStorage.setItem(THEME_PREFERENCE_KEY, DARK_THEME);

    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe(DARK_THEME);
    expect(document.body.getAttribute(ATTRIBUTE_KEY)).toBe(DARK_THEME);
  });
});
