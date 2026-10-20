import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import FocusTaskPanel from "@/components/focus-task/focus-task-panel";
import { FocusTaskSidebar } from "@/components/focus-task/focus-task-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TimerStatusProvider } from "@/lib/contexts/timer-status-context";
import { AppProvider } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";

const { getFocusTasksMock } = vi.hoisted(() => ({
  getFocusTasksMock: vi.fn(),
}));

vi.mock("@/lib/hooks/auth-hooks", () => ({
  useAuthSession: () => ({
    isPending: false,
    isSignedIn: true,
    session: { user: { id: "signed-in-user" } },
  }),
}));

vi.mock("@/lib/api/focus-tasks", () => ({
  getFocusTasks: getFocusTasksMock,
}));

vi.mock("@/lib/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/lib/services/focus-task", () => ({
  completePomodoro: vi.fn(),
  createFocusTask: vi.fn(),
  deleteFocusTask: vi.fn(),
  updateFocusTask: vi.fn(),
}));

const serverTask: FocusTask = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Server task",
  description: "Read from the server",
  estimatedPomodoros: 2,
  completedPomodoros: 0,
};

describe("signed-in focus tasks", () => {
  test("selects a queried task and shows it in the task panel", async () => {
    getFocusTasksMock.mockResolvedValue([serverTask]);
    const user = userEvent.setup();

    render(
      <AppProvider>
        <TimerStatusProvider>
          <SidebarProvider>
            <FocusTaskSidebar />
            <FocusTaskPanel />
          </SidebarProvider>
        </TimerStatusProvider>
      </AppProvider>,
    );

    const taskButton = await screen.findByRole("button", {
      name: /Server task/,
    });
    await user.click(taskButton);

    expect(screen.getByText("Read from the server")).toBeTruthy();
    expect(screen.queryByText("No task selected")).toBeNull();
  });
});
