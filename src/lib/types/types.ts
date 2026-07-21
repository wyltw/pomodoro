import type { z } from "zod";

import type {
  completePomodoroPayloadSchema,
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

export type CompletePomodoroPayload = z.infer<
  typeof completePomodoroPayloadSchema
>;

export type CompletePomodoroResult = {
  completedTaskId?: string;
};

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

export type CompletedPomodorosResponse = ApiResponse<
  { completedPomodoros: number },
  string
>;
