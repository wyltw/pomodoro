import { useCallback, useEffect, useReducer } from "react";

import {
  type TimerStatus,
  useTimerStatus,
} from "@/lib/contexts/timer-status-context";

type TimerState = {
  endSeconds: number;
  seconds: number;
  status: TimerStatus;
};

type TimerAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "stop"; initialSeconds: number }
  | { type: "setEndSeconds"; endSeconds: number }
  | { type: "tick"; initialSeconds: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "start":
      return { ...state, status: "running" };
    case "pause":
      return { ...state, status: "paused" };
    case "stop":
      return { ...state, seconds: action.initialSeconds, status: "idle" };
    case "setEndSeconds":
      if (state.endSeconds === action.endSeconds) return state;

      return { ...state, endSeconds: action.endSeconds };
    case "tick": {
      if (state.status !== "running") return state;

      if (state.seconds >= state.endSeconds) {
        return {
          ...state,
          seconds: action.initialSeconds,
          status: "completed",
        };
      }

      return {
        ...state,
        seconds: Math.min(state.seconds + 1, state.endSeconds),
      };
    }
  }
}

export const useTimer = (initialSeconds: number, endSeconds: number) => {
  const [state, dispatch] = useReducer(timerReducer, {
    endSeconds,
    seconds: initialSeconds,
    status: "idle",
  });
  const { status } = state;
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
    if (status !== "idle") return;

    // Apply duration changes only while idle so an active session keeps its original end.
    dispatch({ type: "setEndSeconds", endSeconds });
  }, [endSeconds, status]);

  useEffect(() => {
    // Reset the shared context status; local reducer state is discarded on unmount.
    return () => {
      setStatus("idle");
    };
  }, [setStatus]);

  useEffect(() => {
    if (status !== "running") return;

    // status changes trigger cleaner function, so countdown will stop automatically
    const intervalId = setInterval(() => {
      dispatch({ type: "tick", initialSeconds });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, initialSeconds]);
  return { ...state, startTimer, pauseTimer, stopTimer };
};
