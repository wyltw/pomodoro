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
    expect(store.getState().activeTaskId).toBe(activeTask.id);
  });

  test("clears the active task after completing its final Pomodoro", () => {
    store.setState({
      tasks: [{ ...activeTask, completedPomodoros: 1 }, inactiveTask],
    });

    store.getState().completeActivePomodoro();

    expect(store.getState().tasks[0].completedPomodoros).toBe(2);
    expect(store.getState().activeTaskId).toBeUndefined();
  });

  test("does nothing when there is no active task", () => {
    store.setState({ activeTaskId: undefined });

    store.getState().completeActivePomodoro();

    expect(store.getState().tasks).toEqual([activeTask, inactiveTask]);
  });
});

describe("updateTask", () => {
  test("does not update a completed task", () => {
    const completedTask = { ...activeTask, completedPomodoros: 2 };
    const store = createDailyFocusTasksStore({
      shouldPersist: false,
      initialValues: {
        localDate: "2026-07-12",
        tasks: [completedTask],
        activeTaskId: completedTask.id,
      },
    });

    store.getState().updateTask(completedTask.id, {
      title: "Changed title",
      description: "Changed description",
      estimatedPomodoros: 3,
    });

    expect(store.getState().tasks).toEqual([completedTask]);
  });
});

describe("setActiveTask", () => {
  test("activates an existing task regardless of completion state", () => {
    const completedTask = { ...activeTask, completedPomodoros: 2 };
    const store = createDailyFocusTasksStore({
      shouldPersist: false,
      initialValues: {
        localDate: "2026-07-12",
        tasks: [completedTask],
        activeTaskId: undefined,
      },
    });

    store.getState().setActiveTask(completedTask.id);

    expect(store.getState().activeTaskId).toBe(completedTask.id);
  });

  test("clears the active task when selecting it again", () => {
    const store = createDailyFocusTasksStore({
      shouldPersist: false,
      initialValues: {
        localDate: "2026-08-18",
        tasks: [activeTask],
        activeTaskId: activeTask.id,
      },
    });

    store.getState().setActiveTask(activeTask.id);

    expect(store.getState().activeTaskId).toBeUndefined();
  });
});

describe("replaceTasks", () => {
  test("replaces tasks and clears an active task that no longer exists", () => {
    const store = createDailyFocusTasksStore({
      shouldPersist: false,
      initialValues: {
        localDate: "2026-07-12",
        tasks: [activeTask],
        activeTaskId: activeTask.id,
      },
    });

    store.getState().replaceTasks([inactiveTask]);

    expect(store.getState().tasks).toEqual([inactiveTask]);
    expect(store.getState().activeTaskId).toBeUndefined();
  });
});
