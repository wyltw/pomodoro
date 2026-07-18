import { z } from "zod";

export const focusTaskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  estimatedPomodoros: z.number(),
  completedPomodoros: z.number(),
});

export const createFocusTaskPayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, "Enter at least 1.")
    .max(8, "Consider splitting this into smaller tasks."),
});

export const updateFocusTaskPayloadSchema = createFocusTaskPayloadSchema;

export const focusTaskIdSchema = z.uuid("Invalid focus task ID.");

export const localDateSchema = z.iso.date();

export const dailyFocusTasksSchema = z.object({
  localDate: localDateSchema,
  tasks: z.array(focusTaskSchema),
  activeTaskId: z.string().optional(),
});

export const focusTaskFormSchema = createFocusTaskPayloadSchema.extend({
  description: z.string().trim(),
});
