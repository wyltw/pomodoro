import "server-only";

import { getSession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { getOrCreateDailyFocusDay } from "@/lib/services/daily-focus-day";

export const getFocusTasks = async (timeZone: string) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to load your focus tasks.");
  }

  const userId = session.user.id;
  const tasks = await prisma.$transaction(async (transaction) => {
    const dailyFocusDay = await getOrCreateDailyFocusDay(
      transaction,
      userId,
      timeZone,
    );

    await transaction.focusTask.updateMany({
      where: {
        dailyFocusDay: {
          userId,
          localDate: { lt: dailyFocusDay.localDate },
        },
        completedPomodoros: {
          lt: transaction.focusTask.fields.estimatedPomodoros,
        },
      },
      data: { dailyFocusDayId: dailyFocusDay.id },
    });

    return transaction.focusTask.findMany({
      where: { dailyFocusDayId: dailyFocusDay.id },
      select: {
        id: true,
        title: true,
        description: true,
        estimatedPomodoros: true,
        completedPomodoros: true,
      },
    });
  });

  return tasks.map(({ description, ...task }) => ({
    ...task,
    description: description ?? undefined,
  }));
};
