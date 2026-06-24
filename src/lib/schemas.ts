import { z } from "zod";

export const focusTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  estimatedPomodoros: z.number(),
  completedPomodoros: z.number(),
});

export const dailyFocusTasksSchema = z.object({
  localDate: z.string(),
  tasks: z.array(focusTaskSchema),
  activeTaskId: z.string().optional(),
});
