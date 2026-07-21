"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompletedPomodoros } from "@/lib/api/pomodoro-sessions";

type UseCompletedPomodorosOptions = {
  enabled: boolean;
};

export const completedPomodorosQueryKey = [
  "pomodoro-sessions",
  "completed-count",
] as const;

export function useCompletedPomodoros({
  enabled,
}: UseCompletedPomodorosOptions) {
  const {
    data: completedPomodoros,
    error,
    isLoading,
  } = useQuery({
    enabled,
    queryFn: getCompletedPomodoros,
    queryKey: completedPomodorosQueryKey,
    retry: false,
  });

  return { completedPomodoros, error, isLoading };
}
