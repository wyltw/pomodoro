"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

type TimerStatusContextValue = {
  status: TimerStatus;
  setStatus: (status: TimerStatus) => void;
};

const TimerStatusContext = createContext<TimerStatusContextValue | null>(null);

type TimerStatusProviderProps = {
  children: ReactNode;
};

export function TimerStatusProvider({ children }: TimerStatusProviderProps) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const value = useMemo(() => ({ status, setStatus }), [status]);

  return (
    <TimerStatusContext.Provider value={value}>
      {children}
    </TimerStatusContext.Provider>
  );
}

export function useTimerStatus() {
  const context = useContext(TimerStatusContext);

  if (!context) {
    throw new Error("useTimerStatus must be used within TimerStatusProvider");
  }

  return context;
}
