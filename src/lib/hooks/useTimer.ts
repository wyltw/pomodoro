import { useCallback, useEffect, useReducer } from "react";

import {
  type TimerStatus,
  useTimerStatus,
} from "@/lib/contexts/timer-status-context";

type TimerState = {
  seconds: number;
  status: TimerStatus;
};

type TimerAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "stop"; initialSeconds: number }
  | { type: "tick"; initialSeconds: number; endSeconds: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "start":
      return { ...state, status: "running" };
    case "pause":
      return { ...state, status: "paused" };
    case "stop":
      return { seconds: action.initialSeconds, status: "idle" };
    case "tick": {
      if (state.status !== "running") return state;

      if (state.seconds >= action.endSeconds) {
        return {
          seconds: action.initialSeconds,
          status: "completed",
        };
      }

      return {
        ...state,
        seconds: Math.min(state.seconds + 1, action.endSeconds),
      };
    }
  }
}

export const useTimer = (initialSeconds: number, endSeconds: number) => {
  const [{ seconds, status }, dispatch] = useReducer(timerReducer, {
    seconds: initialSeconds,
    status: "idle",
  });
  const { setStatus } = useTimerStatus();

  const stopTimer = useCallback(() => {
    dispatch({ type: "stop", initialSeconds });
  }, [initialSeconds]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: "pause" });
  }, []);

  const startTimer = useCallback(() => {
    dispatch({ type: "start" });
  }, []);

  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);

  useEffect(() => {
    return () => {
      setStatus("idle");
    };
  }, [setStatus]);

  useEffect(() => {
    if (status !== "running") return;

    // status changes trigger cleaner function, so countdown will stop automatically
    const intervalId = setInterval(() => {
      dispatch({ type: "tick", initialSeconds, endSeconds });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, initialSeconds, endSeconds]);
  return { seconds, status, startTimer, pauseTimer, stopTimer };
};
