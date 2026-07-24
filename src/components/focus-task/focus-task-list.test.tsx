import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { FocusTaskList } from "@/components/focus-task/focus-task-list";
import {
  TimerStatusProvider,
  useTimerStatus,
} from "@/lib/contexts/timer-status-context";
import type { FocusTask } from "@/lib/types/types";

const task: FocusTask = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Write integration test",
  description: "",
  estimatedPomodoros: 2,
  completedPomodoros: 0,
};

function TimerStatusControl() {
  const { setStatus } = useTimerStatus();

  return (
    <button type="button" onClick={() => setStatus("running")}>
      Set timer running
    </button>
  );
}

describe("FocusTaskList", () => {
  test("allows completed task selection for displaying its details", () => {
    const onItemClick = vi.fn();
    const completedTask = { ...task, completedPomodoros: 2 };

    render(
      <TimerStatusProvider>
        <FocusTaskList
          tasks={[completedTask]}
          activeTaskId={undefined}
          onItemClick={onItemClick}
        />
      </TimerStatusProvider>,
    );

    const taskButton = screen.getByRole("button", {
      name: /Write integration test/,
    }) as HTMLButtonElement;

    expect(taskButton.disabled).toBe(false);
    fireEvent.click(taskButton);
    expect(onItemClick).toHaveBeenCalledWith(completedTask.id);
  });

  test("disables task selection while the timer is running", () => {
    const onItemClick = vi.fn();

    render(
      <TimerStatusProvider>
        <TimerStatusControl />
        <FocusTaskList
          tasks={[task]}
          activeTaskId={task.id}
          onItemClick={onItemClick}
        />
      </TimerStatusProvider>,
    );

    const taskButton = screen.getByRole("button", {
      name: /Write integration test/,
    }) as HTMLButtonElement;

    expect(taskButton.disabled).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Set timer running" }));

    expect(taskButton.disabled).toBe(true);
  });
});
