"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import { getFocusTasks } from "@/lib/api/focus-tasks";
import {
  createFocusTask,
  deleteFocusTask,
  updateFocusTask,
} from "../actions/focus-task-actions";
import type {
  CreateFocusTaskPayload,
  UpdateFocusTaskPayload,
} from "../types/types";

type UseFocusTasksQueryOptions = {
  enabled: boolean;
  localDate: string;
};

export type CreateFocusTaskVariables = {
  payload: CreateFocusTaskPayload;
};

type UseCreateFocusTaskOptions = Omit<
  UseMutationOptions<void, Error, CreateFocusTaskVariables>,
  "mutationFn"
>;

export type UpdateFocusTaskVariables = {
  taskId: string;
  payload: UpdateFocusTaskPayload;
};

export type DeleteFocusTaskVariables = {
  taskId: string;
};

type UseUpdateFocusTaskOptions = Omit<
  UseMutationOptions<void, Error, UpdateFocusTaskVariables>,
  "mutationFn"
>;

type UseDeleteFocusTaskOptions = Omit<
  UseMutationOptions<void, Error, DeleteFocusTaskVariables>,
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
  return useMutation({
    ...options,
    mutationFn: ({ payload }) => createFocusTask(payload),
  });
}

export function useUpdateFocusTask(options: UseUpdateFocusTaskOptions) {
  return useMutation({
    ...options,
    mutationFn: ({ taskId, payload }) => updateFocusTask(taskId, payload),
  });
}

export function useDeleteFocusTask(options: UseDeleteFocusTaskOptions) {
  return useMutation({
    ...options,
    mutationFn: ({ taskId }) => deleteFocusTask(taskId),
  });
}
