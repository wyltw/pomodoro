"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import { getFocusTasks } from "@/lib/api/focus-tasks";
import { createFocusTask } from "../actions/focus-task-actions";
import type { CreateFocusTaskPayload } from "../types/types";

type UseFocusTasksQueryOptions = {
  enabled: boolean;
  localDate: string;
};

type UseCreateFocusTaskOptions = Omit<
  UseMutationOptions<void, Error, CreateFocusTaskPayload>,
  "mutationFn"
>;

export const focusTasksQueryKey = (localDate: string) =>
  ["focus-tasks", localDate] as const;

export function useFocusTasks({
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

export function useCreateFocusTask(options: UseCreateFocusTaskOptions) {
  return useMutation({ ...options, mutationFn: createFocusTask });
}
