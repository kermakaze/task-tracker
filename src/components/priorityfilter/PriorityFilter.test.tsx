import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PriorityFilter } from "./PriorityFilter";
import { Priority } from "../../types/task";

// Mock useTasks to control filterApplied and setFilterApplied
const setFilterAppliedMock = vi.fn();
let filterAppliedValue: Priority | Priority.ALL = Priority.ALL;

vi.mock("../../hooks/useTasks", () => ({
  useTasks: () => ({
    filterApplied: filterAppliedValue,
    setFilterApplied: setFilterAppliedMock,
  }),
}));

describe("PriorityFilter", () => {
  beforeEach(() => {
    setFilterAppliedMock.mockReset();
    filterAppliedValue = Priority.ALL;
  });

  it("renders all priority options", () => {
    render(<PriorityFilter />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText(Priority.ALL)).toBeInTheDocument();
    expect(screen.getByText(Priority.LOW)).toBeInTheDocument();
    expect(screen.getByText(Priority.MEDIUM)).toBeInTheDocument();
    expect(screen.getByText(Priority.HIGH)).toBeInTheDocument();
  });

  it("select reflects current filterApplied value", () => {
    filterAppliedValue = Priority.HIGH;
    render(<PriorityFilter />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue(Priority.HIGH);
  });

  it("calls setFilterApplied when a new priority is selected", () => {
    render(<PriorityFilter />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: Priority.MEDIUM } });
    expect(setFilterAppliedMock).toHaveBeenCalledWith(Priority.MEDIUM);
  });
});
