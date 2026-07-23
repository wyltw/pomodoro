import "server-only";

import prisma from "@/lib/prisma";
import { getLastSevenDays, getLocalDateFromTimeZone } from "@/lib/utils/utils";
import type { FocusStatisticsSession } from "@/lib/types/types";

export function getTodayPomodoroSessionCount(userId: string, timeZone: string) {
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

export async function getFocusStatisticsSessions(
  userId: string,
  timeZone: string,
): Promise<FocusStatisticsSession[]> {
  const localDate = getLocalDateFromTimeZone(timeZone);
  const localDates = getLastSevenDays(localDate, timeZone);
  const startDate = localDates[0];
  const endDate = localDates[localDates.length - 1];

  if (!startDate || !endDate) return [];

  const sessions = await prisma.pomodoroSession.findMany({
    where: {
      dailyFocusDay: {
        userId,
        localDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      id: true,
      durationSeconds: true,
      taskTitleSnapshot: true,
      dailyFocusDay: {
        select: { localDate: true },
      },
    },
    orderBy: { completedAt: "asc" },
  });

  return sessions.map(({ dailyFocusDay, ...session }) => ({
    ...session,
    localDate: dailyFocusDay.localDate,
  }));
}
