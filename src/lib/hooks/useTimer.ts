import { useCallback, useEffect, useReducer } from "react";

import {
  type TimerStatus,
  useTimerStatus,
} from "@/lib/contexts/timer-status-context";

type TimerState = {
  deadlineMs: number | null;
  durationMs: number;
  remainingMs: number;
  status: TimerStatus;
};

type TimerAction =
  | { type: "start"; nowMs: number }
  | { type: "pause"; nowMs: number }
  | { type: "stop" }
  | { type: "setDuration"; durationMs: number }
  | { type: "tick"; nowMs: number };

const COMPLETION_DISPLAY_MS = 1000;

function getDurationMs(initialSeconds: number, endSeconds: number) {
  return Math.max(0, endSeconds - initialSeconds) * 1000;
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "start":
      if (state.status === "running") return state;

      return {
        ...state,
        deadlineMs: action.nowMs + state.remainingMs,
        status: "running",
      };
    case "pause": {
      if (state.status !== "running" || state.deadlineMs === null) return state;

      const remainingMs = Math.max(0, state.deadlineMs - action.nowMs);

      return {
        ...state,
        deadlineMs: null,
        remainingMs,
        status: "paused",
      };
    }
    case "stop":
      return {
        ...state,
        deadlineMs: null,
        remainingMs: state.durationMs,
        status: "idle",
      };
    case "setDuration":
      if (state.durationMs === action.durationMs) return state;

      return {
        ...state,
        durationMs: action.durationMs,
        remainingMs: action.durationMs,
      };
    case "tick": {
      if (state.status !== "running" || state.deadlineMs === null) return state;

      if (action.nowMs >= state.deadlineMs + COMPLETION_DISPLAY_MS) {
        return {
          ...state,
          deadlineMs: null,
          remainingMs: state.durationMs,
          status: "completed",
        };
      }

      return {
        ...state,
        remainingMs: Math.max(0, state.deadlineMs - action.nowMs),
      };
    }
  }
}

export const useTimer = (
  initialSeconds: number,
  configuredEndSeconds: number,
) => {
  const configuredDurationMs = getDurationMs(
    initialSeconds,
    configuredEndSeconds,
  );
  const [state, dispatch] = useReducer(timerReducer, {
    deadlineMs: null,
    durationMs: configuredDurationMs,
    remainingMs: configuredDurationMs,
    status: "idle",
  });
  const { durationMs, remainingMs, status } = state;
  const elapsedSeconds = Math.floor((durationMs - remainingMs) / 1000);
  const endSeconds = initialSeconds + durationMs / 1000;
  const seconds = initialSeconds + elapsedSeconds;
  const { setStatus } = useTimerStatus();

  const stopTimer = useCallback(() => {
    dispatch({ type: "stop" });
  }, []);

  const pauseTimer = useCallback(() => {
    dispatch({ type: "pause", nowMs: Date.now() });
  }, []);

  const startTimer = useCallback(() => {
    dispatch({ type: "start", nowMs: Date.now() });
  }, []);

  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);

  useEffect(() => {
    if (status !== "idle") return;

    // Apply duration changes only while idle so an active session keeps its original end.
    dispatch({ type: "setDuration", durationMs: configuredDurationMs });
  }, [configuredDurationMs, status]);

  useEffect(() => {
    // Reset the shared context status; local reducer state is discarded on unmount.
    return () => {
      setStatus("idle");
    };
  }, [setStatus]);

  useEffect(() => {
    if (status !== "running") return;

    // The interval refreshes the display; the deadline remains the time source.
    const intervalId = setInterval(() => {
      dispatch({ type: "tick", nowMs: Date.now() });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status]);

  return {
    endSeconds,
    seconds,
    status,
    startTimer,
    pauseTimer,
    stopTimer,
  };
};
