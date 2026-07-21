"use server";

import { getSession } from "../dal";
import prisma from "../prisma";
import { getOrCreateDailyFocusDay } from "./daily-focus-day";
import { createPomodoroSession } from "./pomodoro-session";
import type {
  CompletePomodoroPayload,
  CompletePomodoroResult,
  CreateFocusTaskPayload,
  UpdateFocusTaskPayload,
} from "../types/types";
import {
  completePomodoroPayloadSchema,
  createFocusTaskPayloadSchema,
  focusTaskIdSchema,
  updateFocusTaskPayloadSchema,
} from "../schemas";

const focusTaskNotFoundError = "Focus task not found.";

export const createFocusTask = async (payload: CreateFocusTaskPayload) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to create a focus task.");
  }

  const userId = session.user.id;

  const parsedPayload = createFocusTaskPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) throw new Error(parsedPayload.error.message);
  const { description, estimatedPomodoros, timeZone, title } =
    parsedPayload.data;

  await prisma.$transaction(async (transaction) => {
    const dailyFocusDay = await getOrCreateDailyFocusDay(
      transaction,
      userId,
      timeZone,
    );

    await transaction.focusTask.create({
      data: {
        title,
        description,
        estimatedPomodoros,
        dailyFocusDayId: dailyFocusDay.id,
      },
    });
  });
};

export const completePomodoro = async (
  payload: CompletePomodoroPayload,
): Promise<CompletePomodoroResult> => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to complete a Pomodoro.");
  }

  const parsedPayload = completePomodoroPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) throw new Error(parsedPayload.error.message);

  const { durationSeconds, taskId, timeZone } = parsedPayload.data;
  return prisma.$transaction(async (transaction) => {
    const dailyFocusDay = await getOrCreateDailyFocusDay(
      transaction,
      session.user.id,
      timeZone,
    );
    let completedTaskId: string | undefined;
    let focusTask: { id: string; title: string } | undefined;

    if (taskId) {
      const task = await transaction.focusTask.findFirst({
        where: { id: taskId },
        select: {
          completedPomodoros: true,
          dailyFocusDayId: true,
          estimatedPomodoros: true,
          title: true,
        },
      });

      if (task && task.dailyFocusDayId !== dailyFocusDay.id) {
        throw new Error("Focus task is not available for this focus day.");
      }

      if (task && task.completedPomodoros < task.estimatedPomodoros) {
        const nextCompletedPomodoros = task.completedPomodoros + 1;
        const result = await transaction.focusTask.updateMany({
          where: {
            id: taskId,
            dailyFocusDayId: dailyFocusDay.id,
            completedPomodoros: task.completedPomodoros,
          },
          data: { completedPomodoros: nextCompletedPomodoros },
        });

        if (result.count === 0) {
          throw new Error("Unable to record this Pomodoro. Please try again.");
        }

        focusTask = { id: taskId, title: task.title };
        if (nextCompletedPomodoros >= task.estimatedPomodoros) {
          completedTaskId = taskId;
        }
      }
    }

    await createPomodoroSession(transaction, {
      dailyFocusDayId: dailyFocusDay.id,
      durationSeconds,
      focusTask,
    });

    return completedTaskId ? { completedTaskId } : {};
  });
};

export const updateFocusTask = async (
  taskId: string,
  payload: UpdateFocusTaskPayload,
) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to update a focus task.");
  }

  const parsedTaskId = focusTaskIdSchema.safeParse(taskId);
  const parsedPayload = updateFocusTaskPayloadSchema.safeParse(payload);
  if (!parsedTaskId.success) throw new Error(parsedTaskId.error.message);
  if (!parsedPayload.success) throw new Error(parsedPayload.error.message);

  const userId = session.user.id;
  const task = await prisma.focusTask.findFirst({
    where: {
      id: parsedTaskId.data,
      dailyFocusDay: { userId },
    },
    select: {
      completedPomodoros: true,
      estimatedPomodoros: true,
    },
  });

  if (!task) throw new Error(focusTaskNotFoundError);
  if (task.completedPomodoros >= task.estimatedPomodoros) {
    throw new Error("Completed focus tasks cannot be updated.");
  }

  const { title, description, estimatedPomodoros } = parsedPayload.data;
  if (estimatedPomodoros < task.completedPomodoros) {
    throw new Error(
      `Estimated Pomodoros cannot be less than the ${task.completedPomodoros} already completed.`,
    );
  }

  const result = await prisma.focusTask.updateMany({
    where: {
      id: parsedTaskId.data,
      dailyFocusDay: { userId },
    },
    data: {
      title,
      description,
      estimatedPomodoros,
    },
  });

  if (result.count === 0) throw new Error(focusTaskNotFoundError);
};

export const deleteFocusTask = async (taskId: string) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to delete a focus task.");
  }

  const parsedTaskId = focusTaskIdSchema.safeParse(taskId);
  if (!parsedTaskId.success) throw new Error(parsedTaskId.error.message);

  const result = await prisma.focusTask.deleteMany({
    where: {
      id: parsedTaskId.data,
      dailyFocusDay: { userId: session.user.id },
    },
  });

  if (result.count === 0) throw new Error(focusTaskNotFoundError);
};
