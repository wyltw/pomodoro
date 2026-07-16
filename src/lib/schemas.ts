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

export const focusTaskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim(),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, "Estimated Pomodoros must be at least 1.")
    .max(8, "Consider splitting this into smaller tasks."),
});
