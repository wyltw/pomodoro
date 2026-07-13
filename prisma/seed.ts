import "dotenv/config";

import prisma from "@/lib/prisma";

const seedUserId = "00000000-0000-4000-8000-000000000001";
const seedDayId = "00000000-0000-4000-8000-000000000002";
const seedLocalDate = "2026-01-01";

const seedTasks = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "Plan the day",
    description: "Choose the most important tasks for today.",
    estimatedPomodoros: 1,
    completedPomodoros: 1,
    completedAt: new Date("2026-01-01T01:25:00.000Z"),
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "Build the focus history",
    description: "Implement the first version of focus tracking.",
    estimatedPomodoros: 3,
    completedPomodoros: 2,
    completedAt: null,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "Review today's progress",
    description: "Check completed tasks and pomodoros.",
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    completedAt: null,
  },
] as const;

async function main() {
  await prisma.user.upsert({
    where: { id: seedUserId },
    update: {
      name: "Seed User",
      email: "seed@example.com",
    },
    create: {
      id: seedUserId,
      name: "Seed User",
      email: "seed@example.com",
    },
  });

  await prisma.dailyFocusDay.upsert({
    where: {
      userId_localDate: {
        userId: seedUserId,
        localDate: seedLocalDate,
      },
    },
    update: {
      completedPomodoros: 3,
    },
    create: {
      id: seedDayId,
      userId: seedUserId,
      localDate: seedLocalDate,
      completedPomodoros: 3,
    },
  });

  for (const task of seedTasks) {
    await prisma.focusTask.upsert({
      where: { id: task.id },
      update: {
        dailyFocusDayId: seedDayId,
        title: task.title,
        description: task.description,
        estimatedPomodoros: task.estimatedPomodoros,
        completedPomodoros: task.completedPomodoros,
        completedAt: task.completedAt,
      },
      create: {
        ...task,
        dailyFocusDayId: seedDayId,
      },
    });
  }

  console.log("Seeded one user, one focus day, and three focus tasks.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
