import "client-only";

import { focusTaskSchema } from "@/lib/schemas";

export const focusTasksQueryKey = (localDate: string) =>
  ["focus-tasks", localDate] as const;

export async function getFocusTasks(localDate: string) {
  const searchParams = new URLSearchParams({ localDate });
  const response = await fetch(`/api/focus-tasks?${searchParams}`);

  if (!response.ok) {
    throw new Error("Unable to load focus tasks.");
  }

  return focusTaskSchema.array().parse(await response.json());
}
