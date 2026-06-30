import { beforeEach, describe, expect, test } from "vitest";

import type { FocusTask } from "@/lib/types/types";
import { useDailyFocusTasksStore } from "./daily-focus-tasks-store";

const activeTask: FocusTask = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Active task",
  description: "",
  estimatedPomodoros: 2,
  completedPomodoros: 0,
};

const inactiveTask: FocusTask = {
  ...activeTask,
  id: "123e4567-e89b-12d3-a456-426614174001",
  title: "Inactive task",
};

describe("completeActivePomodoro", () => {
  beforeEach(() => {
    useDailyFocusTasksStore.setState({
      tasks: [activeTask, inactiveTask],
      activeTaskId: activeTask.id,
    });
  });

  test("increments only the active task", () => {
    useDailyFocusTasksStore.getState().completeActivePomodoro();

    const [updatedActiveTask, updatedInactiveTask] =
      useDailyFocusTasksStore.getState().tasks;

    expect(updatedActiveTask.completedPomodoros).toBe(1);
    expect(updatedInactiveTask.completedPomodoros).toBe(0);
  });

  test("does nothing when there is no active task", () => {
    useDailyFocusTasksStore.setState({ activeTaskId: undefined });

    useDailyFocusTasksStore.getState().completeActivePomodoro();

    expect(useDailyFocusTasksStore.getState().tasks).toEqual([
      activeTask,
      inactiveTask,
    ]);
  });
});
