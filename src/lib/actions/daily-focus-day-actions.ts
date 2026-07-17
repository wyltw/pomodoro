"use server";

import { cookies } from "next/headers";

import { getSession } from "@/lib/dal";
import prisma from "../prisma";

export const getOrCreateDailyFocusDay = async (
  localDate: string,
  timezone: string,
) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to initialize your daily focus day.");
  }

  const userId = session.user.id;
  const cookieStore = await cookies();
  cookieStore.set("timezone", timezone, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

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
