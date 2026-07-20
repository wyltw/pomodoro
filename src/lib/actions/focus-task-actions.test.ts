import { beforeEach, describe, expect, test, vi } from "vitest";

import { completePomodoro } from "@/lib/actions/focus-task-actions";

const {
  dailyFocusDayUpdateMock,
  dailyFocusDayUpsertMock,
  focusTaskCreateMock,
  focusTaskDeleteManyMock,
  focusTaskFindFirstMock,
  focusTaskUpdateManyMock,
  getSessionMock,
  transactionMock,
} = vi.hoisted(() => {
  const dailyFocusDayUpdate = vi.fn();
  const dailyFocusDayUpsert = vi.fn();
  const focusTaskCreate = vi.fn();
  const focusTaskDeleteMany = vi.fn();
  const focusTaskFindFirst = vi.fn();
  const focusTaskUpdateMany = vi.fn();
  const getSession = vi.fn();
  const transactionClient = {
    dailyFocusDay: {
      update: dailyFocusDayUpdate,
      upsert: dailyFocusDayUpsert,
    },
    focusTask: {
      create: focusTaskCreate,
      findFirst: focusTaskFindFirst,
      updateMany: focusTaskUpdateMany,
    },
  };
  const transaction = vi.fn(
    async (operation: (client: typeof transactionClient) => Promise<unknown>) =>
      operation(transactionClient),
  );

  return {
    dailyFocusDayUpdateMock: dailyFocusDayUpdate,
    dailyFocusDayUpsertMock: dailyFocusDayUpsert,
    focusTaskCreateMock: focusTaskCreate,
    focusTaskDeleteManyMock: focusTaskDeleteMany,
    focusTaskFindFirstMock: focusTaskFindFirst,
    focusTaskUpdateManyMock: focusTaskUpdateMany,
    getSessionMock: getSession,
    transactionMock: transaction,
  };
});

vi.mock("@/lib/dal", () => ({ getSession: getSessionMock }));

vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: transactionMock,
    focusTask: {
      create: focusTaskCreateMock,
      deleteMany: focusTaskDeleteManyMock,
      findFirst: focusTaskFindFirstMock,
      updateMany: focusTaskUpdateManyMock,
    },
  },
}));

const taskId = "123e4567-e89b-12d3-a456-426614174000";
const payload = { taskId, timeZone: "Asia/Taipei" };

beforeEach(() => {
  dailyFocusDayUpdateMock.mockReset();
  dailyFocusDayUpsertMock.mockReset();
  focusTaskCreateMock.mockReset();
  focusTaskDeleteManyMock.mockReset();
  focusTaskFindFirstMock.mockReset();
  focusTaskUpdateManyMock.mockReset();
  getSessionMock.mockReset();
  transactionMock.mockClear();

  getSessionMock.mockResolvedValue({ user: { id: "user-1" } });
  dailyFocusDayUpsertMock.mockResolvedValue({ id: "day-1" });
  dailyFocusDayUpdateMock.mockResolvedValue({});
});

describe("completePomodoro", () => {
  test("increments only the daily total without a focus task", async () => {
    await expect(
      completePomodoro({ timeZone: "Asia/Taipei" }),
    ).resolves.toEqual({});

    expect(focusTaskFindFirstMock).not.toHaveBeenCalled();
    expect(focusTaskUpdateManyMock).not.toHaveBeenCalled();
    expect(dailyFocusDayUpdateMock).toHaveBeenCalledWith({
      where: { id: "day-1" },
      data: { completedPomodoros: { increment: 1 } },
    });
  });

  test("increments the task and reports when it becomes complete", async () => {
    focusTaskFindFirstMock.mockResolvedValue({
      completedPomodoros: 1,
      estimatedPomodoros: 2,
    });
    focusTaskUpdateManyMock.mockResolvedValue({ count: 1 });

    await expect(completePomodoro(payload)).resolves.toEqual({
      completedTaskId: taskId,
    });

    expect(focusTaskFindFirstMock).toHaveBeenCalledWith({
      where: { id: taskId, dailyFocusDayId: "day-1" },
      select: {
        completedPomodoros: true,
        estimatedPomodoros: true,
      },
    });
    expect(focusTaskUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: taskId,
        dailyFocusDayId: "day-1",
        completedPomodoros: 1,
      },
      data: { completedPomodoros: 2 },
    });
    expect(dailyFocusDayUpdateMock).toHaveBeenCalledOnce();
  });

  test("rejects a completed task without incrementing the daily total", async () => {
    focusTaskFindFirstMock.mockResolvedValue({
      completedPomodoros: 2,
      estimatedPomodoros: 2,
    });

    await expect(completePomodoro(payload)).rejects.toThrow(
      "This focus task is already complete.",
    );

    expect(focusTaskUpdateManyMock).not.toHaveBeenCalled();
    expect(dailyFocusDayUpdateMock).not.toHaveBeenCalled();
  });

  test("rejects a task outside the current focus day", async () => {
    focusTaskFindFirstMock.mockResolvedValue(null);

    await expect(completePomodoro(payload)).rejects.toThrow(
      "Focus task not found.",
    );

    expect(focusTaskUpdateManyMock).not.toHaveBeenCalled();
    expect(dailyFocusDayUpdateMock).not.toHaveBeenCalled();
  });
});
