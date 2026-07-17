"use client";

import { useQuery } from "@tanstack/react-query";

import { getFocusTasks } from "@/lib/api/focus-tasks";

type UseFocusTasksQueryOptions = {
  enabled: boolean;
  localDate: string;
};

export const focusTasksQueryKey = (localDate: string) =>
  ["focus-tasks", localDate] as const;

export function useFocusTasksQuery({
  enabled,
  localDate,
}: UseFocusTasksQueryOptions) {
  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery({
    enabled,
    queryFn: () => getFocusTasks(localDate),
    queryKey: focusTasksQueryKey(localDate),
    retry: false,
  });

  return { tasks, error, isLoading };
}
