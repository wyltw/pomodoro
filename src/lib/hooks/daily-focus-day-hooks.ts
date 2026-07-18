"use client";

import { useEffect, useEffectEvent } from "react";

import { getOrCreateDailyFocusDay } from "@/lib/actions/daily-focus-day-actions";
import { getLocalDateKey } from "@/lib/utils/utils";

export function useInitializeDailyFocusDay(userId: string | undefined) {
  const initializeDailyFocusDay = useEffectEvent(async () => {
    const localDate = getLocalDateKey();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await getOrCreateDailyFocusDay(localDate, timeZone);
  });

  useEffect(() => {
    if (!userId) return;
    void initializeDailyFocusDay();
  }, [userId]);
}
