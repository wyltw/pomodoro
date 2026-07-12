import { beforeEach, describe, expect, test } from "vitest";

import type { FocusTask } from "@/lib/types/types";
import { createDailyFocusTasksStore } from "./daily-focus-tasks-store";

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
  let store: ReturnType<typeof createDailyFocusTasksStore>;

  beforeEach(() => {
    store = createDailyFocusTasksStore({
      shouldPersist: false,
      initialValues: {
        localDate: "2026-07-12",
        tasks: [activeTask, inactiveTask],
        activeTaskId: activeTask.id,
      },
    });
  });

  test("increments only the active task", () => {
    store.getState().completeActivePomodoro();

    const [updatedActiveTask, updatedInactiveTask] = store.getState().tasks;

    expect(updatedActiveTask.completedPomodoros).toBe(1);
    expect(updatedInactiveTask.completedPomodoros).toBe(0);
  });

  test("does nothing when there is no active task", () => {
    store.setState({ activeTaskId: undefined });

    store.getState().completeActivePomodoro();

    expect(store.getState().tasks).toEqual([activeTask, inactiveTask]);
  });
});
