"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";

import { getOrCreateDailyFocusDay } from "@/lib/actions/daily-focus-day-actions";
import { focusTasksQueryKey } from "@/lib/hooks/focus-task-hooks";
import { getLocalDateKey } from "@/lib/utils/utils";

export function useInitializeDailyFocusDay(userId: string | undefined) {
  const queryClient = useQueryClient();
  const initializeDailyFocusDay = useEffectEvent(async () => {
    const localDate = getLocalDateKey();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await getOrCreateDailyFocusDay(localDate, timeZone);
    await queryClient.invalidateQueries({
      queryKey: focusTasksQueryKey(localDate),
    });
  });

  useEffect(() => {
    if (!userId) return;
    void initializeDailyFocusDay();
  }, [userId]);
}
