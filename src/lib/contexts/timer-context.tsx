"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useTimer } from "@/lib/hooks/useTimer";

type Timer = ReturnType<typeof useTimer>;
type TimerData = Pick<Timer, "seconds" | "status">;
type TimerApi = Pick<Timer, "startTimer" | "pauseTimer" | "stopTimer">;

const TimerDataContext = createContext<TimerData | null>(null);
const TimerApiContext = createContext<TimerApi | null>(null);

type TimerContextProviderProps = {
  children: ReactNode;
  initialSeconds: number;
  endSeconds: number;
};

export function TimerContextProvider({
  children,
  endSeconds,
  initialSeconds,
}: TimerContextProviderProps) {
  const { seconds, status, startTimer, pauseTimer, stopTimer } =
    useTimer(initialSeconds, endSeconds);

  const data = useMemo(
    () => ({
      seconds,
      status,
    }),
    [seconds, status],
  );

  const api = useMemo(
    () => ({
      startTimer,
      pauseTimer,
      stopTimer,
    }),
    [startTimer, pauseTimer, stopTimer],
  );

  return (
    <TimerDataContext.Provider value={data}>
      <TimerApiContext.Provider value={api}>
        {children}
      </TimerApiContext.Provider>
    </TimerDataContext.Provider>
  );
}

export function useTimerData() {
  const data = useContext(TimerDataContext);

  if (!data) {
    throw new Error("useTimerData must be used within TimerContextProvider");
  }

  return data;
}

export function useTimerApi() {
  const api = useContext(TimerApiContext);

  if (!api) {
    throw new Error("useTimerApi must be used within TimerContextProvider");
  }

  return api;
}
