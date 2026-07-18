import "server-only";

import { getSession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export const getFocusTasks = async (localDate: string) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to load your focus tasks.");
  }

  const userId = session.user.id;

  const dailyFocusDay = await prisma.dailyFocusDay.findUnique({
    where: {
      userId_localDate: {
        userId,
        localDate,
      },
    },
    select: {
      id: true,
    },
  });

  if (!dailyFocusDay) {
    return [];
  }

  const tasks = await prisma.focusTask.findMany({
    where: { dailyFocusDayId: dailyFocusDay.id },
    select: {
      id: true,
      title: true,
      description: true,
      estimatedPomodoros: true,
      completedPomodoros: true,
    },
  });

  return tasks.map(({ description, ...task }) => ({
    ...task,
    description: description ?? undefined,
  }));
};
