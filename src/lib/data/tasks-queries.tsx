import "server-only";

import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export const getCurrentUserTasks = async (localDate: string) => {
  const { userId } = await verifySession();

  const dailyFocusDay = await prisma.dailyFocusDay.findUnique({
    where: {
      userId_localDate: {
        userId,
        localDate,
      },
    },
  });

  if (!dailyFocusDay) {
    return [];
  }

  return prisma.focusTask.findMany({
    where: { dailyFocusDayId: dailyFocusDay.id },
  });
};
