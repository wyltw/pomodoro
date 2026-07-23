import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { getLocalDateFromTimeZone } from "@/lib/utils/utils";

export function getOrCreateDailyFocusDay(
  transaction: Prisma.TransactionClient | PrismaClient,
  userId: string,
  timeZone: string,
) {
  const localDate = getLocalDateFromTimeZone(timeZone);

  return transaction.dailyFocusDay.upsert({
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
    select: { id: true, localDate: true },
  });
}
