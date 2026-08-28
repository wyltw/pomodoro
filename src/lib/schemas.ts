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
    .max(8, { error: "Split into smaller tasks." }),
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
    .max(8, { error: "Split into smaller tasks." }),
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

export const timerSettingsSchema = z.object({
  pomodoroMinutes: z
    .number({ error: "Pomodoro length is required." })
    .int({ error: "Pomodoro length must be a whole number of minutes." })
    .min(1, { error: "Pomodoro length must be at least 1 minute." })
    .max(60, { error: "Pomodoro length cannot exceed 60 minutes." }),
  notificationVolume: z
    .number({ error: "Notification volume is invalid." })
    .min(0, { error: "Notification volume is invalid." })
    .max(1, { error: "Notification volume is invalid." }),
});

export const focusTaskFormSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z.string().trim(),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, { error: "Enter at least 1." })
    .max(8, { error: "Split into smaller tasks." }),
});
