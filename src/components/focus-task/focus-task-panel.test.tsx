import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import FocusTaskPanel from "@/components/focus-task/focus-task-panel";
import {
  TimerStatusProvider,
  useTimerStatus,
} from "@/lib/contexts/timer-status-context";
import { AppProvider } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";

vi.mock("@/lib/hooks/auth-hooks", () => ({
  useAuthSession: () => ({
    isPending: false,
    isSignedIn: false,
    session: null,
  }),
}));

vi.mock("@/lib/services/focus-task", () => ({
  completePomodoro: vi.fn(),
  createFocusTask: vi.fn(),
  deleteFocusTask: vi.fn(),
  updateFocusTask: vi.fn(),
}));

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

describe("FocusTaskPanel", () => {
  test("disables deleting the active task while the timer is running", async () => {
    const user = userEvent.setup();

    render(
      <AppProvider
        initialValues={{
          activeTaskId: task.id,
          localDate: "2026-10-19",
          tasks: [task],
        }}
      >
        <TimerStatusProvider>
          <TimerStatusControl />
          <FocusTaskPanel />
        </TimerStatusProvider>
      </AppProvider>,
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete task",
    }) as HTMLButtonElement;
    const setTimerRunningButton = screen.getByRole("button", {
      name: "Set timer running",
    });
    expect(deleteButton.disabled).toBe(false);

    await user.click(setTimerRunningButton);

    expect(deleteButton.disabled).toBe(true);
  });
});
