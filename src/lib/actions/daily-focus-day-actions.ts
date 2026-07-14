"use server";

import prisma from "../prisma";

export const getOrCreateDailyFocusDay = async (
  userId: string,
  localDate: string,
) => {
  return prisma.dailyFocusDay.upsert({
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
