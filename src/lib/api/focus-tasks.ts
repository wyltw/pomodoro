import "client-only";

import type { FocusTasksResponse } from "@/lib/types/types";

export async function getFocusTasks() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParams = new URLSearchParams({ timeZone });
  const response = await fetch(`/api/focus-tasks?${searchParams}`);
  const result: FocusTasksResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Unable to load focus tasks.");
  }

  return result.data;
}
