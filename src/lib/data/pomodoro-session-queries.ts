import "server-only";

import prisma from "@/lib/prisma";
import { getLocalDateFromTimeZone } from "@/lib/utils/utils";

export function getCompletedPomodoros(userId: string, timeZone: string) {
  const localDate = getLocalDateFromTimeZone(timeZone);

  return prisma.pomodoroSession.count({
    where: {
      dailyFocusDay: {
        userId,
        localDate,
      },
    },
  });
}
