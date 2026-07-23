"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { TIMER_SETTINGS_STORAGE_KEY } from "@/lib/constants";
import { timerSettingsSchema } from "@/lib/schemas";
import type { z } from "zod";

export type TimerSettings = z.infer<typeof timerSettingsSchema>;

type TimerSettingsActions = {
  updateSettings: (settings: TimerSettings) => void;
};

type TimerSettingsStore = TimerSettings & TimerSettingsActions;

export const defaultTimerSettings: TimerSettings = {
  pomodoroMinutes: 25,
  notificationVolume: 0.35,
};

export function createTimerSettingsStore(
  initialSettings: TimerSettings = defaultTimerSettings,
) {
  return createStore<TimerSettingsStore>()(
    persist(
      (set) => ({
        ...initialSettings,
        updateSettings: (settings) => set(settings),
      }),
      {
        name: TIMER_SETTINGS_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: ({ pomodoroMinutes, notificationVolume }) => ({
          pomodoroMinutes,
          notificationVolume,
        }),
        merge: (persistedState, currentState) => {
          const settings = timerSettingsSchema.safeParse(persistedState);

          if (!settings.success) return currentState;

          return {
            ...currentState,
            ...settings.data,
          };
        },
      },
    ),
  );
}

type TimerSettingsStoreApi = ReturnType<typeof createTimerSettingsStore>;

const TimerSettingsStoreContext = createContext<TimerSettingsStoreApi | null>(
  null,
);

export function TimerSettingsProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createTimerSettingsStore());

  return (
    <TimerSettingsStoreContext.Provider value={store}>
      {children}
    </TimerSettingsStoreContext.Provider>
  );
}

export function useTimerSettingsStore<T>(
  selector: (state: TimerSettingsStore) => T,
) {
  const store = useContext(TimerSettingsStoreContext);

  if (!store) {
    throw new Error(
      "useTimerSettingsStore must be used within TimerSettingsProvider",
    );
  }

  return useStore(store, selector);
}
