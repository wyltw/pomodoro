import { z } from "zod";

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export const focusTaskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  estimatedPomodoros: z.number(),
  completedPomodoros: z.number(),
});

export const focusTaskIdSchema = z.uuid({ error: "Invalid focus task ID." });

export const localDateSchema = z.iso.date();

export const timeZoneSchema = z
  .string()
  .trim()
  .min(1, { error: "Time zone is required." })
  .refine(isValidTimeZone, { error: "Time zone is invalid." });

export const createFocusTaskPayloadSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, { error: "Enter at least 1." })
    .max(8, { error: "Consider splitting this into smaller tasks." }),
  timeZone: timeZoneSchema,
});

export const updateFocusTaskPayloadSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, { error: "Enter at least 1." })
    .max(8, { error: "Consider splitting this into smaller tasks." }),
});

export const completePomodoroPayloadSchema = z.object({
  taskId: focusTaskIdSchema.optional(),
  timeZone: timeZoneSchema,
  durationSeconds: z
    .number({ error: "Session duration is required." })
    .int({ error: "Session duration must be a whole number of seconds." })
    .positive({ error: "Session duration must be greater than zero." }),
});

export const dailyFocusTasksSchema = z.object({
  localDate: localDateSchema,
  tasks: z.array(focusTaskSchema),
  activeTaskId: z.string().optional(),
});

export const focusTaskFormSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z.string().trim(),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, { error: "Enter at least 1." })
    .max(8, { error: "Consider splitting this into smaller tasks." }),
});
