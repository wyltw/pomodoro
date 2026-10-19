"use client";

import { useFocusTasks } from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export function useCurrentFocusTasks(isSignedIn: boolean) {
  const localTasks = useDailyFocusTasksStore((state) => state.tasks);
  const {
    tasks: serverTasks,
    error,
    isLoading,
  } = useFocusTasks({ enabled: isSignedIn });

  return {
    tasks: isSignedIn ? (serverTasks ?? []) : localTasks,
    serverTasks,
    error: isSignedIn ? error : null,
    isLoading: isSignedIn && isLoading,
  };
}
