"use server";

import prisma from "../prisma";
import { verifySession } from "@/lib/dal";

export const getOrCreateDailyFocusDay = async (localDate: string) => {
  const { userId } = await verifySession();

  await prisma.dailyFocusDay.upsert({
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
  });
};
