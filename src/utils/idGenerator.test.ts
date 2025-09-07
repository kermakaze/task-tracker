import { getNextId, LAST_SAVED_TASK_ID_KEY } from "./idGenerator";
import { describe, it, expect, beforeEach } from "vitest";

describe("getNextId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return 1 if no id is stored", () => {
    expect(getNextId()).toBe(1);
    expect(localStorage.getItem(LAST_SAVED_TASK_ID_KEY)).toBe("1");
  });

  it("should increment the id if one is already stored", () => {
    localStorage.setItem(LAST_SAVED_TASK_ID_KEY, "5");
    expect(getNextId()).toBe(6);
    expect(localStorage.getItem(LAST_SAVED_TASK_ID_KEY)).toBe("6");
  });

  it("should handle invalid stored id gracefully", () => {
    localStorage.setItem(LAST_SAVED_TASK_ID_KEY, "not-a-number");
    expect(getNextId()).toBe(1);
    expect(localStorage.getItem(LAST_SAVED_TASK_ID_KEY)).toBe("1");
  });

  it("should generate sequential IDs", () => {
    expect(getNextId()).toBe(1);
    expect(getNextId()).toBe(2);
    expect(getNextId()).toBe(3);
  });
});
