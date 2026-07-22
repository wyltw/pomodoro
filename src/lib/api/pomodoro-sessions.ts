import "client-only";

import type { TodayPomodoroCountResponse } from "@/lib/types/types";

export async function getTodayPomodoroCount() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParams = new URLSearchParams({ timeZone });
  const response = await fetch(`/api/pomodoro-sessions/today?${searchParams}`);
  const result: TodayPomodoroCountResponse = await response.json();

  if (!response.ok || result.data === undefined) {
    throw new Error(result.error ?? "Unable to load today's Pomodoro count.");
  }

  return result.data.count;
}
