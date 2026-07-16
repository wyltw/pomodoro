import "client-only";

import type { FocusTasksResponse } from "@/lib/types/types";

export const focusTasksQueryKey = (localDate: string) =>
  ["focus-tasks", localDate] as const;

export async function getFocusTasks(localDate: string) {
  const searchParams = new URLSearchParams({ localDate });
  const response = await fetch(`/api/focus-tasks?${searchParams}`);
  const result: FocusTasksResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Unable to load focus tasks.");
  }

  return result.data;
}
