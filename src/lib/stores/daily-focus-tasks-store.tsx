"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore, type StoreApi } from "zustand/vanilla";

import { DAILY_FOCUS_TASKS_STORAGE_KEY } from "@/lib/constants";
import { dailyFocusTasksSchema } from "@/lib/schemas";
import type { DailyFocusTasks, FocusTask } from "@/lib/types/types";
import { getLocalDateKey } from "@/lib/utils/utils";

export type DailyFocusTasksState = DailyFocusTasks;

export type DailyFocusTasksActions = {
  addTask: (newTask: FocusTask) => void;
  updateTask: (taskId: string, payload: Partial<FocusTask>) => void;
  removeTask: (taskId: string) => void;
  setActiveTask: (taskId: string) => void;
  clearActiveTask: () => void;
};

export type DailyFocusTasksStore = DailyFocusTasksState &
  DailyFocusTasksActions;

export type DailyFocusTasksStoreApi = StoreApi<DailyFocusTasksStore>;

function hasTaskId(tasks: FocusTask[], taskId: string | undefined) {
  return taskId !== undefined && tasks.some((task) => task.id === taskId);
}

export function createDailyFocusTasksStore(initialValue: DailyFocusTasks) {
  return createStore<DailyFocusTasksStore>()(
    persist(
      (set) => ({
        ...initialValue,
        addTask: (newTask) =>
          set((state) => ({
            tasks: [...state.tasks, newTask],
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
}

const DailyFocusTasksStoreContext =
  createContext<DailyFocusTasksStoreApi | null>(null);

type DailyFocusTasksStoreProviderProps = {
  children: ReactNode;
  initialValue: DailyFocusTasks;
};

export function DailyFocusTasksStoreProvider({
  children,
  initialValue,
}: DailyFocusTasksStoreProviderProps) {
  const [store] = useState(() => createDailyFocusTasksStore(initialValue));

  return (
    <DailyFocusTasksStoreContext.Provider value={store}>
      {children}
    </DailyFocusTasksStoreContext.Provider>
  );
}

export function useDailyFocusTasksStore<T>(
  selector: (store: DailyFocusTasksStore) => T,
) {
  const store = useContext(DailyFocusTasksStoreContext);

  if (!store) {
    throw new Error(
      "useDailyFocusTasksStore must be used within DailyFocusTasksStoreProvider",
    );
  }

  return useStore(store, selector);
}
