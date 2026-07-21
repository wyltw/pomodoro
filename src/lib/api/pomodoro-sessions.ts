import "client-only";

import type { CompletedPomodorosResponse } from "@/lib/types/types";

export async function getCompletedPomodoros() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParams = new URLSearchParams({ timeZone });
  const response = await fetch(`/api/pomodoro-sessions?${searchParams}`);
  const result: CompletedPomodorosResponse = await response.json();

  if (!response.ok || result.data === undefined) {
    throw new Error(result.error ?? "Unable to load completed Pomodoros.");
  }

  return result.data.completedPomodoros;
}
