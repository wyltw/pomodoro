"use server";

import { cookies } from "next/headers";

import { getSession } from "../dal";
import prisma from "../prisma";
import type { CreateFocusTaskPayload } from "../types/types";
import { getLocalDateFromTimeZone } from "../utils/utils";
import { createFocusTaskPayloadSchema } from "../schemas";

export const createFocusTask = async (payload: CreateFocusTaskPayload) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Please sign in to create a focus task.");
  }

  const userId = session.user.id;

  const parsedPayload = createFocusTaskPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) throw new Error(parsedPayload.error.message);
  const { title, description, estimatedPomodoros } = parsedPayload.data;

  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone");
  if (!timezone) {
    throw new Error("Timezone is not initialized.");
  }

  const localDate = getLocalDateFromTimeZone(timezone.value);
  await prisma.focusTask.create({
    data: {
      title,
      description,
      estimatedPomodoros,
      dailyFocusDay: {
        connect: {
          userId_localDate: {
            userId,
            localDate,
          },
        },
      },
    },
  });
};
