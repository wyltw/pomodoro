import type { z } from "zod";

import type {
  createFocusTaskPayloadSchema,
  dailyFocusTasksSchema,
  focusTaskSchema,
  updateFocusTaskPayloadSchema,
} from "@/lib/schemas";

export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

export type FocusTask = z.infer<typeof focusTaskSchema>;

export type CreateFocusTaskPayload = z.input<
  typeof createFocusTaskPayloadSchema
>;

export type UpdateFocusTaskPayload = z.input<
  typeof updateFocusTaskPayloadSchema
>;

export type DailyFocusTasks = z.infer<typeof dailyFocusTasksSchema>;

export type ApiResponse<T, E> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: E;
    };

export type FocusTasksResponse = ApiResponse<FocusTask[], string>;
