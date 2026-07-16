"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { DAILY_FOCUS_TASKS_STORAGE_KEY } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { dailyFocusTasksSchema } from "@/lib/schemas";
import type { DailyFocusTasks, FocusTask } from "@/lib/types/types";
import { getLocalDateKey } from "@/lib/utils/utils";

export type DailyFocusTasksState = DailyFocusTasks;

export type DailyFocusTasksActions = {
  addTask: (
    newTask: Pick<FocusTask, "title" | "description" | "estimatedPomodoros">,
  ) => void;
  updateTask: (taskId: string, payload: Partial<FocusTask>) => void;
  completeActivePomodoro: () => void;
  removeTask: (taskId: string) => void;
  setActiveTask: (taskId: string) => void;
  clearActiveTask: () => void;
  replaceTasks: (tasks: FocusTask[]) => void;
};

export type DailyFocusTasksStore = DailyFocusTasksState &
  DailyFocusTasksActions;

function hasTaskId(tasks: FocusTask[], taskId: string | undefined) {
  return taskId !== undefined && tasks.some((task) => task.id === taskId);
}

type CreateDailyFocusTasksStoreOptions = {
  initialValues?: DailyFocusTasksState;
  shouldPersist?: boolean;
};

export function createDailyFocusTasksStore({
  initialValues = {
    localDate: getLocalDateKey(),
    tasks: [],
    activeTaskId: undefined,
  },
  shouldPersist = true,
}: CreateDailyFocusTasksStoreOptions = {}) {
  const createState = (
    set: (
      partial:
        | Partial<DailyFocusTasksStore>
        | ((state: DailyFocusTasksStore) => Partial<DailyFocusTasksStore>),
    ) => void,
  ): DailyFocusTasksStore => ({
    ...initialValues,
    addTask: (newTask) =>
      set((state) => ({
        tasks: [
          ...state.tasks,
          { ...newTask, completedPomodoros: 0, id: crypto.randomUUID() },
        ],
      })),
    updateTask: (taskId, payload) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...payload } : task,
        ),
      })),
    completeActivePomodoro: () =>
      set((state) => {
        const { activeTaskId, tasks } = state;
        const activeTask = tasks.find((task) => task.id === activeTaskId);
        if (!state.activeTaskId || !activeTask) return state;
        if (activeTask.completedPomodoros + 1 > activeTask.estimatedPomodoros) {
          return {
            activeTaskId: undefined,
          };
        }

        return {
          tasks: tasks.map((task) =>
            task.id === state.activeTaskId
              ? {
                  ...task,
                  completedPomodoros: task.completedPomodoros + 1,
                }
              : task,
          ),
        };
      }),
    removeTask: (taskId) =>
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),
    setActiveTask: (taskId) => set({ activeTaskId: taskId }),
    clearActiveTask: () => set({ activeTaskId: undefined }),
    replaceTasks: (tasks) =>
      set((state) => ({
        tasks,
        activeTaskId: hasTaskId(tasks, state.activeTaskId)
          ? state.activeTaskId
          : undefined,
      })),
  });

  if (!shouldPersist) {
    return createStore<DailyFocusTasksStore>()(createState);
  }

  return createStore<DailyFocusTasksStore>()(
    persist(createState, {
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
    }),
  );
}

type DailyFocusTasksStoreApi = ReturnType<typeof createDailyFocusTasksStore>;

const DailyFocusTasksStoreContext =
  createContext<DailyFocusTasksStoreApi | null>(null);

type DailyFocusTasksStoreProviderProps = Pick<
  CreateDailyFocusTasksStoreOptions,
  "initialValues"
> & {
  children: ReactNode;
};

export function DailyFocusTasksStoreProvider({
  children,
  initialValues,
}: DailyFocusTasksStoreProviderProps) {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  return (
    <DailyFocusTasksStoreProviderInner
      key={userId ?? "anonymous"}
      initialValues={initialValues}
      shouldPersist={!userId}
    >
      {children}
    </DailyFocusTasksStoreProviderInner>
  );
}

type DailyFocusTasksStoreProviderInnerProps =
  DailyFocusTasksStoreProviderProps & {
    shouldPersist: boolean;
  };

function DailyFocusTasksStoreProviderInner({
  children,
  initialValues,
  shouldPersist,
}: DailyFocusTasksStoreProviderInnerProps) {
  const [store] = useState(() =>
    createDailyFocusTasksStore({ initialValues, shouldPersist }),
  );
  return (
    <DailyFocusTasksStoreContext.Provider value={store}>
      {children}
    </DailyFocusTasksStoreContext.Provider>
  );
}

export function useDailyFocusTasksStore<T>(
  selector: (state: DailyFocusTasksStore) => T,
) {
  const store = useContext(DailyFocusTasksStoreContext);

  if (!store) {
    throw new Error(
      "useDailyFocusTasksStore must be used within DailyFocusTasksStoreProvider",
    );
  }

  return useStore(store, selector);
}
