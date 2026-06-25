"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DAILY_FOCUS_TASKS_STORAGE_KEY } from "@/lib/constants";
import { dailyFocusTasksSchema } from "@/lib/schemas";
import type { DailyFocusTasks, FocusTask } from "@/lib/types/types";
import { getLocalDateKey } from "@/lib/utils/utils";
import { randomUUID } from "crypto";

export type DailyFocusTasksState = DailyFocusTasks;

export type DailyFocusTasksActions = {
  addTask: (newTask: Pick<FocusTask, "title" | "estimatedPomodoros">) => void;
  updateTask: (taskId: string, payload: Partial<FocusTask>) => void;
  removeTask: (taskId: string) => void;
  setActiveTask: (taskId: string) => void;
  clearActiveTask: () => void;
};

export type DailyFocusTasksStore = DailyFocusTasksState &
  DailyFocusTasksActions;

function hasTaskId(tasks: FocusTask[], taskId: string | undefined) {
  return taskId !== undefined && tasks.some((task) => task.id === taskId);
}

export const useDailyFocusTasksStore = create<DailyFocusTasksStore>()(
  persist(
    (set) => ({
      localDate: getLocalDateKey(),
      tasks: [],
      activeTaskId: undefined,
      addTask: (newTask) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...newTask, completedPomodoros: 0, id: randomUUID() },
          ],
        })),
      updateTask: (taskId, payload) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...payload } : task,
          ),
        })),
      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      setActiveTask: (taskId) => set({ activeTaskId: taskId }),
      clearActiveTask: () => set({ activeTaskId: undefined }),
    }),
    {
      name: DAILY_FOCUS_TASKS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ localDate, tasks, activeTaskId }) => ({
        localDate,
        tasks,
        activeTaskId,
      }),
      merge: (persistedState, currentState) => {
        const today = getLocalDateKey();
        const persisted = dailyFocusTasksSchema.safeParse(persistedState);

        if (!persisted.success) return { ...currentState, localDate: today };

        const { localDate, tasks, activeTaskId } = persisted.data;
        if (persisted.data.localDate === today) {
          return {
            ...currentState,
            localDate,
            tasks,
            activeTaskId: hasTaskId(tasks, activeTaskId)
              ? activeTaskId
              : undefined,
          };
        }

        const remainingTasks = tasks.filter(
          (task) => task.completedPomodoros < task.estimatedPomodoros,
        );
        return {
          ...currentState,
          localDate: today,
          activeTaskId: hasTaskId(remainingTasks, activeTaskId)
            ? activeTaskId
            : undefined,
          tasks: remainingTasks,
        };
      },
    },
  ),
);
