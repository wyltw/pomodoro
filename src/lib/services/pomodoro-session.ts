import type { Prisma } from "@/generated/prisma/client";

type CreatePomodoroSessionOptions = {
  dailyFocusDayId: string;
  durationSeconds: number;
  focusTask?: {
    id: string;
    title: string;
  };
};

export function createPomodoroSession(
  transaction: Prisma.TransactionClient,
  { dailyFocusDayId, durationSeconds, focusTask }: CreatePomodoroSessionOptions,
) {
  return transaction.pomodoroSession.create({
    data: {
      dailyFocusDayId,
      durationSeconds,
      focusTaskId: focusTask?.id ?? null,
      taskTitleSnapshot: focusTask?.title ?? null,
    },
    select: { id: true },
  });
}
