import "client-only";

import type { FocusStatisticsResponse } from "@/lib/types/types";

export async function getFocusStatistics() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParams = new URLSearchParams({ timeZone });
  const response = await fetch(`/api/statistics/focus?${searchParams}`);
  const result: FocusStatisticsResponse = await response.json();

  if (!response.ok || result.data === undefined) {
    throw new Error(result.error ?? "Unable to load focus statistics.");
  }

  return result.data;
}
