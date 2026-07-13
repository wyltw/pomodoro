import prisma from "../prisma";

export const getCurrentUserTasks = async (localDate: string) => {
  const user = "00000000-0000-4000-8000-000000000101";
  // TODO: use DAL in future to get user.
  const dailyFocusDay = await prisma.dailyFocusDay.findUnique({
    where: {
      userId_localDate: {
        userId: user,
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
