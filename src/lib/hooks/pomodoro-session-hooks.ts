"use client";

import { useQuery } from "@tanstack/react-query";

import { getTodayPomodoroCount } from "@/lib/api/pomodoro-sessions";

type UseTodayPomodoroCountOptions = {
  enabled: boolean;
};

export const todayPomodoroCountQueryKey = [
  "pomodoro-sessions",
  "today",
] as const;

export function useTodayPomodoroCount({
  enabled,
}: UseTodayPomodoroCountOptions) {
  const {
    data: count,
    error,
    isLoading,
  } = useQuery({
    enabled,
    queryFn: getTodayPomodoroCount,
    queryKey: todayPomodoroCountQueryKey,
    retry: false,
  });

  return { count, error, isLoading };
}
