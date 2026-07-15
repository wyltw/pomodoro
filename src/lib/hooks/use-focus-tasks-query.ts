"use client";

import { useQuery } from "@tanstack/react-query";

import { focusTasksQueryKey, getFocusTasks } from "@/lib/api/focus-tasks";

type UseFocusTasksQueryOptions = {
  enabled: boolean;
  localDate: string;
};

export function useFocusTasksQuery({
  enabled,
  localDate,
}: UseFocusTasksQueryOptions) {
  const { data: tasks } = useQuery({
    enabled,
    queryFn: () => getFocusTasks(localDate),
    queryKey: focusTasksQueryKey(localDate),
  });

  return { tasks };
}
