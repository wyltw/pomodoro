"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useTimerSettingsStore = create<TimerSettingsStore>()(
  persist(
    (set) => ({
      ...defaultTimerSettings,
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
