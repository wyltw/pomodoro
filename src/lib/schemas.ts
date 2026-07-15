import { z } from "zod";

export const focusTaskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().default(""),
  estimatedPomodoros: z.number(),
  completedPomodoros: z.number(),
});

export const localDateSchema = z.iso.date();

export const dailyFocusTasksSchema = z.object({
  localDate: localDateSchema,
  tasks: z.array(focusTaskSchema),
  activeTaskId: z.string().optional(),
});
