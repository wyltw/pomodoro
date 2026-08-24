import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { PrismaClient } from "../src/generated/prisma/client";

dayjs.extend(utc);
dayjs.extend(timezone);

const taskIds = [
  "00000000-0000-4000-8000-000000000101",
  "00000000-0000-4000-8000-000000000102",
  "00000000-0000-4000-8000-000000000103",
  "00000000-0000-4000-8000-000000000104",
  "00000000-0000-4000-8000-000000000105",
];

const sessionIds = Array.from(
  { length: 7 * 5 },
  (_, index) =>
    `00000000-0000-4000-8001-${String(index + 1).padStart(12, "0")}`,
);

const databaseUrl = process.env.DIRECT_URL;
const userId = process.env.SEED_USER_ID;
const timeZone = process.env.SEED_TIME_ZONE ?? "Asia/Taipei";

if (!databaseUrl) throw new Error("DIRECT_URL is required to seed data.");
if (!userId) throw new Error("SEED_USER_ID is required to seed data.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function deleteSeedData() {
  await prisma.$transaction([
    prisma.pomodoroSession.deleteMany({
      where: {
        id: { in: sessionIds },
        dailyFocusDay: { userId },
      },
    }),
    prisma.focusTask.deleteMany({
      where: {
        id: { in: taskIds },
        dailyFocusDay: { userId },
      },
    }),
  ]);
}

async function seed() {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`No user exists for SEED_USER_ID ${userId}.`);
  }

  if (process.env.SEED_CLEANUP === "true") {
    await deleteSeedData();
    console.log(`Removed seed data for user ${user.id}.`);
    return;
  }

  const today = dayjs().tz(timeZone);
  const dailyFocusDays = await Promise.all(
    Array.from({ length: 7 }, (_, index) => {
      const localDate = today.subtract(6 - index, "day").format("YYYY-MM-DD");

      return prisma.dailyFocusDay.upsert({
        where: { userId_localDate: { userId: user.id, localDate } },
        update: {},
        create: { userId: user.id, localDate },
        select: { id: true, localDate: true },
      });
    }),
  );

  const currentDay = dailyFocusDays.at(-1);
  if (!currentDay) throw new Error("Unable to create the current focus day.");

  const taskData = [
    {
      title: "[Seed] Plan daily priorities",
      description: "Choose the most important outcomes for today.",
      estimatedPomodoros: 3,
      completedPomodoros: 0,
    },
    {
      title: "[Seed] Draft project proposal",
      description: "Outline the scope, milestones, and open questions.",
      estimatedPomodoros: 4,
      completedPomodoros: 2,
    },
    {
      title: "[Seed] Review pull requests",
      description: "Review pending changes and leave actionable feedback.",
      estimatedPomodoros: 2,
      completedPomodoros: 2,
    },
    {
      title: "[Seed] Clear inbox",
      description: "Process messages that need a response or follow-up.",
      estimatedPomodoros: 3,
      completedPomodoros: 1,
    },
    {
      title: "[Seed] Read technical article",
      description: "Capture useful notes and follow-up ideas.",
      estimatedPomodoros: 2,
      completedPomodoros: 0,
    },
  ];

  const sessionCounts = [2, 4, 3, 5, 1, 4, 3];
  const sessionTitles = [
    "[Seed] Planning",
    "[Seed] Development",
    "[Seed] Review",
  ];
  let sessionIdIndex = 0;

  const sessionData = dailyFocusDays.flatMap((dailyFocusDay, dayIndex) =>
    Array.from({ length: sessionCounts[dayIndex] ?? 0 }, (_, index) => {
      const id = sessionIds[sessionIdIndex];
      sessionIdIndex += 1;
      if (!id) throw new Error("Unable to allocate a seed session ID.");

      return {
        id,
        dailyFocusDayId: dailyFocusDay.id,
        focusTaskId: null,
        taskTitleSnapshot:
          sessionTitles[(dayIndex + index) % sessionTitles.length] ?? null,
        durationSeconds: 25 * 60,
        completedAt: dayjs
          .tz(`${dailyFocusDay.localDate} ${9 + index}:00`, timeZone)
          .toDate(),
      };
    }),
  );

  await prisma.$transaction(async (transaction) => {
    await transaction.pomodoroSession.deleteMany({
      where: {
        id: { in: sessionIds },
        dailyFocusDay: { userId: user.id },
      },
    });
    await transaction.focusTask.deleteMany({
      where: {
        id: { in: taskIds },
        dailyFocusDay: { userId: user.id },
      },
    });
    await transaction.focusTask.createMany({
      data: taskData.map((task, index) => {
        const id = taskIds[index];
        if (!id) throw new Error("Unable to allocate a seed task ID.");

        return { ...task, id, dailyFocusDayId: currentDay.id };
      }),
    });
    await transaction.pomodoroSession.createMany({ data: sessionData });
  });

  console.log(
    `Seeded ${taskData.length} tasks and ${sessionData.length} sessions for user ${user.id}.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
