"use server";

import { getSession } from "../dal";
import prisma from "../prisma";
import type {
  CreateFocusTaskPayload,
  UpdateFocusTaskPayload,
} from "../types/types";
import { getLocalDateFromTimeZone } from "../utils/utils";
import {
  createFocusTaskPayloadSchema,
  focusTaskIdSchema,
  timeZoneSchema,
  updateFocusTaskPayloadSchema,
} from "../schemas";

const focusTaskNotFoundError = "Focus task not found.";

export const createFocusTask = async (
  payload: CreateFocusTaskPayload,
  timeZone: string,
) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to create a focus task.");
  }

  const userId = session.user.id;

  const parsedPayload = createFocusTaskPayloadSchema.safeParse(payload);
  const parsedTimeZone = timeZoneSchema.safeParse(timeZone);
  if (!parsedPayload.success) throw new Error(parsedPayload.error.message);
  if (!parsedTimeZone.success) throw new Error(parsedTimeZone.error.message);
  const { title, description, estimatedPomodoros } = parsedPayload.data;

  const localDate = getLocalDateFromTimeZone(parsedTimeZone.data);
  await prisma.$transaction(async (transaction) => {
    const dailyFocusDay = await transaction.dailyFocusDay.upsert({
      where: {
        userId_localDate: {
          userId,
          localDate,
        },
      },
      update: {},
      create: {
        userId,
        localDate,
      },
      select: { id: true },
    });

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
    select: { completedPomodoros: true },
  });

  if (!task) throw new Error(focusTaskNotFoundError);

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
      description: description ?? null,
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
